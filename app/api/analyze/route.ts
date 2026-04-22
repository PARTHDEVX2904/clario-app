import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getOCRAdapter } from "@/lib/ocr/adapter";
import { getAIAdapter } from "@/lib/ai/adapter";
import { preprocessForOCR, checkImageQuality } from "@/lib/ocr/preprocess";
import { createVisionOCR } from "@/lib/ocr/vision-ocr";
import { cleanOCRText } from "@/lib/ocr/postprocess";
import { validateAIOutput } from "@/lib/ai/validate";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { runAllHeuristics } from "@/lib/billing/heuristics";
import { findCondition } from "@/lib/billing/conditions-kb";
import type { EpisodeOfCare } from "@/types";

export const maxDuration = 120; // allows up to 2 Gemini retries on rate-limit

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const billFile = formData.get("bill") as File | null;
    const episodeRaw = formData.get("episode") as string | null;

    if (!billFile) {
      return NextResponse.json({ error: "Bill file is required" }, { status: 400 });
    }

    let episode: Partial<EpisodeOfCare> = {};
    if (episodeRaw) {
      try {
        episode = JSON.parse(episodeRaw) as Partial<EpisodeOfCare>;
      } catch {
        return NextResponse.json({ error: "Invalid episode data" }, { status: 400 });
      }
    }

    // Look up condition knowledge base entry for this patient's diagnosis
    const conditionEntry = findCondition(episode.healthIssueDescription ?? "") ?? undefined;
    if (conditionEntry) {
      console.log(`[KB] Matched condition: "${conditionEntry.conditionName}" for health issue: "${episode.healthIssueDescription}"`);
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(billFile.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, JPG, or PNG." },
        { status: 400 }
      );
    }

    // Validate file size (10MB)
    if (billFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const caseId = uuidv4();

    // Get authenticated user (null if anonymous)
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();

    // ── Read file buffer ──────────────────────────────────────────────────────
    const fileBuffer = Buffer.from(await billFile.arrayBuffer());
    const fileMimeType = billFile.type;
    const IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const isImageFile = IMAGE_TYPES.includes(fileMimeType);

    // ── Stage A: Image preprocessing ─────────────────────────────────────────
    const processedBuffer = await preprocessForOCR(fileBuffer, fileMimeType);

    // ── Stage B: Quality gate (non-blocking — warns but doesn't block) ────────
    let imageQualityWarning: string | undefined;
    if (isImageFile) {
      const quality = await checkImageQuality(fileBuffer);
      if (quality.isLowRes) {
        imageQualityWarning = quality.warning;
        console.warn("[Quality]", quality.warning);
      }
    }

    // ── Stage C: OCR — Vision API for images, pdf-parse/Tesseract for PDFs ───
    let ocrText = "";
    try {
      const visionOCR = createVisionOCR();
      if (isImageFile && visionOCR) {
        const ocrResult = await visionOCR.extractText(processedBuffer, fileMimeType);
        ocrText = ocrResult.text;
        console.log(`[OCR] provider=${ocrResult.provider} confidence=${ocrResult.confidence} chars=${ocrText.length}`);
      } else {
        const ocrAdapter = await getOCRAdapter();
        const ocrResult = await ocrAdapter.extractText(processedBuffer, fileMimeType);
        ocrText = ocrResult.text;
        console.log(`[OCR] provider=${ocrResult.provider} confidence=${ocrResult.confidence} chars=${ocrText.length}`);
      }
      if (ocrText.length < 50) {
        console.warn("[OCR] Very short output — image may be low quality or blank");
      }
    } catch (err) {
      console.error("OCR failed:", err);
      if (!isImageFile) {
        return NextResponse.json({ error: "Failed to extract text from the bill." }, { status: 500 });
      }
      // For images: non-fatal — LLM will note the empty input
    }

    // ── Stage D: Post-process extracted text ─────────────────────────────────
    ocrText = cleanOCRText(ocrText);

    // ── Stage E–F: AI Analysis + JSON validation + Persist ───────────────────
    let analysisId: string;
    try {
      const aiAdapter = await getAIAdapter();
      const aiOutput = await aiAdapter.analyzeBill({
        caseId,
        ocrText,
        episode: episode as EpisodeOfCare,
        conditionContext: conditionEntry,
      });

      // Validate and coerce AI output schema before any downstream use
      validateAIOutput(aiOutput);
      // ── Sanity-check AI output: fix hallucinated totals ───────────────────────
      // Recalculate totalBilled from line items if AI value seems wrong
      const lineItemsSum = aiOutput.lineItems.reduce((s, i) => s + (i.totalPrice || 0), 0);
      if (
        lineItemsSum > 0 &&
        (aiOutput.totalBilled <= 0 ||
          Math.abs(lineItemsSum - aiOutput.totalBilled) / (aiOutput.totalBilled || 1) > 0.3)
      ) {
        // AI-provided total deviates >30% from line items sum — use line items sum
        aiOutput.totalBilled = lineItemsSum;
      }

      // ── Heuristic post-pass: upgrade AI flags using pattern matching ──────────
      const heuristicFlags = runAllHeuristics(
        aiOutput.lineItems as Parameters<typeof runAllHeuristics>[0],
        episode,
        conditionEntry
      );
      heuristicFlags.forEach((flag) => {
        const item = aiOutput.lineItems[flag.lineItemIndex];
        if (!item) return;
        // Only upgrade severity — never downgrade a flag the AI already set
        if (item.flagStatus === "valid") {
          item.flagStatus = "review_needed";
          item.flagReason = flag.reason;
        } else if (item.flagStatus === "review_needed" && flag.severity === "alert") {
          item.flagStatus = "possibly_overcharged";
          item.flagReason = item.flagReason
            ? `${item.flagReason} Additionally: ${flag.reason}`
            : flag.reason;
        }
      });
      // Recalculate totalFlagged after heuristic upgrades — always derived from line items
      aiOutput.totalFlagged = aiOutput.lineItems
        .filter((i) => i.flagStatus !== "valid")
        .reduce((sum, i) => sum + i.totalPrice, 0);

      // Hard constraint: flagged can never exceed total billed
      if (aiOutput.totalFlagged > aiOutput.totalBilled) {
        aiOutput.totalFlagged = aiOutput.totalBilled;
      }

      // Potential savings = sum of estimatedSavings from the AI's savings opportunities
      aiOutput.potentialSavings = aiOutput.savingsOpportunities.reduce(
        (sum, opp) => sum + (opp.estimatedSavings ?? 0),
        0
      );

      const drafts = await aiAdapter.generateDrafts(aiOutput, episode as EpisodeOfCare);

      const supabase = await createServiceClient();

      // 1. Create case
      const { error: caseError } = await supabase.from("cases").insert({
        id: caseId,
        status: "complete",
        user_id: user?.id ?? null,
        provider_name: episode.providerName ?? null,
        provider_city: episode.providerCity ?? null,
        provider_state: episode.providerState ?? null,
        provider_country: episode.providerCountry ?? "US",
        insurance_status: episode.insuranceStatus ?? null,
        health_issue: episode.healthIssueDescription ?? null,
        had_er_visit: episode.hadErVisit ?? false,
        had_imaging: episode.hadImaging ?? false,
        had_blood_tests: episode.hadBloodTests ?? false,
        had_surgery: episode.hadSurgery ?? false,
        had_room_stay: episode.hadRoomStay ?? false,
        had_medicines: episode.hadMedicines ?? false,
        had_followup: episode.hadFollowupVisits ?? false,
        has_multiple_bills: episode.hasMultipleBills ?? false,
      });
      if (caseError) throw new Error(`Case insert failed: ${caseError.message}`);

      // 2. Create document record
      await supabase.from("documents").insert({
        id: uuidv4(),
        case_id: caseId,
        type: "bill",
        file_name: billFile.name,
        file_size: billFile.size,
        mime_type: billFile.type,
        ocr_text: ocrText,
        ocr_status: "done",
      });

      // 3. Create analysis — store savings + disclaimer in raw_ai_response JSONB
      const { data: analysisRow, error: analysisError } = await supabase
        .from("bill_analyses")
        .insert({
          id: uuidv4(),
          case_id: caseId,
          status: "complete",
          plain_summary: aiOutput.plainSummary,
          total_billed: aiOutput.totalBilled,
          total_flagged: aiOutput.totalFlagged,
          potential_savings: aiOutput.potentialSavings,
          confidence_score: aiOutput.confidenceScore,
          raw_ai_response: {
            savingsOpportunities: aiOutput.savingsOpportunities,
            disclaimer: aiOutput.disclaimer,
          },
        })
        .select("id")
        .single();
      if (analysisError || !analysisRow) {
        throw new Error(`Analysis insert failed: ${analysisError?.message}`);
      }
      analysisId = analysisRow.id;

      // 4. Line items
      const { error: itemsError } = await supabase.from("bill_line_items").insert(
        aiOutput.lineItems.map((item) => ({
          id: item.id ?? uuidv4(),
          analysis_id: analysisId,
          description: item.description,
          cpt_code: item.cptCode ?? null,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.totalPrice,
          date_of_service: item.dateOfService ?? null,
          flag_status: item.flagStatus,
          flag_reason: item.flagReason ?? null,
          suggested_price: item.suggestedPrice ?? null,
          confidence: item.confidence,
        }))
      );
      if (itemsError) console.error("Line items insert error:", itemsError.message);

      // 5. Generated outputs (dispute letter, phone guide, complaint letter)
      const { error: outputsError } = await supabase.from("generated_outputs").insert([
        {
          id: uuidv4(),
          analysis_id: analysisId,
          type: "dispute_draft" as const,
          content: drafts.disputeDraft,
        },
        {
          id: uuidv4(),
          analysis_id: analysisId,
          type: "negotiation_script" as const,
          content: drafts.negotiationScript,
        },
        {
          id: uuidv4(),
          analysis_id: analysisId,
          type: "complaint_letter" as const,
          content: drafts.complaintLetter,
        },
      ]);
      if (outputsError) console.error("Outputs insert error:", outputsError.message);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Analysis failed:", msg);
      return NextResponse.json({ error: `Analysis failed: ${msg}` }, { status: 500 });
    }

    return NextResponse.json({ analysisId, warning: imageQualityWarning ?? null }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error in /api/analyze:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
