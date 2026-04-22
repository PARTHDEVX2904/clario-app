import { v4 as uuidv4 } from "uuid";
import type { AnalysisResult, GeneratedOutput } from "@/types";
import { MockAIAdapter } from "@/lib/ai/mock";

// Cache so repeated page loads return the same data
let cachedAnalysis: {
  analysis: AnalysisResult;
  outputs: GeneratedOutput[];
  providerName: string;
} | null = null;

export function getMockAnalysis(id: string): {
  analysis: AnalysisResult;
  outputs: GeneratedOutput[];
  providerName: string;
} | null {
  // Accept any ID for demo — in production, look up by real DB ID
  if (!id) return null;

  if (cachedAnalysis) return cachedAnalysis;

  const analysisId = id.startsWith("mock-") ? id : `mock-${id}`;

  const adapter = new MockAIAdapter();

  // Build synchronous mock (the adapter is async, so we use the pre-built data directly)
  const analysis: AnalysisResult = {
    id: analysisId,
    caseId: `case-${uuidv4()}`,
    status: "complete",
    createdAt: new Date().toISOString(),
    plainSummary: `Your bill from City Care Hospital totals **₹11,250** for a 2-day stay related to an abdominal complaint. After your insurance covers an estimated ₹6,800, your out-of-pocket responsibility is shown as **₹4,450**.

Our review found several charges that deserve a closer look: a CT scan appears to be billed **twice** (which may be a duplicate), a vague ₹1,800 "Facility Fee" lacks itemization, IV saline bags are priced at **₹80/unit** (roughly 4× the typical rate), and a ₹250 "Administrative Processing Fee" is not a standard billable charge.

You may be able to reduce your bill by **₹2,500–₹3,200** through a combination of requesting an itemized bill, disputing the duplicate CT charge, and negotiating the facility fee.`,
    totalBilled: 11250,
    totalFlagged: 5200,
    potentialSavings: 6000,
    confidenceScore: 0.84,
    disclaimer:
      "This analysis is informational support only. It is not legal advice, medical advice, or a guarantee of any billing outcome.",
    lineItems: [
      {
        id: uuidv4(),
        analysisId,
        description: "Emergency Room Visit - Level 5",
        cptCode: "99285",
        quantity: 1,
        unitPrice: 1800,
        totalPrice: 1800,
        dateOfService: "2024-11-14",
        flagStatus: "review_needed",
        flagReason:
          "Level 5 ER visit is the highest complexity code. Verify that documentation supports medical necessity for this level.",
        confidence: 0.72,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "Physician Fee - ER",
        cptCode: "99285",
        quantity: 1,
        unitPrice: 600,
        totalPrice: 600,
        dateOfService: "2024-11-14",
        flagStatus: "valid",
        confidence: 0.91,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "CT Scan - Abdomen/Pelvis (74177)",
        cptCode: "74177",
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
        dateOfService: "2024-11-14",
        flagStatus: "valid",
        confidence: 0.89,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "CT Scan - Abdomen/Pelvis — POSSIBLE DUPLICATE",
        cptCode: "74177",
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
        dateOfService: "2024-11-14",
        flagStatus: "possibly_overcharged",
        flagReason:
          "This CT scan appears to be billed twice on the same date with the same CPT code (74177). A single imaging study is typically billed once. Request clarification from the hospital billing department.",
        suggestedPrice: 0,
        confidence: 0.95,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "CBC with Differential (85025)",
        cptCode: "85025",
        quantity: 1,
        unitPrice: 150,
        totalPrice: 150,
        dateOfService: "2024-11-14",
        flagStatus: "valid",
        confidence: 0.88,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "CBC with Differential — POSSIBLE DUPLICATE",
        cptCode: "85025",
        quantity: 1,
        unitPrice: 150,
        totalPrice: 150,
        dateOfService: "2024-11-14",
        flagStatus: "review_needed",
        flagReason:
          "A second CBC is billed on the same date. While repeat labs are sometimes ordered, verify whether two separate draws were clinically necessary.",
        confidence: 0.78,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "Comprehensive Metabolic Panel (80053)",
        cptCode: "80053",
        quantity: 1,
        unitPrice: 280,
        totalPrice: 280,
        dateOfService: "2024-11-14",
        flagStatus: "valid",
        confidence: 0.87,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "IV Solutions Normal Saline 1000mL",
        cptCode: "A4217",
        quantity: 4,
        unitPrice: 80,
        totalPrice: 320,
        dateOfService: "2024-11-14",
        flagStatus: "possibly_overcharged",
        flagReason:
          "IV saline bags are billed at ₹80/unit. Typical hospital charge ranges are ₹15–₹30/unit. At 4 units, this represents a potential ₹200–₹260 overcharge. Request a price justification.",
        suggestedPrice: 120,
        confidence: 0.81,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "Room & Board - Medical/Surgical (2 days)",
        cptCode: "0120",
        quantity: 2,
        unitPrice: 1200,
        totalPrice: 2400,
        dateOfService: "2024-11-15",
        flagStatus: "review_needed",
        flagReason:
          "Daily room charge of ₹1,200 is on the higher end for a standard medical/surgical bed. Compare against the hospital's published rate card if available.",
        confidence: 0.65,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "Facility Fee - General",
        quantity: 1,
        unitPrice: 1800,
        totalPrice: 1800,
        dateOfService: "2024-11-15",
        flagStatus: "possibly_overcharged",
        flagReason:
          "A generic ₹1,800 'Facility Fee' without itemization is a common area of concern. Hospitals must provide a detailed breakdown upon request. This type of catch-all fee is sometimes reducible or contestable.",
        suggestedPrice: 0,
        confidence: 0.88,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "Pharmacy - Ondansetron 4mg",
        quantity: 1,
        unitPrice: 350,
        totalPrice: 350,
        dateOfService: "2024-11-16",
        flagStatus: "valid",
        confidence: 0.82,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "Pharmacy - Ketorolac 15mg",
        quantity: 1,
        unitPrice: 450,
        totalPrice: 450,
        dateOfService: "2024-11-16",
        flagStatus: "valid",
        confidence: 0.84,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "Pharmacy - Normal Saline IV piggyback",
        quantity: 1,
        unitPrice: 180,
        totalPrice: 180,
        dateOfService: "2024-11-16",
        flagStatus: "review_needed",
        flagReason:
          "This IV piggyback saline charge may overlap with the IV solutions already billed on 11/14. Verify whether this is a separate clinically distinct administration.",
        confidence: 0.69,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "Administrative Processing Fee",
        quantity: 1,
        unitPrice: 250,
        totalPrice: 250,
        dateOfService: "2024-11-16",
        flagStatus: "possibly_overcharged",
        flagReason:
          "Administrative or 'processing' fees are generally not a legitimate billable service under standard hospital billing practices. Many patient advocates recommend disputing this charge outright.",
        suggestedPrice: 0,
        confidence: 0.92,
      },
      {
        id: uuidv4(),
        analysisId,
        description: "Discharge Planning Fee",
        quantity: 1,
        unitPrice: 120,
        totalPrice: 120,
        dateOfService: "2024-11-16",
        flagStatus: "review_needed",
        flagReason:
          "Discharge planning may be bundled into room & board charges depending on the hospital's billing structure. Request clarification on whether this is a separate billable service.",
        confidence: 0.71,
      },
    ],
    savingsOpportunities: [
      {
        id: uuidv4(),
        description: "Dispute the duplicate CT scan charge",
        estimatedSavings: 1500,
        actionRequired:
          "Call the hospital billing department and request removal of the second CT scan (CPT 74177) billed on 11/14/2024. Reference your medical records to confirm only one scan was performed.",
        priority: "high",
      },
      {
        id: uuidv4(),
        description: "Request itemization of the Facility Fee",
        estimatedSavings: 900,
        actionRequired:
          "Request a fully itemized breakdown of the ₹1,800 Facility Fee in writing. Many hospitals reduce or waive this fee when patients formally request justification.",
        priority: "high",
      },
      {
        id: uuidv4(),
        description: "Challenge the Administrative Processing Fee",
        estimatedSavings: 250,
        actionRequired:
          "Dispute the ₹250 administrative processing fee in your dispute letter. This type of charge is widely regarded as non-billable.",
        priority: "high",
      },
      {
        id: uuidv4(),
        description: "Negotiate IV supply pricing",
        estimatedSavings: 240,
        actionRequired:
          "Request a price reduction on IV saline bags. Reference typical hospital supply costs (₹15–₹30/unit) and ask for an adjustment to the ₹80/unit charge.",
        priority: "medium",
      },
      {
        id: uuidv4(),
        description: "Apply for hospital financial assistance",
        actionRequired:
          "Most nonprofit hospitals are required to offer charity care or financial assistance programs. Ask the hospital's patient advocate about income-based discounts.",
        priority: "medium",
      },
    ],
  };

  const outputId = uuidv4();
  const outputs: GeneratedOutput[] = [
    {
      id: uuidv4(),
      analysisId,
      type: "dispute_draft",
      content: DISPUTE_LETTER,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      analysisId,
      type: "negotiation_script",
      content: NEGOTIATION_SCRIPT,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      analysisId,
      type: "complaint_letter",
      content: COMPLAINT_LETTER,
      createdAt: new Date().toISOString(),
    },
  ];

  cachedAnalysis = {
    analysis,
    outputs,
    providerName: "General Memorial Hospital",
  };

  return cachedAnalysis;
}

void uuidv4; // suppress unused import warning

const DISPUTE_LETTER = `[Your Name]
[Your Address]
[City, State, PIN]
[Date]

Patient Billing Department
City Care Hospital
[Hospital Address]

Re: Formal Dispute of Billing Charges
Account Number: [Your Account Number]
Date(s) of Service: November 14–16, 2024

Dear Patient Billing Department,

I am writing to formally dispute several charges on my itemized bill for services received at City Care Hospital. I received care related to an abdominal complaint, and upon reviewing the itemized statement, I have identified charges that I believe warrant correction or further justification.

DISPUTED ITEMS:

1. DUPLICATE CT SCAN CHARGE (CPT 74177, ₹1,500)
   A CT Scan of the Abdomen/Pelvis (CPT 74177) appears twice on my bill dated 11/14/2024. Based on my understanding of my care, only one scan was performed. I request written confirmation and removal of any duplicate charge.

2. UNITEMIZED FACILITY FEE (₹1,800)
   A line item labeled "Facility Fee – General" appears on my bill without itemization. I have the right to a fully itemized explanation of this charge. I request a detailed breakdown or removal of this fee.

3. ADMINISTRATIVE PROCESSING FEE (₹250)
   This fee does not correspond to any recognized clinical service. I request its removal from my account balance.

4. IV SUPPLY PRICING (₹80/unit × 4 units = ₹320)
   I have been charged ₹80 per unit for standard IV saline solution. Typical hospital charges range from ₹15–₹30/unit. I request a price adjustment or justification for this significant markup.

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

Enclosures: Copy of itemized bill`;

const NEGOTIATION_SCRIPT = `PHONE NEGOTIATION GUIDE
Hospital: City Care Hospital — Patient Billing: [Hospital Number]

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
"Hi, my name is [Your Name] and my account number is [Account Number]. I'm calling about my bill for services in November 2024. I've reviewed the itemized statement carefully and I have some questions and concerns I'd like to resolve. I want to work with you to reach a fair outcome."

─────────────────────────────────────────────
DUPLICATE CHARGE (PRIORITY 1)
─────────────────────────────────────────────
"I see a CT scan billed twice on the same date — November 14th. Could you check my records and confirm whether two separate scans were ordered and performed? If only one scan occurred, I'd like to request the duplicate charge of ₹1,500 be removed."

[Tip: Be specific about the date and CPT code. Don't accept "let me note that" — ask for a case number.]

─────────────────────────────────────────────
FACILITY FEE (PRIORITY 2)
─────────────────────────────────────────────
"I have a ₹1,800 Facility Fee on my bill with no itemization. Could you explain exactly what services this covers? I'd also like to know if this fee can be waived or reduced given my situation."

[Tip: If they push back, say "I'm happy to receive this in writing if that's easier."]

─────────────────────────────────────────────
ADMINISTRATIVE FEE (PRIORITY 3)
─────────────────────────────────────────────
"There's a ₹250 Administrative Processing Fee on my bill. Can you clarify what clinical service this corresponds to? I'm not aware of any recognized billable service by this description."

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

const COMPLAINT_LETTER = `[Your Name]
[Your Address]
[City, State, PIN]
[Date]

Patient Experience / Compliance Department
City Care Hospital
[Hospital Address]

CC: State Health Department — Patient Complaint Division
CC: Insurance Regulatory Authority (if applicable)

Re: Formal Complaint Regarding Billing Practices
Account Number: [Your Account Number]

Dear Patient Experience Department,

I received care at City Care Hospital in November 2024 related to an abdominal complaint requiring emergency care, imaging, and a 2-night inpatient stay. I have significant concerns with the billing I received.

SUMMARY OF CONCERNS:
After careful review, I identified approximately ₹2,800 in charges that appear to be duplicated, vague, or inconsistent with standard billing practices:

• A CT scan appears to have been billed twice on the same date (₹1,500)
• A ₹1,800 "Facility Fee" lacks required itemization
• IV supply charges are approximately 4× typical market rates
• An "Administrative Processing Fee" of ₹250 is not a recognized clinical charge

These concerns raise questions about the accuracy and transparency of billing practices, which may affect other patients who do not have the resources to review their bills in detail.

I am requesting:
1. A formal review of my account by your compliance team
2. Removal or justification of all disputed charges
3. Confirmation that my account will not be sent to collections during review
4. A written response within 30 days

I hope this matter can be resolved internally. If not, I am prepared to file formal complaints with the relevant State Health Department and insurance regulatory bodies.

Sincerely,

[Your Signature]
[Your Printed Name]
[Phone Number]
[Email Address]`;
