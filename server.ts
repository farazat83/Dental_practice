import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'patients-db.json');

// Middlewares
app.use(express.json({ limit: '15mb' }));

// Initial Seed Data to populate when server runs for the first time
const initialPatients = [
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
      48: ['missing'],
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

// Read patients from file or initialize
function readDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialPatients, null, 2), 'utf-8');
      return initialPatients;
    } catch (e) {
      console.error('Failed to create initial database file:', e);
      return initialPatients;
    }
  }
  try {
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to read or parse database file, returning in-memory initial patients:', e);
    return initialPatients;
  }
}

// Write patients to file
function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Failed to write database file:', e);
    return false;
  }
}

// API Routes
app.get('/api/patients', (req, res) => {
  const patients = readDatabase();
  res.json(patients);
});

app.post('/api/patients', (req, res) => {
  const patients = req.body;
  if (!Array.isArray(patients)) {
    return res.status(400).json({ error: 'Body must be a patients JSON array' });
  }
  const success = writeDatabase(patients);
  if (success) {
    res.json({ success: true, message: 'Patients saved successfully on server.' });
  } else {
    res.status(500).json({ error: 'Failed to write data to server disk' });
  }
});

async function startServer() {
  // Vite dev server or static assets serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log(`Database file path: ${DB_PATH}`);
  });
}

startServer();
