import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getOCRAdapter } from "@/lib/ocr/adapter";
import { getAIAdapter } from "@/lib/ai/adapter";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { EpisodeOfCare } from "@/types";

export const maxDuration = 60; // Vercel function timeout

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

    // ── OCR ────────────────────────────────────────────────────────────────────
    let ocrText: string;
    try {
      const buffer = Buffer.from(await billFile.arrayBuffer());
      const ocrAdapter = await getOCRAdapter();
      const ocrResult = await ocrAdapter.extractText(buffer, billFile.type);
      ocrText = ocrResult.text;
    } catch (err) {
      console.error("OCR failed:", err);
      return NextResponse.json({ error: "Failed to extract text from the bill." }, { status: 500 });
    }

    // ── AI Analysis + Persist ──────────────────────────────────────────────────
    let analysisId: string;
    try {
      const aiAdapter = await getAIAdapter();
      const aiOutput = await aiAdapter.analyzeBill({
        caseId,
        ocrText,
        episode: episode as EpisodeOfCare,
      });
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
      console.error("Analysis failed:", err);
      return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ analysisId }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error in /api/analyze:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
