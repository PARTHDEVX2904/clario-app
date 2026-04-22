// Condition Knowledge Base — 50 common Indian hospital conditions
// Used to inject clinical context into AI prompts and heuristic checks.
// Each entry describes what is expected/unexpected on a bill for that diagnosis.

export interface ConditionEntry {
  conditionName: string;
  /** Always reasonable to see on a bill for this condition */
  expected: string[];
  /** Depends on severity or complications */
  sometimes: string[];
  /** Only in serious or complicated cases */
  rare: string[];
  /** Should be questioned if present — flag for review */
  notExpected: string[];
  notes: string;
}

// ── Knowledge Base ─────────────────────────────────────────────────────────────

const CONDITIONS_KB: Record<string, ConditionEntry> = {
  dengue: {
    conditionName: "Dengue",
    expected: [
      "CBC (complete blood count)",
      "platelet count",
      "dengue NS1 antigen test",
      "dengue IgM/IgG antibody test",
      "IV fluids",
      "fever management",
      "antipyretics (paracetamol)",
      "hospitalization charges",
    ],
    sometimes: [
      "blood transfusion (severe thrombocytopenia)",
      "platelet transfusion",
      "ICU admission (dengue shock syndrome)",
      "liver function tests",
    ],
    rare: [
      "plasma transfusion",
      "mechanical ventilation",
      "fresh frozen plasma",
    ],
    notExpected: [
      "surgery",
      "antibiotics",
      "CT scan",
      "MRI",
      "cardiac catheterization",
      "chemotherapy",
      "dialysis",
      "appendectomy",
    ],
    notes:
      "Dengue is viral — antibiotics are not indicated. Platelet transfusion is only warranted for counts <10,000 or active bleeding. Surgery is not part of dengue treatment.",
  },

  jaundice: {
    conditionName: "Jaundice",
    expected: [
      "liver function tests (LFT)",
      "bilirubin (total and direct)",
      "hepatitis panel (HAV, HBsAg, HCV)",
      "ultrasound abdomen",
      "CBC",
      "urine bilirubin",
      "IV fluids",
      "antiemetics",
    ],
    sometimes: [
      "ERCP (biliary obstruction)",
      "MRCP",
      "liver biopsy",
      "coagulation profile (PT/INR)",
      "albumin infusion",
    ],
    rare: [
      "liver surgery (biliary bypass)",
      "stenting for bile duct obstruction",
      "liver transplant evaluation",
    ],
    notExpected: [
      "surgery",
      "MRI brain",
      "cardiac monitoring",
      "cardiac catheterization",
      "chemotherapy",
      "orthopedic procedures",
    ],
    notes:
      "Most jaundice is viral or medical and managed conservatively. Biliary jaundice (choledocholithiasis) may need ERCP. Brain MRI or cardiac procedures are not part of routine jaundice management.",
  },

  typhoid: {
    conditionName: "Typhoid",
    expected: [
      "Widal test",
      "blood culture",
      "CBC",
      "antibiotics (ceftriaxone or azithromycin)",
      "IV fluids",
      "fever management",
      "LFT",
      "electrolytes",
    ],
    sometimes: [
      "hospitalization for severe cases",
      "electrolyte correction",
      "stool culture",
      "typhidot test",
    ],
    rare: [
      "surgery (intestinal perforation only)",
      "ICU admission (complications)",
    ],
    notExpected: [
      "cardiac monitoring",
      "cardiac catheterization",
      "MRI",
      "CT scan",
      "chemotherapy",
      "surgery",
      "dialysis",
    ],
    notes:
      "Typhoid is a bacterial infection managed with antibiotics. Surgery is only indicated for intestinal perforation — a rare, severe complication.",
  },

  malaria: {
    conditionName: "Malaria",
    expected: [
      "malaria smear (thick and thin film)",
      "malaria RDT (rapid diagnostic test)",
      "CBC",
      "antimalarial drugs (chloroquine or artemether-lumefantrine)",
      "fever management",
      "IV fluids",
      "LFT",
      "renal function tests",
    ],
    sometimes: [
      "hospitalization (severe Plasmodium falciparum)",
      "IV antimalarials (severe malaria)",
      "blood transfusion (severe anaemia)",
    ],
    rare: [
      "ICU admission (cerebral malaria)",
      "dialysis (blackwater fever)",
      "mechanical ventilation",
    ],
    notExpected: [
      "surgery",
      "antibiotics",
      "CT scan",
      "MRI",
      "cardiac catheterization",
      "chemotherapy",
    ],
    notes:
      "Malaria is a parasitic infection — antibiotics are not indicated. Surgery is not part of malaria treatment. CT/MRI is only warranted for neurological complications.",
  },

  "viral fever": {
    conditionName: "Viral Fever",
    expected: [
      "CBC",
      "fever management (paracetamol)",
      "oral hydration or IV fluids",
      "antipyretics",
    ],
    sometimes: [
      "blood cultures (to rule out bacterial infection)",
      "dengue/malaria test (based on symptoms)",
      "electrolytes",
    ],
    rare: [
      "hospitalization",
      "IV antibiotics (secondary bacterial infection)",
    ],
    notExpected: [
      "surgery",
      "MRI",
      "CT scan",
      "cardiac catheterization",
      "chemotherapy",
      "dialysis",
    ],
    notes:
      "Viral fever is self-limiting and requires only symptomatic treatment. Extensive imaging, surgery, or cardiac procedures are not warranted.",
  },

  chikungunya: {
    conditionName: "Chikungunya",
    expected: [
      "Chikungunya IgM/IgG serology",
      "CBC",
      "pain management (NSAIDs, paracetamol)",
      "fever management",
      "IV fluids (if vomiting)",
    ],
    sometimes: [
      "physiotherapy (chronic joint pain)",
      "rheumatology consultation",
    ],
    rare: [
      "hospitalization (severe complications)",
      "neurological workup (encephalitis)",
    ],
    notExpected: [
      "surgery",
      "antibiotics",
      "CT scan",
      "MRI",
      "cardiac catheterization",
      "chemotherapy",
    ],
    notes:
      "Chikungunya is viral — antibiotics and surgery are not indicated. Joint pain may persist for weeks but does not require surgical intervention.",
  },

  tuberculosis: {
    conditionName: "Tuberculosis (TB)",
    expected: [
      "sputum AFB smear",
      "GeneXpert / CBNAAT",
      "chest X-ray",
      "TB culture",
      "anti-TB therapy (RNTCP drugs: HRZE)",
      "CBC",
      "LFT",
      "HIV test",
    ],
    sometimes: [
      "bronchoscopy",
      "CT chest / HRCT",
      "IGRA (interferon-gamma release assay)",
      "pleural biopsy",
      "lymph node biopsy",
    ],
    rare: [
      "surgery (complications: empyema, destroyed lung)",
      "ICU (severe TB)",
    ],
    notExpected: [
      "cardiac surgery",
      "chemotherapy",
      "cardiac catheterization",
      "orthopedic surgery",
      "MRI brain",
    ],
    notes:
      "TB is managed with a 6-month antibiotic regimen. Surgery is rare and only for complications. Chemotherapy is not part of TB treatment.",
  },

  covid: {
    conditionName: "COVID-19",
    expected: [
      "RT-PCR or rapid antigen test",
      "CBC",
      "CRP",
      "D-dimer",
      "chest X-ray",
      "HRCT chest",
      "oxygen therapy",
      "steroids (dexamethasone)",
    ],
    sometimes: [
      "remdesivir",
      "anticoagulation (LMWH)",
      "ICU admission",
      "HFNC (high-flow nasal cannula)",
      "BiPAP/CPAP",
      "mechanical ventilation",
      "tocilizumab",
    ],
    rare: [
      "ECMO (extracorporeal membrane oxygenation)",
      "plasma therapy",
    ],
    notExpected: [
      "appendectomy",
      "cardiac catheterization",
      "chemotherapy",
      "orthopedic surgery",
      "abdominal surgery",
    ],
    notes:
      "COVID-19 management is primarily respiratory supportive care. Routine surgical procedures are not part of COVID treatment.",
  },

  "hepatitis b": {
    conditionName: "Hepatitis B",
    expected: [
      "HBsAg",
      "HBeAg",
      "HBV DNA",
      "liver function tests",
      "bilirubin",
      "CBC",
      "abdominal ultrasound",
      "antiviral medication (tenofovir or entecavir)",
    ],
    sometimes: [
      "liver biopsy",
      "fibroscan (elastography)",
      "coagulation profile",
    ],
    rare: [
      "liver transplant evaluation",
      "hepatocellular carcinoma screening (AFP, CT abdomen)",
    ],
    notExpected: [
      "surgery",
      "cardiac monitoring",
      "MRI brain",
      "cardiac catheterization",
      "chemotherapy",
      "orthopedic surgery",
    ],
    notes:
      "Hepatitis B is managed with antivirals and monitoring. Surgery is not part of routine Hepatitis B treatment.",
  },

  "hepatitis c": {
    conditionName: "Hepatitis C",
    expected: [
      "HCV antibody test",
      "HCV RNA (quantitative PCR)",
      "liver function tests",
      "CBC",
      "abdominal ultrasound",
      "antiviral therapy (sofosbuvir / daclatasvir)",
    ],
    sometimes: [
      "liver biopsy",
      "fibroscan",
      "coagulation profile",
    ],
    rare: [
      "liver transplant evaluation",
    ],
    notExpected: [
      "surgery",
      "cardiac monitoring",
      "MRI brain",
      "cardiac catheterization",
      "chemotherapy",
    ],
    notes:
      "Hepatitis C is now curable with direct-acting antivirals. Routine Hep C management does not involve surgery or cardiac procedures.",
  },

  uti: {
    conditionName: "Urinary Tract Infection (UTI)",
    expected: [
      "urine routine and microscopy",
      "urine culture and sensitivity",
      "antibiotics (nitrofurantoin, cotrimoxazole, or ciprofloxacin)",
      "CBC",
    ],
    sometimes: [
      "ultrasound KUB",
      "renal function tests",
      "IV antibiotics (severe pyelonephritis)",
      "hospitalization",
    ],
    rare: [
      "CT KUB (to rule out obstruction)",
      "urology consultation",
      "cystoscopy",
    ],
    notExpected: [
      "surgery",
      "cardiac monitoring",
      "MRI brain",
      "CT scan",
      "cardiac catheterization",
      "chemotherapy",
    ],
    notes:
      "Most UTIs are treated with oral antibiotics. Imaging is only needed if stones or anatomical abnormalities are suspected.",
  },

  meningitis: {
    conditionName: "Meningitis",
    expected: [
      "lumbar puncture (CSF analysis)",
      "CT brain",
      "blood cultures",
      "CBC",
      "IV antibiotics (ceftriaxone)",
      "IV dexamethasone",
      "electrolytes",
    ],
    sometimes: [
      "MRI brain",
      "antiviral (acyclovir for viral meningitis)",
      "antifungal (if fungal meningitis)",
      "ICU admission",
    ],
    rare: [
      "neurosurgery (hydrocephalus complication)",
      "VP shunt",
    ],
    notExpected: [
      "cardiac catheterization",
      "abdominal surgery",
      "chemotherapy",
      "orthopedic surgery",
    ],
    notes:
      "Meningitis is a neurological emergency managed with IV antibiotics and steroids. Neurosurgery is only for complications like hydrocephalus.",
  },

  sepsis: {
    conditionName: "Sepsis",
    expected: [
      "blood cultures",
      "CBC",
      "CRP",
      "procalcitonin",
      "liver function tests",
      "renal function tests",
      "IV broad-spectrum antibiotics",
      "IV fluids",
      "oxygen therapy",
    ],
    sometimes: [
      "ICU admission",
      "vasopressors (noradrenaline)",
      "central venous line",
      "mechanical ventilation",
      "lactate levels",
    ],
    rare: [
      "CRRT (continuous renal replacement therapy)",
      "ECMO",
      "surgical source control",
    ],
    notExpected: [
      "elective surgery",
      "cardiac catheterization",
      "chemotherapy",
      "orthopedic surgery",
    ],
    notes:
      "Sepsis requires urgent antibiotics and resuscitation. Surgical source control is only when an infectious focus (e.g., abscess) needs drainage.",
  },

  "food poisoning": {
    conditionName: "Food Poisoning",
    expected: [
      "CBC",
      "electrolytes",
      "stool routine",
      "ORS / oral rehydration",
      "IV fluids",
      "antiemetics",
    ],
    sometimes: [
      "stool culture",
      "antibiotics (bacterial food poisoning)",
      "hospitalization",
    ],
    rare: [
      "ICU admission (severe dehydration)",
    ],
    notExpected: [
      "surgery",
      "CT scan",
      "MRI",
      "cardiac monitoring",
      "chemotherapy",
    ],
    notes:
      "Food poisoning is managed with rehydration and symptomatic care. Surgery and imaging are not part of routine food poisoning management.",
  },

  appendicitis: {
    conditionName: "Appendicitis",
    expected: [
      "CBC",
      "CRP",
      "ultrasound abdomen",
      "appendicectomy (surgery)",
      "IV antibiotics",
      "anesthesia",
      "pre-operative blood tests",
    ],
    sometimes: [
      "CT abdomen (diagnostic)",
      "laparoscopic vs open surgery",
      "post-operative antibiotics",
    ],
    rare: [
      "percutaneous drainage (appendicular abscess)",
      "bowel resection (perforation with peritonitis)",
    ],
    notExpected: [
      "cardiac monitoring",
      "chemotherapy",
      "MRI brain",
      "liver surgery",
      "cardiac catheterization",
    ],
    notes:
      "Appendicitis requires surgical removal. Cardiac and neurological procedures are unrelated.",
  },

  gastroenteritis: {
    conditionName: "Gastroenteritis",
    expected: [
      "CBC",
      "stool examination",
      "ORS / oral rehydration",
      "IV fluids",
      "antiemetics",
      "electrolytes",
    ],
    sometimes: [
      "antibiotics (bacterial gastroenteritis)",
      "hospitalization",
      "stool culture",
    ],
    rare: [
      "endoscopy",
      "ICU (severe dehydration)",
    ],
    notExpected: [
      "surgery",
      "MRI",
      "cardiac monitoring",
      "CT scan",
      "chemotherapy",
    ],
    notes:
      "Gastroenteritis is managed with rehydration and symptomatic care. Endoscopy and surgery are not routinely needed.",
  },

  "peptic ulcer": {
    conditionName: "Peptic Ulcer",
    expected: [
      "OGD (upper GI endoscopy)",
      "H. pylori test (stool antigen or urea breath test)",
      "proton pump inhibitors (pantoprazole/omeprazole)",
      "triple therapy (if H. pylori positive)",
      "CBC",
    ],
    sometimes: [
      "IV pantoprazole (acute bleed)",
      "blood transfusion (GI bleed)",
      "hemostasis via endoscopy",
      "hospitalization",
    ],
    rare: [
      "surgery (perforation or uncontrolled bleeding)",
    ],
    notExpected: [
      "cardiac monitoring",
      "chemotherapy",
      "MRI brain",
      "cardiac catheterization",
      "orthopedic surgery",
    ],
    notes:
      "Peptic ulcer is managed medically with PPIs and H. pylori eradication. Surgery is only for perforation or uncontrolled bleed.",
  },

  pancreatitis: {
    conditionName: "Pancreatitis",
    expected: [
      "serum amylase",
      "serum lipase",
      "LFT",
      "CBC",
      "CT abdomen",
      "IV fluids",
      "NPO (nil per oral)",
      "pain management",
    ],
    sometimes: [
      "ERCP (biliary pancreatitis)",
      "ICU admission",
      "antibiotics (infected necrosis)",
      "nasogastric feeding",
    ],
    rare: [
      "necrosectomy (surgery)",
      "pseudocyst drainage",
    ],
    notExpected: [
      "cardiac catheterization",
      "chemotherapy",
      "orthopedic surgery",
      "MRI brain",
    ],
    notes:
      "Pancreatitis is primarily managed with fluid resuscitation and pain control. ERCP is indicated for biliary cause. Cardiac and orthopedic procedures are unrelated.",
  },

  cholecystitis: {
    conditionName: "Cholecystitis / Gallstones",
    expected: [
      "ultrasound abdomen",
      "CBC",
      "LFT",
      "IV antibiotics",
      "cholecystectomy (laparoscopic surgery)",
      "anesthesia",
    ],
    sometimes: [
      "ERCP (CBD stone)",
      "MRCP",
      "CT abdomen",
    ],
    rare: [
      "open cholecystectomy",
      "cholecystostomy (high-risk patients)",
    ],
    notExpected: [
      "cardiac monitoring",
      "chemotherapy",
      "MRI brain",
      "orthopedic surgery",
      "cardiac catheterization",
    ],
    notes:
      "Cholecystitis is treated with cholecystectomy. ERCP is done for common bile duct stones. Cardiac and neurological procedures are unrelated.",
  },

  hernia: {
    conditionName: "Hernia",
    expected: [
      "clinical examination",
      "ultrasound",
      "hernioplasty or herniorrhaphy (surgery)",
      "mesh repair",
      "anesthesia",
      "pre-operative blood tests",
    ],
    sometimes: [
      "CT scan (complex hernias)",
    ],
    rare: [
      "emergency bowel resection (strangulated hernia)",
    ],
    notExpected: [
      "chemotherapy",
      "cardiac catheterization",
      "MRI brain",
      "antifungal treatment",
    ],
    notes:
      "Hernia repair is a surgical procedure. Cardiac and neurological interventions are not part of hernia management.",
  },

  "intestinal obstruction": {
    conditionName: "Intestinal Obstruction",
    expected: [
      "X-ray abdomen (erect)",
      "CBC",
      "electrolytes",
      "IV fluids",
      "nasogastric tube decompression",
    ],
    sometimes: [
      "CT abdomen",
      "surgery (if not resolving conservatively)",
    ],
    rare: [
      "bowel resection (gangrenous bowel)",
    ],
    notExpected: [
      "chemotherapy",
      "cardiac catheterization",
      "MRI brain",
      "orthopedic surgery",
    ],
    notes:
      "Intestinal obstruction is initially managed conservatively. Surgery is for failure of conservative management or strangulation.",
  },

  "liver cirrhosis": {
    conditionName: "Liver Cirrhosis",
    expected: [
      "LFT",
      "bilirubin",
      "albumin",
      "PT/INR",
      "CBC",
      "abdominal ultrasound",
      "upper GI endoscopy (UGIE for varices)",
      "diuretics (spironolactone/furosemide)",
    ],
    sometimes: [
      "paracentesis",
      "variceal band ligation",
      "lactulose",
      "rifaximin",
      "hepatology consultation",
    ],
    rare: [
      "TIPS procedure",
      "liver transplant evaluation",
    ],
    notExpected: [
      "cardiac bypass surgery",
      "chemotherapy",
      "orthopedic surgery",
      "cardiac catheterization",
    ],
    notes:
      "Liver cirrhosis management focuses on complications. Chemotherapy is only if hepatocellular carcinoma develops.",
  },

  pneumonia: {
    conditionName: "Pneumonia",
    expected: [
      "chest X-ray",
      "CBC",
      "CRP",
      "sputum culture",
      "antibiotics (amoxicillin/azithromycin/ceftriaxone)",
      "oxygen therapy",
      "fever management",
    ],
    sometimes: [
      "CT chest",
      "IV antibiotics",
      "hospitalization",
      "bronchoscopy",
    ],
    rare: [
      "ICU admission",
      "mechanical ventilation (severe)",
    ],
    notExpected: [
      "surgery",
      "cardiac catheterization",
      "MRI brain",
      "abdominal imaging",
      "chemotherapy",
    ],
    notes:
      "Pneumonia is treated with antibiotics and supportive care. Surgical and cardiac procedures are not part of routine pneumonia management.",
  },

  asthma: {
    conditionName: "Asthma Attack",
    expected: [
      "nebulization (salbutamol)",
      "IV or oral steroids",
      "oxygen therapy",
      "chest X-ray",
      "spirometry / peak flow",
      "ipratropium nebulization",
    ],
    sometimes: [
      "IV aminophylline",
      "hospitalization",
      "arterial blood gas (ABG)",
    ],
    rare: [
      "mechanical ventilation (status asthmaticus)",
      "ICU admission",
    ],
    notExpected: [
      "surgery",
      "cardiac catheterization",
      "CT scan",
      "MRI",
      "chemotherapy",
    ],
    notes:
      "Asthma attacks are managed with bronchodilators and steroids. Surgery and cardiac procedures are not part of asthma treatment.",
  },

  copd: {
    conditionName: "COPD Exacerbation",
    expected: [
      "chest X-ray",
      "arterial blood gas (ABG)",
      "nebulization (salbutamol, ipratropium)",
      "IV or oral steroids",
      "antibiotics",
      "oxygen therapy",
    ],
    sometimes: [
      "CT chest",
      "hospitalization",
      "BiPAP/CPAP",
      "sputum culture",
    ],
    rare: [
      "mechanical ventilation",
      "ICU",
    ],
    notExpected: [
      "cardiac catheterization",
      "surgery",
      "MRI brain",
      "abdominal imaging",
      "chemotherapy",
    ],
    notes:
      "COPD exacerbation is managed with bronchodilators, steroids, and antibiotics. Surgical and cardiac procedures are unrelated.",
  },

  "pleural effusion": {
    conditionName: "Pleural Effusion",
    expected: [
      "chest X-ray",
      "ultrasound thorax",
      "CBC",
      "LFT",
      "protein/LDH analysis (pleural fluid)",
      "thoracocentesis (pleural tap)",
    ],
    sometimes: [
      "CT chest",
      "pleural biopsy",
      "intercostal drainage (ICD)",
    ],
    rare: [
      "pleurodesis",
      "surgical drainage (VATS)",
    ],
    notExpected: [
      "cardiac catheterization",
      "abdominal surgery",
      "chemotherapy",
      "MRI brain",
      "orthopedic surgery",
    ],
    notes:
      "Pleural effusion management depends on the cause. Thoracocentesis is standard. Chemotherapy is only if malignant.",
  },

  "heart attack": {
    conditionName: "Heart Attack (MI)",
    expected: [
      "ECG (12-lead)",
      "troponin",
      "CBC",
      "2D echocardiography",
      "coronary angiography",
      "aspirin",
      "heparin/LMWH",
      "thrombolytics or primary PCI",
      "ICU / CCU admission",
    ],
    sometimes: [
      "coronary stent placement",
      "CABG (if multivessel disease)",
      "IABP (intra-aortic balloon pump)",
    ],
    rare: [
      "ECMO",
      "cardiac surgery (mechanical complications)",
    ],
    notExpected: [
      "appendectomy",
      "ENT procedures",
      "abdominal surgery",
      "orthopedic surgery",
      "chemotherapy",
    ],
    notes:
      "Heart attack management focuses on rapid coronary reperfusion. Appendectomy, ENT, or orthopedic charges are unrelated.",
  },

  angina: {
    conditionName: "Angina",
    expected: [
      "ECG",
      "stress test (TMT)",
      "2D echocardiography",
      "troponin",
      "CBC",
      "coronary angiography",
      "nitrates",
      "aspirin",
      "statins",
      "beta-blockers",
    ],
    sometimes: [
      "angioplasty (PTCA)",
      "coronary stent",
      "hospitalization",
    ],
    rare: [
      "CABG",
    ],
    notExpected: [
      "appendectomy",
      "abdominal surgery",
      "MRI brain",
      "ENT procedures",
      "chemotherapy",
    ],
    notes:
      "Angina management is cardiovascular. Non-cardiac surgical procedures are unrelated.",
  },

  "heart failure": {
    conditionName: "Heart Failure",
    expected: [
      "ECG",
      "2D echocardiography",
      "chest X-ray",
      "BNP or NT-proBNP",
      "CBC",
      "renal function",
      "diuretics (furosemide)",
      "ACE inhibitors",
      "beta-blockers",
    ],
    sometimes: [
      "IV furosemide",
      "hospitalization",
      "oxygen therapy",
      "digoxin",
      "spironolactone",
    ],
    rare: [
      "IABP",
      "cardiac resynchronization therapy (CRT)",
      "heart transplant evaluation",
    ],
    notExpected: [
      "appendectomy",
      "abdominal surgery",
      "orthopedic surgery",
      "chemotherapy",
    ],
    notes:
      "Heart failure is managed with diuretics and cardiac medications. Non-cardiac procedures are unrelated unless comorbidities are present.",
  },

  stroke: {
    conditionName: "Stroke",
    expected: [
      "CT brain (urgent)",
      "MRI brain",
      "carotid Doppler",
      "ECG",
      "CBC",
      "coagulation profile",
      "physiotherapy",
      "speech therapy",
    ],
    sometimes: [
      "tPA (thrombolysis)",
      "mechanical thrombectomy",
      "ICU admission",
      "anticoagulation",
      "occupational therapy",
    ],
    rare: [
      "decompressive craniectomy",
      "neurosurgery",
    ],
    notExpected: [
      "appendectomy",
      "cardiac surgery",
      "abdominal surgery",
      "ENT procedures",
      "chemotherapy",
    ],
    notes:
      "Stroke is a neurological emergency. Non-neurological/cardiac surgical procedures are unrelated.",
  },

  dvt: {
    conditionName: "Deep Vein Thrombosis (DVT)",
    expected: [
      "duplex ultrasound legs",
      "D-dimer",
      "CBC",
      "anticoagulation (LMWH or NOAC)",
      "coagulation profile",
    ],
    sometimes: [
      "CT pulmonary angiography (if PE suspected)",
      "hospitalization",
      "warfarin",
    ],
    rare: [
      "catheter-directed thrombolysis",
      "surgical thrombectomy",
      "IVC filter",
    ],
    notExpected: [
      "cardiac catheterization",
      "abdominal surgery",
      "MRI brain",
      "ENT procedures",
      "chemotherapy",
    ],
    notes:
      "DVT is managed with anticoagulation. Surgical intervention is rare. Unrelated specialty procedures should be questioned.",
  },

  "hypertensive crisis": {
    conditionName: "Hypertensive Crisis",
    expected: [
      "blood pressure monitoring",
      "ECG",
      "renal function tests",
      "CBC",
      "fundoscopy",
      "IV antihypertensives (labetalol, hydralazine)",
      "2D echocardiography",
    ],
    sometimes: [
      "CT brain (if stroke suspected)",
      "cardiac monitoring",
      "hospitalization",
    ],
    rare: [
      "ICU admission",
    ],
    notExpected: [
      "surgery",
      "appendectomy",
      "orthopedic procedures",
      "ENT surgery",
      "chemotherapy",
    ],
    notes:
      "Hypertensive crisis is managed medically. Surgical procedures are not part of routine hypertensive emergency management.",
  },

  "kidney stones": {
    conditionName: "Kidney Stones",
    expected: [
      "ultrasound KUB",
      "X-ray KUB",
      "urine routine and microscopy",
      "CBC",
      "renal function tests",
      "pain management (diclofenac, tramadol)",
      "IV fluids",
    ],
    sometimes: [
      "CT KUB (non-contrast)",
      "ESWL (extracorporeal shock wave lithotripsy)",
      "ureteroscopy (URS)",
      "alpha-blockers (medical expulsion)",
    ],
    rare: [
      "PCNL (percutaneous nephrolithotomy, for large stones)",
      "open surgery (very rare)",
    ],
    notExpected: [
      "cardiac monitoring",
      "MRI brain",
      "abdominal laparotomy",
      "chemotherapy",
      "cardiac catheterization",
    ],
    notes:
      "Kidney stones are managed with pain control and hydration. Most pass spontaneously. PCNL is for stones >2 cm.",
  },

  "acute kidney injury": {
    conditionName: "Acute Kidney Injury (AKI)",
    expected: [
      "serum creatinine",
      "BUN (blood urea nitrogen)",
      "electrolytes",
      "urine output monitoring",
      "IV fluids",
      "nephrology consultation",
      "CBC",
    ],
    sometimes: [
      "hemodialysis",
      "renal biopsy",
      "antibiotics (if infectious cause)",
      "bladder catheterization",
    ],
    rare: [
      "CRRT (continuous renal replacement therapy)",
      "ICU admission",
    ],
    notExpected: [
      "cardiac catheterization",
      "orthopedic surgery",
      "chemotherapy",
      "MRI brain",
    ],
    notes:
      "AKI is managed with fluid optimization and treating the underlying cause. Dialysis is for severe cases with fluid overload or refractory hyperkalemia.",
  },

  "chronic kidney disease": {
    conditionName: "Chronic Kidney Disease (CKD)",
    expected: [
      "serum creatinine",
      "GFR estimation",
      "electrolytes",
      "hemoglobin",
      "urine protein (microalbuminuria)",
      "blood pressure management",
      "EPO injections (anaemia of CKD)",
      "nephrology follow-up",
    ],
    sometimes: [
      "regular hemodialysis",
      "AV fistula creation",
      "renal biopsy",
      "peritoneal dialysis",
    ],
    rare: [
      "kidney transplant",
    ],
    notExpected: [
      "cardiac bypass surgery",
      "orthopedic surgery",
      "abdominal surgery",
      "chemotherapy",
    ],
    notes:
      "CKD requires ongoing nephrology care. Dialysis access creation (AV fistula) is expected in advanced CKD.",
  },

  bph: {
    conditionName: "Prostate Enlargement (BPH)",
    expected: [
      "PSA (prostate specific antigen)",
      "urine flow study (uroflowmetry)",
      "ultrasound KUB with prostate",
      "urology consultation",
      "alpha-blockers (tamsulosin)",
      "5-alpha reductase inhibitors",
    ],
    sometimes: [
      "cystoscopy",
      "TURP (transurethral resection of prostate)",
    ],
    rare: [
      "open prostatectomy",
      "laser prostatectomy",
    ],
    notExpected: [
      "cardiac catheterization",
      "chemotherapy",
      "MRI brain",
      "orthopedic surgery",
    ],
    notes:
      "BPH is managed with medications or TURP. Chemotherapy is only if prostate cancer is diagnosed.",
  },

  "diabetes complications": {
    conditionName: "Diabetes Complications",
    expected: [
      "blood glucose monitoring",
      "HbA1c",
      "renal function tests",
      "CBC",
      "LFT",
      "lipid profile",
      "insulin / oral hypoglycaemics",
      "ophthalmology referral",
    ],
    sometimes: [
      "antibiotics (diabetic foot/wound)",
      "wound care",
      "podiatry",
      "IV insulin (DKA)",
    ],
    rare: [
      "amputation (severe gangrene)",
      "dialysis (diabetic nephropathy)",
    ],
    notExpected: [
      "cardiac bypass",
      "MRI brain",
      "chemotherapy",
    ],
    notes:
      "Diabetes complications include nephropathy, retinopathy, neuropathy, and foot ulcers. Cardiac bypass is only for co-morbid CAD.",
  },

  dka: {
    conditionName: "Diabetic Ketoacidosis (DKA)",
    expected: [
      "blood glucose",
      "ABG (arterial blood gas)",
      "electrolytes (potassium)",
      "CBC",
      "IV fluids (normal saline)",
      "IV insulin infusion",
      "cardiac monitoring",
      "urine ketones",
    ],
    sometimes: [
      "ICU admission",
      "phosphate replacement",
      "nasogastric tube",
    ],
    rare: [
      "mechanical ventilation (cerebral edema)",
    ],
    notExpected: [
      "surgery",
      "cardiac catheterization",
      "orthopedic surgery",
      "chemotherapy",
    ],
    notes:
      "DKA is a medical emergency managed with IV fluids, insulin, and electrolyte correction. Surgery is not part of DKA management.",
  },

  hypoglycemia: {
    conditionName: "Hypoglycemia",
    expected: [
      "blood glucose",
      "IV dextrose (50%)",
      "oral glucose",
      "CBC",
      "identify underlying cause",
    ],
    sometimes: [
      "glucagon injection",
      "dextrose infusion",
      "IV fluids",
    ],
    rare: [
      "ICU admission (prolonged or severe)",
    ],
    notExpected: [
      "surgery",
      "MRI",
      "cardiac catheterization",
      "chemotherapy",
    ],
    notes:
      "Hypoglycemia is corrected with glucose. Investigation for the cause (insulin dose error, drugs, tumour) may be needed.",
  },

  fracture: {
    conditionName: "Fracture",
    expected: [
      "X-ray",
      "CBC",
      "immobilization (cast or splint)",
      "pain management",
      "orthopedic consultation",
    ],
    sometimes: [
      "CT scan (complex fractures)",
      "open reduction internal fixation (ORIF)",
      "intramedullary nailing",
      "physiotherapy",
    ],
    rare: [
      "external fixation",
      "bone grafting",
    ],
    notExpected: [
      "chemotherapy",
      "cardiac monitoring",
      "MRI brain",
      "abdominal surgery",
      "cardiac catheterization",
    ],
    notes:
      "Fracture management is orthopedic. Cardiac and neurological procedures are only warranted for associated polytrauma.",
  },

  "spinal injury": {
    conditionName: "Spinal Injury",
    expected: [
      "X-ray spine",
      "MRI spine",
      "CT spine",
      "neurosurgery consultation",
      "immobilization (cervical collar / spinal board)",
      "IV methylprednisolone",
    ],
    sometimes: [
      "surgical decompression or spinal fusion",
      "ICU admission",
      "physiotherapy",
      "bladder catheterization",
    ],
    rare: [
      "halo traction",
      "rehabilitation admission",
    ],
    notExpected: [
      "chemotherapy",
      "cardiac catheterization",
      "abdominal surgery",
      "ENT procedures",
    ],
    notes:
      "Spinal injury management is neurosurgical/orthopedic. MRI spine is the key investigation.",
  },

  dislocation: {
    conditionName: "Dislocation",
    expected: [
      "X-ray (confirm dislocation)",
      "closed reduction (under sedation/anesthesia)",
      "immobilization (sling or cast)",
      "pain management",
    ],
    sometimes: [
      "CT scan (hip or shoulder complex dislocation)",
      "anesthesia for reduction",
    ],
    rare: [
      "open reduction (surgery) — if closed reduction fails",
    ],
    notExpected: [
      "chemotherapy",
      "cardiac monitoring",
      "MRI brain",
      "abdominal surgery",
      "cardiac catheterization",
    ],
    notes:
      "Most dislocations are managed with closed reduction. Open surgery is reserved for failed closed reduction or associated fractures.",
  },

  "burn injury": {
    conditionName: "Burn Injury",
    expected: [
      "CBC",
      "blood glucose",
      "electrolytes",
      "wound dressing",
      "IV fluids (Parkland formula)",
      "antibiotics",
      "tetanus prophylaxis",
      "pain management",
    ],
    sometimes: [
      "skin grafting",
      "ICU admission (major burns)",
      "escharotomy",
      "nutritional support",
    ],
    rare: [
      "mechanical ventilation (inhalation injury)",
    ],
    notExpected: [
      "cardiac catheterization",
      "abdominal surgery",
      "chemotherapy",
      "MRI brain",
      "orthopedic implants",
    ],
    notes:
      "Burn management is wound care and fluid resuscitation. Cardiac and chemotherapy charges are unrelated.",
  },

  seizure: {
    conditionName: "Seizure / Epilepsy",
    expected: [
      "EEG",
      "MRI brain",
      "blood glucose",
      "electrolytes",
      "CBC",
      "anti-epileptic drugs (levetiracetam, valproate, phenytoin)",
    ],
    sometimes: [
      "CT brain (first seizure or acute)",
      "IV diazepam or lorazepam (acute seizure)",
      "neurology consultation",
    ],
    rare: [
      "neurosurgery (refractory epilepsy with lesion)",
      "ICU admission (status epilepticus)",
    ],
    notExpected: [
      "cardiac catheterization",
      "abdominal surgery",
      "orthopedic surgery",
      "chemotherapy",
    ],
    notes:
      "Seizure management is neurological. Long-term anti-epileptic therapy is standard. Surgery is only for drug-refractory epilepsy.",
  },

  vertigo: {
    conditionName: "Vertigo / Labyrinthitis",
    expected: [
      "audiometry",
      "ENG or VNG (nystagmography)",
      "anti-vertigo medication (betahistine, meclizine)",
      "ENT consultation",
    ],
    sometimes: [
      "MRI brain (central cause rule-out)",
      "vestibular rehabilitation exercises",
      "IV fluids (if vomiting)",
    ],
    rare: [
      "hospitalization",
    ],
    notExpected: [
      "surgery",
      "cardiac catheterization",
      "chemotherapy",
      "orthopedic surgery",
      "abdominal imaging",
    ],
    notes:
      "Most vertigo is benign positional and managed with medications and exercises. Extensive workup is only needed to exclude central causes.",
  },

  "normal delivery": {
    conditionName: "Normal Delivery",
    expected: [
      "antenatal CBC and urinalysis",
      "ultrasound",
      "CTG (cardiotocography) monitoring",
      "labor room charges",
      "delivery charges",
      "neonatal care",
      "IV fluids",
    ],
    sometimes: [
      "oxytocin augmentation",
      "episiotomy",
      "blood transfusion (postpartum hemorrhage)",
    ],
    rare: [
      "vacuum or forceps delivery",
      "manual removal of placenta",
    ],
    notExpected: [
      "cardiac catheterization",
      "chemotherapy",
      "orthopedic surgery",
      "MRI brain",
      "abdominal laparotomy",
    ],
    notes:
      "Normal delivery is an obstetric event. Non-obstetric procedures on the bill should be questioned.",
  },

  "caesarean section": {
    conditionName: "Caesarean Section (C-Section / LSCS)",
    expected: [
      "pre-op CBC",
      "coagulation profile",
      "blood group and cross-match",
      "anesthesia (spinal or epidural)",
      "LSCS surgery charges",
      "IV antibiotics",
      "post-operative care",
      "neonatal care",
    ],
    sometimes: [
      "blood transfusion",
      "ICU admission",
      "urological procedures (bladder repair)",
    ],
    rare: [
      "hysterectomy (uncontrolled postpartum hemorrhage)",
    ],
    notExpected: [
      "cardiac catheterization",
      "chemotherapy",
      "orthopedic surgery",
      "MRI brain",
      "appendectomy",
    ],
    notes:
      "C-section is an obstetric surgery. Non-obstetric charges should be questioned unless a documented complication occurred.",
  },

  "ectopic pregnancy": {
    conditionName: "Ectopic Pregnancy",
    expected: [
      "beta-hCG (serum)",
      "pelvic ultrasound (transvaginal)",
      "CBC",
      "blood group and cross-match",
      "salpingectomy (surgery)",
      "IV fluids",
      "anesthesia",
    ],
    sometimes: [
      "methotrexate (medical management — selected cases)",
      "blood transfusion",
      "laparoscopic surgery",
    ],
    rare: [
      "bilateral salpingectomy",
      "open laparotomy",
    ],
    notExpected: [
      "cardiac catheterization",
      "chemotherapy",
      "orthopedic surgery",
      "appendectomy",
      "MRI brain",
    ],
    notes:
      "Ectopic pregnancy is an obstetric emergency managed surgically or medically. Unrelated specialty charges should be questioned.",
  },

  anaemia: {
    conditionName: "Severe Anaemia",
    expected: [
      "CBC with peripheral smear",
      "reticulocyte count",
      "serum iron / TIBC / ferritin",
      "B12 and folate",
      "blood transfusion (severe anaemia)",
      "iron supplementation",
    ],
    sometimes: [
      "bone marrow biopsy (aplastic anaemia)",
      "upper GI endoscopy (GI blood loss)",
      "colonoscopy",
      "haematology consultation",
    ],
    rare: [
      "IV iron infusion",
      "erythropoietin injections",
      "splenectomy (hereditary spherocytosis)",
    ],
    notExpected: [
      "cardiac catheterization",
      "chemotherapy",
      "orthopedic surgery",
      "MRI brain",
    ],
    notes:
      "Anaemia treatment depends on the cause. Chemotherapy is only for haematological malignancy. Cardiac surgery is unrelated.",
  },

  anaphylaxis: {
    conditionName: "Allergic Reaction / Anaphylaxis",
    expected: [
      "adrenaline (epinephrine) injection",
      "IV fluids",
      "antihistamines (chlorpheniramine)",
      "IV steroids (hydrocortisone)",
      "oxygen therapy",
      "blood pressure monitoring",
    ],
    sometimes: [
      "nebulization (bronchospasm)",
      "ICU admission (severe anaphylaxis)",
      "IV adrenaline infusion",
    ],
    rare: [
      "mechanical ventilation",
    ],
    notExpected: [
      "surgery",
      "cardiac catheterization",
      "chemotherapy",
      "orthopedic surgery",
      "MRI",
    ],
    notes:
      "Anaphylaxis is managed with adrenaline and supportive care. Surgical and cardiac procedures are unrelated.",
  },
};

// ── Alias map: maps alternate names/keywords → KB key ─────────────────────────

const ALIASES: Record<string, string> = {
  // Dengue
  "dengue fever": "dengue",
  "dhf": "dengue",
  "dengue hemorrhagic": "dengue",

  // Jaundice
  "hepatitis a": "jaundice",
  "icterus": "jaundice",
  "hepatic jaundice": "jaundice",
  "obstructive jaundice": "jaundice",
  "neonatal jaundice": "jaundice",

  // Typhoid
  "enteric fever": "typhoid",
  "typhoid fever": "typhoid",

  // Malaria
  "falciparum malaria": "malaria",
  "vivax malaria": "malaria",
  "cerebral malaria": "malaria",

  // Viral fever
  "fever": "viral fever",
  "febrile illness": "viral fever",
  "pyrexia": "viral fever",
  "undifferentiated fever": "viral fever",

  // Chikungunya
  "chikungunya fever": "chikungunya",

  // Tuberculosis
  "tb": "tuberculosis",
  "pulmonary tb": "tuberculosis",
  "pulmonary tuberculosis": "tuberculosis",
  "extra-pulmonary tb": "tuberculosis",
  "tuberculous": "tuberculosis",

  // COVID-19
  "covid-19": "covid",
  "covid19": "covid",
  "coronavirus": "covid",
  "sars-cov-2": "covid",
  "corona": "covid",

  // Hepatitis B
  "hbv": "hepatitis b",
  "hbsag positive": "hepatitis b",

  // Hepatitis C
  "hcv": "hepatitis c",
  "hcv positive": "hepatitis c",

  // UTI
  "urinary tract infection": "uti",
  "bladder infection": "uti",
  "pyelonephritis": "uti",
  "cystitis": "uti",

  // Meningitis
  "bacterial meningitis": "meningitis",
  "viral meningitis": "meningitis",
  "cryptococcal meningitis": "meningitis",
  "meningoencephalitis": "meningitis",

  // Food poisoning
  "gastric infection": "food poisoning",
  "food infection": "food poisoning",
  "foodborne illness": "food poisoning",

  // Appendicitis
  "appendix": "appendicitis",
  "appendicular": "appendicitis",

  // Peptic ulcer
  "duodenal ulcer": "peptic ulcer",
  "gastric ulcer": "peptic ulcer",
  "h pylori": "peptic ulcer",
  "helicobacter pylori": "peptic ulcer",
  "gi bleed": "peptic ulcer",

  // Cholecystitis
  "gallbladder": "cholecystitis",
  "gallstone": "cholecystitis",
  "cholelithiasis": "cholecystitis",
  "choledocholithiasis": "cholecystitis",
  "acute cholecystitis": "cholecystitis",

  // Pancreatitis
  "acute pancreatitis": "pancreatitis",
  "chronic pancreatitis": "pancreatitis",

  // Hernia
  "inguinal hernia": "hernia",
  "umbilical hernia": "hernia",
  "incisional hernia": "hernia",
  "hiatus hernia": "hernia",

  // Liver cirrhosis
  "cirrhosis": "liver cirrhosis",
  "portal hypertension": "liver cirrhosis",
  "chronic liver disease": "liver cirrhosis",
  "cld": "liver cirrhosis",

  // Heart attack
  "mi": "heart attack",
  "myocardial infarction": "heart attack",
  "stemi": "heart attack",
  "nstemi": "heart attack",
  "heart attack": "heart attack",
  "acute coronary syndrome": "heart attack",
  "acs": "heart attack",

  // Angina
  "unstable angina": "angina",
  "stable angina": "angina",
  "chest pain": "angina",

  // Heart failure
  "chf": "heart failure",
  "congestive heart failure": "heart failure",
  "cardiac failure": "heart failure",
  "lvf": "heart failure",

  // Stroke
  "cva": "stroke",
  "cerebrovascular accident": "stroke",
  "ischemic stroke": "stroke",
  "haemorrhagic stroke": "stroke",
  "brain stroke": "stroke",
  "tia": "stroke",

  // DVT
  "deep vein thrombosis": "dvt",
  "blood clot": "dvt",
  "pulmonary embolism": "dvt",
  "pe": "dvt",
  "thrombosis": "dvt",

  // Hypertensive crisis
  "hypertensive emergency": "hypertensive crisis",
  "hypertensive urgency": "hypertensive crisis",
  "high blood pressure": "hypertensive crisis",
  "hypertension": "hypertensive crisis",
  "htn": "hypertensive crisis",

  // Kidney stones
  "renal calculi": "kidney stones",
  "urolithiasis": "kidney stones",
  "nephrolithiasis": "kidney stones",
  "ureteric stone": "kidney stones",
  "renal stone": "kidney stones",
  "ureterolithiasis": "kidney stones",

  // AKI
  "arf": "acute kidney injury",
  "acute renal failure": "acute kidney injury",
  "acute kidney failure": "acute kidney injury",

  // CKD
  "chronic renal failure": "chronic kidney disease",
  "crf": "chronic kidney disease",
  "end stage renal disease": "chronic kidney disease",
  "esrd": "chronic kidney disease",
  "renal failure": "chronic kidney disease",

  // BPH
  "prostate enlargement": "bph",
  "benign prostatic hyperplasia": "bph",
  "prostate": "bph",
  "prostatic obstruction": "bph",

  // Diabetes
  "diabetic": "diabetes complications",
  "diabetes": "diabetes complications",
  "hyperglycemia": "diabetes complications",
  "type 2 diabetes": "diabetes complications",
  "type 1 diabetes": "diabetes complications",
  "diabetic foot": "diabetes complications",
  "diabetic nephropathy": "diabetes complications",

  // DKA
  "diabetic ketoacidosis": "dka",
  "ketoacidosis": "dka",

  // Hypoglycemia
  "low blood sugar": "hypoglycemia",
  "low glucose": "hypoglycemia",
  "hypoglycaemia": "hypoglycemia",

  // Fracture
  "broken bone": "fracture",
  "bone fracture": "fracture",
  "rib fracture": "fracture",

  // Spinal injury
  "vertebral fracture": "spinal injury",
  "spine injury": "spinal injury",
  "cervical spine": "spinal injury",
  "spinal cord injury": "spinal injury",
  "spondylosis": "spinal injury",

  // Dislocation
  "shoulder dislocation": "dislocation",
  "hip dislocation": "dislocation",
  "joint dislocation": "dislocation",

  // Burns
  "burns": "burn injury",
  "burn": "burn injury",
  "thermal burn": "burn injury",
  "chemical burn": "burn injury",
  "scald": "burn injury",

  // Seizure
  "epilepsy": "seizure",
  "epileptic seizure": "seizure",
  "convulsion": "seizure",
  "status epilepticus": "seizure",
  "fits": "seizure",

  // Vertigo
  "labyrinthitis": "vertigo",
  "bppv": "vertigo",
  "dizziness": "vertigo",
  "meniere": "vertigo",

  // Delivery
  "vaginal delivery": "normal delivery",
  "labour": "normal delivery",
  "delivery": "normal delivery",
  "childbirth": "normal delivery",

  // C-section
  "c-section": "caesarean section",
  "lscs": "caesarean section",
  "cesarean": "caesarean section",
  "caesarian": "caesarean section",
  "lower segment caesarean": "caesarean section",

  // Ectopic pregnancy
  "ectopic": "ectopic pregnancy",
  "tubal pregnancy": "ectopic pregnancy",
  "tubal ectopic": "ectopic pregnancy",

  // Anaemia
  "anemia": "anaemia",
  "anaemia": "anaemia",
  "iron deficiency anaemia": "anaemia",
  "sickle cell": "anaemia",
  "thalassemia": "anaemia",

  // Anaphylaxis
  "allergic reaction": "anaphylaxis",
  "anaphylaxis": "anaphylaxis",
  "allergy": "anaphylaxis",
  "urticaria": "anaphylaxis",
  "angioedema": "anaphylaxis",

  // Asthma
  "bronchial asthma": "asthma",
  "asthma attack": "asthma",
  "acute asthma": "asthma",
  "wheeze": "asthma",
  "bronchospasm": "asthma",

  // COPD
  "chronic obstructive pulmonary disease": "copd",
  "emphysema": "copd",
  "chronic bronchitis": "copd",
  "copd exacerbation": "copd",

  // Gastroenteritis
  "acute gastroenteritis": "gastroenteritis",
  "acute diarrhea": "gastroenteritis",
  "loose stools": "gastroenteritis",
  "diarrhoea": "gastroenteritis",
  "diarrhea": "gastroenteritis",
};

// ── Lookup function ────────────────────────────────────────────────────────────

/**
 * Given a patient's health issue description (free text),
 * returns the matching ConditionEntry or null if no match found.
 * Matching is case-insensitive and tries:
 *   1. Direct KB key substring match
 *   2. Alias map lookup
 */
export function findCondition(healthIssueDescription: string): ConditionEntry | null {
  if (!healthIssueDescription) return null;
  const lower = healthIssueDescription.toLowerCase().trim();

  // 1. Check if any KB key appears as a substring in the description
  for (const key of Object.keys(CONDITIONS_KB)) {
    if (lower.includes(key)) {
      return CONDITIONS_KB[key]!;
    }
  }

  // 2. Check aliases — if any alias phrase is a substring
  for (const [alias, kbKey] of Object.entries(ALIASES)) {
    if (lower.includes(alias)) {
      return CONDITIONS_KB[kbKey] ?? null;
    }
  }

  return null;
}
