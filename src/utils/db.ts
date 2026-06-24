import { Patient } from '../types';

const STORAGE_KEY = 'dental_patient_hub_db';

const initialPatients: Patient[] = [
  {
    id: 'pat-1',
    firstName: 'John',
    lastName: 'Miller',
    dob: '1984-05-12',
    phone: '+1 (555) 019-2834',
    dateOfFirstVisit: '2025-01-15',
    history: {
      asthma: true,
      heartDisease: false,
      anticoagulantMeds: false,
      diabetes: false,
      seizuresIssue: false,
      transparent: false,
      pregnancy: false,
    },
    dentalChart: {
      16: ['crown'],
      26: ['caries'],
      36: ['missing'],
      46: ['implant'],
    },
    appointments: [
      {
        id: 'apt-1-1',
        date: '2025-01-15',
        time: '10:00',
        notes: 'First checkup. Found caries on tooth #26. High plaque score, advised electronic toothbrush and flossing technique.',
      },
      {
        id: 'apt-1-2',
        date: '2025-03-10',
        time: '11:15',
        notes: 'Filled caries on tooth #26 using composite. Patient reported mild sensitivity to cold which resolved in 2 days.',
      },
      {
        id: 'apt-1-3',
        date: '2026-06-30',
        time: '14:30',
        notes: 'Follow-up oral hygiene session and scaling. Schedule checkup on the restored crown.',
      }
    ],
  },
  {
    id: 'pat-2',
    firstName: 'Eleanor',
    lastName: 'Vance',
    dob: '1970-11-22',
    phone: '+1 (555) 014-9988',
    dateOfFirstVisit: '2024-08-05',
    history: {
      asthma: false,
      heartDisease: true,
      anticoagulantMeds: true,
      diabetes: false,
      seizuresIssue: false,
      transparent: true,
      pregnancy: false,
    },
    dentalChart: {
      11: ['fracture'],
      38: ['missing'],
      35: ['caries', 'movability'],
    },
    appointments: [
      {
        id: 'apt-2-1',
        date: '2024-08-05',
        time: '09:00',
        notes: 'Patient was on Warfarin (anticoagulant). Coordinated with cardiologist, INR is at 2.1 which is safe for simple scaling. Fractured tooth #11 was temporized.',
      },
      {
        id: 'apt-2-2',
        date: '2026-07-15',
        time: '16:00',
        notes: 'Next consultation to discuss restoring tooth #11 and preparing root canal treatment or crown.',
      }
    ],
  },
  {
    id: 'pat-3',
    firstName: 'Sophia',
    lastName: 'Chen',
    dob: '1995-02-28',
    phone: '+1 (555) 012-7812',
    dateOfFirstVisit: '2025-06-01',
    history: {
      asthma: false,
      heartDisease: false,
      anticoagulantMeds: false,
      diabetes: false,
      seizuresIssue: false,
      transparent: false,
      pregnancy: true,
    },
    dentalChart: {
      18: ['missing'],
      28: ['missing'],
      38: ['missing'],
      48: ['missing'], // Wisdom teeth extracted
    },
    appointments: [
      {
        id: 'apt-3-1',
        date: '2025-06-01',
        time: '13:00',
        notes: 'Exam done. Patient is in her second trimester. Maintained active scaling and polishing. Highlighted safe local anesthetic options if treatment needs to be done. No active decay found.',
      }
    ],
  }
];

export function getPatients(): Patient[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPatients));
    return initialPatients;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse active database, returning defaults:', e);
    return initialPatients;
  }
}

export function savePatients(patients: Patient[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

export async function fetchPatientsFromServer(): Promise<Patient[]> {
  try {
    const res = await fetch('/api/patients');
    if (!res.ok) throw new Error('Failed to fetch from server');
    const data = await res.json();
    if (Array.isArray(data)) {
      savePatients(data); // sync local cache
      return data;
    }
    throw new Error('Server returned invalid data format');
  } catch (e) {
    console.warn('Could not contact Raspberry Pi server, using local cache:', e);
    throw e;
  }
}

export async function savePatientsToServer(patients: Patient[]): Promise<boolean> {
  savePatients(patients); // immediate local cache write
  try {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patients),
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to save to Raspberry Pi server:', e);
    return false;
  }
}

export function exportDatabaseFile(patients: Patient[]): void {
  const dataStr = JSON.stringify(patients, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = `dental_db_${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function importDatabaseFile(file: File, onSuccess: (patients: Patient[]) => void, onError: (err: string) => void): void {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target?.result as string);
      if (Array.isArray(parsed)) {
        // Simple structure validation
        const isValid = parsed.every((p: any) => p.id && typeof p.firstName === 'string' && typeof p.lastName === 'string');
        if (isValid) {
          onSuccess(parsed);
        } else {
          onError('Invalid file format: Each patient must have id, firstName, and lastName fields.');
        }
      } else {
        onError('Invalid file format: Data must be a JSON array of patients.');
      }
    } catch (e) {
      onError('Failed to parse file. Make sure it is a valid .json file.');
    }
  };
  reader.onerror = () => onError('Failed to read the database file.');
  reader.readAsText(file);
}
