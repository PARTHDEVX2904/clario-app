import type { OCRAdapter, OCRResult } from "./adapter";

// Mock OCR — returns realistic sample extracted text for demo/dev
// Replace this with TesseractAdapter (or GoogleVisionAdapter) in production.
export class MockOCRAdapter implements OCRAdapter {
  async extractText(_fileBuffer: Buffer, _mimeType: string): Promise<OCRResult> {
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 600));

    return {
      provider: "mock",
      confidence: 0.91,
      text: MOCK_BILL_TEXT,
    };
  }
}

const MOCK_BILL_TEXT = `
GENERAL MEMORIAL HOSPITAL
123 Healthcare Blvd, Austin, TX 78701
Tel: (512) 555-0100
Federal Tax ID: 74-1234567

PATIENT BILL OF ACCOUNT
------------------------------------------------------------
Patient: John A. Doe
DOB: 03/15/1978
Account #: 2024-98765
Admission Date: 11/14/2024
Discharge Date: 11/16/2024
Attending Physician: Dr. Sarah Chen, MD

INSURANCE: Blue Cross Blue Shield PPO
Policy #: BCB-4567890
Group #: 78901

------------------------------------------------------------
ITEMIZED CHARGES
------------------------------------------------------------

11/14/2024  Emergency Room Visit - Level 5        $3,200.00
11/14/2024  Physician Fee - ER                    $  850.00
11/14/2024  CT Scan - Abdomen/Pelvis (74177)      $2,100.00
11/14/2024  CT Scan - Abdomen/Pelvis (74177)      $2,100.00
11/14/2024  CBC with Differential (85025)         $  225.00
11/14/2024  CBC with Differential (85025)         $  225.00
11/14/2024  Comprehensive Metabolic Panel (80053) $  380.00
11/14/2024  IV Solutions NS 1000mL x 4 units      $  720.00
11/15/2024  Room & Board - Medical/Surgical x 2   $4,800.00
11/15/2024  Facility Fee - General                $2,500.00
11/16/2024  Pharmacy - Ondansetron 4mg            $   48.00
11/16/2024  Pharmacy - Ketorolac 15mg             $   62.00
11/16/2024  Pharmacy - Normal Saline (piggyback)  $  240.00
11/16/2024  Administrative Processing Fee         $  350.00
11/16/2024  Discharge Planning Fee                $  175.00
------------------------------------------------------------
TOTAL CHARGES:                                   $17,975.00

Amount covered by insurance (estimated):         ($10,230.00)
Estimated Patient Responsibility:                 $7,745.00

PAYMENT DUE WITHIN 30 DAYS
Questions? Call Patient Billing: (512) 555-0199
`;
