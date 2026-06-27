export interface PatientHistory {
  asthma: boolean;
  heartDisease: boolean;
  anticoagulantMeds: boolean;
  diabetes: boolean;
  seizuresIssue: boolean;
  transparent: boolean; // Keep exactly as requested by the user, can label as "Transparent / Blood Transfusion Risks"
  pregnancy: boolean;
}

export type ToothCondition = 'caries' | 'movability' | 'fracture' | 'crown' | 'implant' | 'missing';

export interface OngoingTreatment {
  extraction?: boolean;
  surgicalExtraction?: boolean;
  crownPrep?: boolean;
  inlayPrep?: boolean;
  onlayPrep?: boolean;
  rct?: boolean;
  postAndCore?: boolean;
  fillingClassII?: boolean;
  gingivalLift?: boolean;
  sinusLift?: boolean;
  boneAugmentation?: boolean;
  sutures?: boolean;
  implantRemoval?: boolean;
  oldCrownBridgeRemoval?: boolean;
  onlyCementation?: boolean;
  implant?: boolean;
  intraoralScan?: boolean;
  ct?: boolean;
  notes?: string; // notes section for each appointment/tooth
  toothColor?: string; // tooth color option if intraoralScan is active
  colorNote?: string; // tooth color note
}

export interface Appointment {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  time?: string; // HH:MM
  notes: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  phone: string;
  dateOfFirstVisit: string; // YYYY-MM-DD
  history: PatientHistory;
  dentalChart: Record<number, ToothCondition[]>; // Teeth 1 through 32 mapped to active conditions
  ongoingTreatments?: Record<number, OngoingTreatment>; // Teeth 1 through 32 mapped to ongoing treatments
  appointments: Appointment[];
  generalTreatmentNotes?: Record<string, string>; // Maps YYYY-MM-DD to notes string
}
