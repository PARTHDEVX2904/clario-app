import { v4 as uuidv4 } from "uuid";
import type { AIAdapter, AnalysisParams, AIAnalysisOutput, GeneratedDrafts } from "./adapter";
import type { EpisodeOfCare } from "@/types";

// Mock AI adapter — returns a realistic, pre-built analysis for demo / dev
// Replace with OpenAIAdapter when AI_PROVIDER=openai
export class MockAIAdapter implements AIAdapter {
  async analyzeBill(_params: AnalysisParams): Promise<AIAnalysisOutput> {
    // Simulate AI processing time
    await new Promise((r) => setTimeout(r, 1800));

    return {
      plainSummary: `Your bill from General Memorial Hospital totals **$17,975.00** for a 2-day stay related to an abdominal complaint. After your insurance covers an estimated $10,230, your out-of-pocket responsibility is shown as **$7,745**.

Our review found several charges that deserve a closer look: a CT scan appears to be billed **twice** (which may be a duplicate), a vague $2,500 "Facility Fee" lacks itemization, IV saline bags are priced at **$180/unit** (roughly 4× the typical rate), and a $350 "Administrative Processing Fee" is not a standard billable charge in most states.

You may be able to reduce your bill by **$3,450–$4,200** through a combination of requesting an itemized bill, disputing the duplicate CT charge, and negotiating the facility fee.`,

      totalBilled: 17975.0,
      totalFlagged: 7920.0,
      potentialSavings: 3850.0,
      confidenceScore: 0.84,

      lineItems: [
        {
          id: uuidv4(),
          description: "Emergency Room Visit - Level 5",
          cptCode: "99285",
          quantity: 1,
          unitPrice: 3200,
          totalPrice: 3200,
          dateOfService: "2024-11-14",
          flagStatus: "review_needed",
          flagReason:
            "Level 5 ER visit is the highest complexity code. Verify that documentation supports medical necessity for this level.",
          confidence: 0.72,
        },
        {
          id: uuidv4(),
          description: "Physician Fee - ER",
          cptCode: "99285",
          quantity: 1,
          unitPrice: 850,
          totalPrice: 850,
          dateOfService: "2024-11-14",
          flagStatus: "valid",
          confidence: 0.91,
        },
        {
          id: uuidv4(),
          description: "CT Scan - Abdomen/Pelvis (74177)",
          cptCode: "74177",
          quantity: 1,
          unitPrice: 2100,
          totalPrice: 2100,
          dateOfService: "2024-11-14",
          flagStatus: "valid",
          confidence: 0.89,
        },
        {
          id: uuidv4(),
          description: "CT Scan - Abdomen/Pelvis (74177) — DUPLICATE",
          cptCode: "74177",
          quantity: 1,
          unitPrice: 2100,
          totalPrice: 2100,
          dateOfService: "2024-11-14",
          flagStatus: "possibly_overcharged",
          flagReason:
            "This CT scan appears to be billed twice on the same date with the same CPT code (74177). A single imaging study is typically billed once. Request clarification from the hospital billing department.",
          suggestedPrice: 0,
          confidence: 0.95,
        },
        {
          id: uuidv4(),
          description: "CBC with Differential (85025)",
          cptCode: "85025",
          quantity: 1,
          unitPrice: 225,
          totalPrice: 225,
          dateOfService: "2024-11-14",
          flagStatus: "valid",
          confidence: 0.88,
        },
        {
          id: uuidv4(),
          description: "CBC with Differential (85025) — POSSIBLE DUPLICATE",
          cptCode: "85025",
          quantity: 1,
          unitPrice: 225,
          totalPrice: 225,
          dateOfService: "2024-11-14",
          flagStatus: "review_needed",
          flagReason:
            "A second CBC is billed on the same date. While repeat labs are sometimes ordered, verify whether two separate draws were clinically necessary.",
          confidence: 0.78,
        },
        {
          id: uuidv4(),
          description: "Comprehensive Metabolic Panel (80053)",
          cptCode: "80053",
          quantity: 1,
          unitPrice: 380,
          totalPrice: 380,
          dateOfService: "2024-11-14",
          flagStatus: "valid",
          confidence: 0.87,
        },
        {
          id: uuidv4(),
          description: "IV Solutions Normal Saline 1000mL",
          cptCode: "A4217",
          quantity: 4,
          unitPrice: 180,
          totalPrice: 720,
          dateOfService: "2024-11-14",
          flagStatus: "possibly_overcharged",
          flagReason:
            "IV saline bags are billed at $180/unit. Typical hospital charge ranges are $30–$60/unit. At 4 units, this represents a potential $480–$600 overcharge. Request a price justification.",
          suggestedPrice: 200,
          confidence: 0.81,
        },
        {
          id: uuidv4(),
          description: "Room & Board - Medical/Surgical (2 days)",
          cptCode: "0120",
          quantity: 2,
          unitPrice: 2400,
          totalPrice: 4800,
          dateOfService: "2024-11-15",
          flagStatus: "review_needed",
          flagReason:
            "Daily room charge of $2,400 is on the higher end for a standard medical/surgical bed. Compare against the hospital's chargemaster if available.",
          confidence: 0.65,
        },
        {
          id: uuidv4(),
          description: "Facility Fee - General",
          quantity: 1,
          unitPrice: 2500,
          totalPrice: 2500,
          dateOfService: "2024-11-15",
          flagStatus: "possibly_overcharged",
          flagReason:
            "A generic $2,500 'Facility Fee' without itemization is a common area of concern. Hospitals must provide a detailed breakdown upon request. This type of catch-all fee is sometimes reducible or contestable.",
          suggestedPrice: 0,
          confidence: 0.88,
        },
        {
          id: uuidv4(),
          description: "Pharmacy - Ondansetron 4mg (anti-nausea)",
          quantity: 1,
          unitPrice: 48,
          totalPrice: 48,
          dateOfService: "2024-11-16",
          flagStatus: "valid",
          confidence: 0.82,
        },
        {
          id: uuidv4(),
          description: "Pharmacy - Ketorolac 15mg (pain relief)",
          quantity: 1,
          unitPrice: 62,
          totalPrice: 62,
          dateOfService: "2024-11-16",
          flagStatus: "valid",
          confidence: 0.84,
        },
        {
          id: uuidv4(),
          description: "Pharmacy - Normal Saline (IV piggyback)",
          quantity: 1,
          unitPrice: 240,
          totalPrice: 240,
          dateOfService: "2024-11-16",
          flagStatus: "review_needed",
          flagReason:
            "This IV piggyback saline charge may overlap with the IV solutions already billed on 11/14. Verify whether this is a separate clinically distinct administration.",
          confidence: 0.69,
        },
        {
          id: uuidv4(),
          description: "Administrative Processing Fee",
          quantity: 1,
          unitPrice: 350,
          totalPrice: 350,
          dateOfService: "2024-11-16",
          flagStatus: "possibly_overcharged",
          flagReason:
            "Administrative or 'processing' fees are generally not a legitimate billable service under standard hospital billing practices. Many patient advocates recommend disputing this charge outright.",
          suggestedPrice: 0,
          confidence: 0.92,
        },
        {
          id: uuidv4(),
          description: "Discharge Planning Fee",
          quantity: 1,
          unitPrice: 175,
          totalPrice: 175,
          dateOfService: "2024-11-16",
          flagStatus: "review_needed",
          flagReason:
            "Discharge planning may be bundled into room & board charges depending on the hospital's billing structure. Request clarification on whether this is a separate billable service.",
          confidence: 0.71,
        },
      ],

      savingsOpportunities: [
        {
          description: "Dispute the duplicate CT scan charge",
          estimatedSavings: 2100,
          actionRequired:
            "Call the hospital billing department and request removal of the second CT scan (CPT 74177) billed on 11/14/2024. Reference your medical records to confirm only one scan was performed.",
          priority: "high",
        },
        {
          description: "Request itemization of the Facility Fee",
          estimatedSavings: 1250,
          actionRequired:
            "Request a fully itemized breakdown of the $2,500 Facility Fee in writing. Many hospitals reduce or waive this fee when patients formally request justification.",
          priority: "high",
        },
        {
          description: "Challenge the Administrative Processing Fee",
          estimatedSavings: 350,
          actionRequired:
            "Dispute the $350 administrative processing fee in your dispute letter. This type of charge is widely regarded as non-billable.",
          priority: "high",
        },
        {
          description: "Negotiate IV supply pricing",
          estimatedSavings: 520,
          actionRequired:
            "Request a price reduction on IV saline bags. Reference typical hospital supply costs ($30–$60/unit) and ask for an adjustment to the $180/unit charge.",
          priority: "medium",
        },
        {
          description: "Apply for hospital financial assistance",
          estimatedSavings: undefined,
          actionRequired:
            "Most nonprofit hospitals are required to offer charity care or financial assistance programs. Ask the hospital's patient advocate about income-based discounts — especially if your out-of-pocket exceeds $2,000.",
          priority: "medium",
        },
      ],

      disclaimer:
        "This analysis is informational support only. It is not legal advice, medical advice, or a guarantee of any billing outcome. Charge assessments are based on typical billing patterns and publicly available benchmarks. Individual hospital billing practices vary significantly. Always consult a certified patient advocate, healthcare attorney, or your insurance company for definitive guidance.",
    };
  }

  async generateDrafts(
    analysis: AIAnalysisOutput,
    episode: EpisodeOfCare,
    patientName?: string
  ): Promise<GeneratedDrafts> {
    await new Promise((r) => setTimeout(r, 1200));

    const provider = episode.providerName || "the hospital";
    const savings = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(analysis.potentialSavings);

    return {
      disputeDraft: generateDisputeLetter(provider, savings, episode),
      negotiationScript: generateNegotiationScript(provider, savings),
      complaintLetter: generateComplaintLetter(provider, savings, episode),
    };
  }
}

function generateDisputeLetter(
  provider: string,
  savings: string,
  episode: EpisodeOfCare
): string {
  return `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

Patient Billing Department
${provider}
[Hospital Address]
[City, State ZIP]

Re: Formal Dispute of Billing Charges
Account Number: [Your Account Number]
Date(s) of Service: [Date(s)]

Dear Patient Billing Department,

I am writing to formally dispute several charges on my itemized bill for services received at ${provider}. I received care related to ${episode.healthIssueDescription || "a medical condition"}, and upon reviewing the itemized statement, I have identified charges that I believe warrant correction or further justification.

DISPUTED ITEMS:

1. DUPLICATE CT SCAN CHARGE (CPT 74177, $2,100.00)
   A CT Scan of the Abdomen/Pelvis (CPT 74177) appears twice on my bill dated the same day. Based on my understanding of my care, only one scan was performed. I request written confirmation and removal of any duplicate charge.

2. UNITEMIZED FACILITY FEE ($2,500.00)
   A line item labeled "Facility Fee – General" appears on my bill without itemization. Under [State] law and standard billing practice, I have the right to a fully itemized explanation of this charge. I request a detailed breakdown or removal of this fee.

3. ADMINISTRATIVE PROCESSING FEE ($350.00)
   This fee does not correspond to any recognized clinical service. I request its removal from my account balance.

4. IV SUPPLY PRICING ($180.00/unit × 4 units)
   I have been charged $180 per unit for standard IV saline solution. Published hospital pricing data suggests typical charges range from $30–$60/unit. I request a price adjustment or justification for this significant markup.

REQUESTED ACTIONS:
- Provide a written response within 30 days acknowledging receipt of this dispute
- Supply itemized documentation for all disputed charges
- Adjust or remove charges not supported by documentation
- Place my account in "hold" status during review (no collections activity)

I am committed to resolving this matter fairly. I look forward to your prompt response.

Sincerely,

[Your Signature]
[Your Printed Name]
[Phone Number]
[Email Address]

Enclosures: Copy of itemized bill, [any supporting documents]`;
}

function generateNegotiationScript(
  provider: string,
  _savings: string
): string {
  return `PHONE NEGOTIATION GUIDE
Call: ${provider} Patient Billing Department

─────────────────────────────────────────────
BEFORE YOU CALL
─────────────────────────────────────────────
✓ Have your account number and bill ready
✓ Have this analysis summary open
✓ Call on a weekday between 9am–3pm (lower wait times)
✓ Ask to speak with a "Patient Financial Counselor" or "Billing Specialist"
✓ Take notes — write down the name of who you spoke with and the time

─────────────────────────────────────────────
OPENING
─────────────────────────────────────────────
"Hi, my name is [Your Name] and my account number is [Account Number]. I'm calling about my bill for services in [Month/Year]. I've reviewed the itemized statement carefully and I have some questions and concerns I'd like to resolve. I want to work with you to reach a fair outcome."

─────────────────────────────────────────────
DUPLICATE CHARGE
─────────────────────────────────────────────
"I see a CT scan with CPT code 74177 billed twice on the same date. Could you check my records and confirm whether two separate scans were ordered and performed? If only one scan occurred, I'd like to request the duplicate charge be removed."

[Tip: Be specific about the date and CPT code. Don't accept "let me note that" — ask for a case number.]

─────────────────────────────────────────────
FACILITY FEE
─────────────────────────────────────────────
"I have a $2,500 Facility Fee on my bill with no itemization. Could you explain exactly what services this covers? I'd also like to know if this fee can be waived or reduced given my situation."

[Tip: If they push back, say "I'm happy to receive this in writing if that's easier."]

─────────────────────────────────────────────
FINANCIAL ASSISTANCE
─────────────────────────────────────────────
"I understand your hospital offers financial assistance or charity care programs. Could you tell me about those options and whether I might qualify? I'd like to explore all available options before finalizing payment."

─────────────────────────────────────────────
NEGOTIATING A LUMP SUM
─────────────────────────────────────────────
"If I'm able to pay a lump sum today, is there a discount available? Many hospitals offer 10–40% reduction for prompt payment. What's the best you can do?"

─────────────────────────────────────────────
CLOSING
─────────────────────────────────────────────
"Thank you for your help. Could I get a reference number for this call, and a confirmation of any adjustments in writing? I'd also like to know the timeline for when I'll receive a response."

─────────────────────────────────────────────
IF THEY SAY NO
─────────────────────────────────────────────
• Ask to escalate to a supervisor or Patient Advocate
• Mention you've filed (or will file) a formal written dispute
• Contact your state's Department of Insurance or Hospital Association
• Consider a certified patient advocate (NAPO: www.patientadvocate.org)`;
}

function generateComplaintLetter(
  provider: string,
  savings: string,
  episode: EpisodeOfCare
): string {
  return `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

Patient Experience / Compliance Department
${provider}
[Hospital Address]
[City, State, ZIP]

CC: [State] Department of Health — Patient Complaint Division
CC: [State] Insurance Commissioner (if applicable)

Re: Formal Complaint Regarding Billing Practices
Account Number: [Your Account Number]

Dear Patient Experience Department,

I received care at ${provider} related to ${episode.healthIssueDescription || "a recent medical episode"} and have identified significant concerns with the billing I received.

SUMMARY OF CONCERNS:
After careful review, I identified approximately ${savings} in charges that appear to be duplicated, vague, or inconsistent with standard billing practices. Specifically:

• A CT scan appears to have been billed twice on the same date
• A $2,500 "Facility Fee" lacks required itemization
• IV supply charges are approximately 4× typical market rates
• An "Administrative Processing Fee" of $350 is not a recognized clinical charge

These concerns raise questions about the accuracy and transparency of billing practices, which may affect other patients who do not have the resources to review their bills in detail.

I am requesting:
1. A formal review of my account by your compliance team
2. Removal or justification of all disputed charges
3. Confirmation that my account will not be sent to collections during review
4. A written response within 30 days

I hope this matter can be resolved internally. If not, I am prepared to file formal complaints with the relevant state health and insurance regulatory bodies.

Sincerely,

[Your Signature]
[Your Printed Name]
[Phone Number]
[Email Address]`;
}
