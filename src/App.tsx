import React, { useState, useEffect } from 'react';
import { Patient, Appointment, ToothCondition, PatientHistory, OngoingTreatment } from './types';
import { getPatients, savePatients, exportDatabaseFile, importDatabaseFile, fetchPatientsFromServer, savePatientsToServer } from './utils/db';
import DentalChart from './components/DentalChart';
import TreatmentChart from './components/TreatmentChart';
import AppointmentsSection from './components/AppointmentsSection';
import PatientForm from './components/PatientForm';
import PrintReport from './components/PrintReport';
import EliDentLogo from './components/EliDentLogo';
import { Language, translations } from './utils/translations';
import { 
  Search, 
  FileDown, 
  FileUp, 
  UserPlus, 
  Printer, 
  Edit3, 
  Trash2, 
  ChevronRight,
  Users,
  BriefcaseMedical,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'local'>('local');

  // Load language preference from local storage or default to Farsi
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('dental_app_lang') as Language) || 'fa';
  });

  const t = translations[lang];

  // Sync language with standard storage
  useEffect(() => {
    localStorage.setItem('dental_app_lang', lang);
  }, [lang]);

  // Load patient list on load with server sync
  useEffect(() => {
    // 1. Load instantly from local storage for seamless load
    const loaded = getPatients();
    setPatients(loaded);
    if (loaded.length > 0) {
      setSelectedPatientId(loaded[0].id);
    }

    // 2. Hydrate from Pi Server in the background
    setSyncStatus('syncing');
    fetchPatientsFromServer()
      .then((serverPatients) => {
        setPatients(serverPatients);
        setSyncStatus('synced');
        if (serverPatients.length > 0) {
          setSelectedPatientId(prev => {
            const stillExists = serverPatients.some(p => p.id === prev);
            return stillExists ? prev : serverPatients[0].id;
          });
        }
      })
      .catch(() => {
        setSyncStatus('local');
      });
  }, []);

  // Save list when mutated and sync with Raspberry Pi
  const handleUpdatePatientsList = async (updated: Patient[]) => {
    setPatients(updated);
    setSyncStatus('syncing');
    const success = await savePatientsToServer(updated);
    if (success) {
      setSyncStatus('synced');
    } else {
      setSyncStatus('error');
    }
  };

  const activePatient = patients.find(p => p.id === selectedPatientId) || null;

  // Search filter
  const filteredPatients = patients.filter(p => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const phone = p.phone.toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || phone.includes(query);
  });

  // Calculate age
  const getAge = (dobString: string) => {
    if (!dobString) return t.noDate;
    try {
      const today = new Date();
      const birthDate = new Date(dobString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return t.noDate;
    }
  };

  // Create or Update Patient Basic detail & Medical History
  const handleSavePatient = (formData: Partial<Patient>) => {
    if (editingPatient) {
      // Update
      const updatedList = patients.map(p => {
        if (p.id === editingPatient.id) {
          return {
            ...p,
            ...formData,
            history: formData.history || p.history,
          };
        }
        return p;
      });
      handleUpdatePatientsList(updatedList);
      setEditingPatient(null);
    } else {
      // Create
      const newPatient: Patient = {
        id: `pat-${Date.now()}`,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        dob: formData.dob || '',
        phone: formData.phone || '',
        dateOfFirstVisit: formData.dateOfFirstVisit || new Date().toISOString().split('T')[0],
        history: formData.history || {
          asthma: false,
          heartDisease: false,
          anticoagulantMeds: false,
          diabetes: false,
          seizuresIssue: false,
          transparent: false,
          pregnancy: false,
        },
        dentalChart: {},
        appointments: []
      };
      
      const updatedList = [newPatient, ...patients];
      handleUpdatePatientsList(updatedList);
      setSelectedPatientId(newPatient.id);
      setMobileView('detail');
    }
    setIsFormOpen(false);
  };

  // Delete Patient Profile
  const handleDeletePatient = (id: string) => {
    if (window.confirm(t.confirmDeletePatient)) {
      const updated = patients.filter(p => p.id !== id);
      handleUpdatePatientsList(updated);
      if (selectedPatientId === id) {
        setSelectedPatientId(updated.length > 0 ? updated[0].id : null);
        setMobileView('list');
      }
    }
  };

  // Edit Patient Chart Status Update
  const handleUpdateChart = (newChart: Record<number, ToothCondition[]>) => {
    if (!activePatient) return;
    const updatedList = patients.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          dentalChart: newChart
        };
      }
      return p;
    });
    handleUpdatePatientsList(updatedList);
  };

  // Edit Patient Ongoing Treatments Update
  const handleUpdateOngoingTreatments = (newTreatments: Record<number, OngoingTreatment>) => {
    if (!activePatient) return;
    const updatedList = patients.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          ongoingTreatments: newTreatments
        };
      }
      return p;
    });
    handleUpdatePatientsList(updatedList);
  };

  // Edit Patient General Treatment Notes Update
  const handleUpdateGeneralNotes = (newNotes: Record<string, string>) => {
    if (!activePatient) return;
    const updatedList = patients.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          generalTreatmentNotes: newNotes
        };
      }
      return p;
    });
    handleUpdatePatientsList(updatedList);
  };

  // Edit Patient Appointments list
  const handleUpdateAppointments = (newApts: Appointment[]) => {
    if (!activePatient) return;
    const updatedList = patients.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          appointments: newApts
        };
      }
      return p;
    });
    handleUpdatePatientsList(updatedList);
  };

  // Import Database JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    importDatabaseFile(
      file,
      (importedPatients) => {
        handleUpdatePatientsList(importedPatients);
        if (importedPatients.length > 0) {
          setSelectedPatientId(importedPatients[0].id);
        }
        setImportError(null);
        alert(lang === 'fa' ? 'فایل پایگاه داده محلی با موفقیت بازیابی و با مراجعین همگام‌سازی شد.' : 'Local Database file successfully restored! Patient records synchronized.');
      },
      (err) => {
        setImportError(err);
      }
    );
  };

  const getRiskFactorCount = (history: PatientHistory) => {
    return Object.values(history).filter(v => v).length;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans" id="dental-clinic-app" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      
      {/* 1. Header Toolbar (Sleek Interface Modern Style) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EliDentLogo size={42} className="shrink-0" />
            <div>
              <h1 className="text-sm sm:text-base font-black text-blue-900 flex items-center gap-1.5 leading-tight tracking-tight flex-wrap">
                {lang === 'fa' ? 'الی دنت سوپرون' : 'ELI-DENT SOPRON'}
                <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-50 font-mono text-[9px] font-black text-blue-600 border border-blue-100 leading-none">
                  {lang === 'fa' ? 'مرکز بالینی پیشرفته' : 'CLINICAL HUB'}
                </span>
                {/* Raspberry Pi Server Sync Status */}
                {syncStatus === 'synced' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 font-mono text-[9px] font-black text-emerald-600 border border-emerald-100 leading-none shadow-3xs" title={lang === 'fa' ? 'متصل به سرور رزبری پای ۵' : 'Connected to Raspberry Pi 5 server'}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    {lang === 'fa' ? 'سرور فعال' : 'PI SERVER'}
                  </span>
                )}
                {syncStatus === 'syncing' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 font-mono text-[9px] font-black text-amber-600 border border-amber-100 leading-none animate-pulse shadow-3xs" title={lang === 'fa' ? 'در حال همگام‌سازی با سرور...' : 'Syncing with Raspberry Pi 5...'}>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    {lang === 'fa' ? 'همگام‌سازی' : 'SYNCING'}
                  </span>
                )}
                {syncStatus === 'error' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 font-mono text-[9px] font-black text-rose-600 border border-rose-100 leading-none shadow-3xs" title={lang === 'fa' ? 'آفلاین - خطا در اتصال به سرور رزبری پای (تغییرات شما به صورت محلی ذخیره شدند)' : 'Connection failed. Changes saved locally.'}>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                    {lang === 'fa' ? 'سرور آفلاین (ذخیره محلی)' : 'PI OFFLINE (LOCAL CACHE)'}
                  </span>
                )}
                {syncStatus === 'local' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 font-mono text-[9px] font-black text-slate-500 border border-slate-200 leading-none shadow-3xs" title={lang === 'fa' ? 'آفلاین - پایگاه داده فقط به صورت محلی فعال است' : 'Offline local database'}>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                    {lang === 'fa' ? 'فقط محلی' : 'LOCAL ONLY'}
                  </span>
                )}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold leading-normal">
                {t.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-[10px] font-black rounded-md transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('fa')}
                className={`px-2.5 py-1 text-[10px] font-black rounded-md transition-all cursor-pointer ${
                  lang === 'fa' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                فا
              </button>
            </div>

            {/* Quick Export Database Button */}
            <button
              onClick={() => exportDatabaseFile(patients)}
              className="px-2 sm:px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs"
              title={lang === 'fa' ? 'پشتیبان‌گیری کامل پرونده‌ها' : 'Backup Entire Database'}
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">{lang === 'fa' ? 'پشتیبان‌گیری' : 'Export Backup'}</span>
            </button>

            {/* Quick Import Database Button */}
            <label className="px-2 sm:px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs">
              <FileUp className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">{lang === 'fa' ? 'ورود پشتیبان' : 'Import Database'}</span>
              <input
                id="database-file-uploader"
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </header>

      {/* 2. Primary Layout Framework */}
      <main className="flex-1 max-w-7xl w-full mx-auto flex overflow-hidden">
        
        {/* Left Drawer / Sidebar: Patients Search & Navigation */}
        <section 
          id="patient-sidebar"
          className={`w-full md:w-80 shrink-0 border-r border-slate-200 bg-white flex flex-col h-[calc(100vh-108px)] ${
            mobileView === 'detail' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Sidebar Search Bar */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className={`absolute ${lang === 'fa' ? 'right-3' : 'left-3'} top-2.5 w-4 h-4 text-slate-400`} />
              <input
                id="search-patients-input"
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${lang === 'fa' ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 text-xs border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-slate-50 hover:bg-slate-100/50 font-bold`}
              />
            </div>

            <button
              type="button"
              id="register-patient-btn"
              onClick={() => {
                setEditingPatient(null);
                setIsFormOpen(true);
              }}
              className="w-full py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-transform hover:-translate-y-0.5 select-none"
            >
              <UserPlus className="w-4 h-4" />
              {t.registerPatient}
            </button>
          </div>

          {importError && (
            <div className="mx-4 my-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-650 font-semibold leading-normal">
              <p className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {lang === 'fa' ? 'خطا در ورود داده:' : 'Error Importing:'}
              </p>
              <p className="mt-0.5">{importError}</p>
            </div>
          )}

          {/* Patients Navigation List */}
          <div className="flex-grow overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center justify-between">
              <span>{t.patientLogs}</span>
              <span className="font-mono text-[9px] text-slate-500">{filteredPatients.length} {t.activeStatus}</span>
            </div>

            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                const riskCount = getRiskFactorCount(p.history);
                return (
                  <button
                    key={p.id}
                    id={`patient-tab-${p.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setMobileView('detail');
                    }}
                    className={`w-full p-3 ${lang === 'fa' ? 'text-right' : 'text-left'} rounded-xl transition-all cursor-pointer select-none relative group flex items-start gap-3 border ${
                      isSelected
                        ? 'bg-blue-50 text-blue-950 border-blue-150 shadow-xs ring-1 ring-blue-100 md:scale-101'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border-transparent'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors uppercase ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {p.firstName[0]}
                      {p.lastName[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs font-bold text-slate-900 truncate leading-tight">
                          {lang === 'fa' ? `${p.firstName} ${p.lastName}` : `${p.lastName}, ${p.firstName}`}
                        </h3>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${lang === 'fa' ? 'rotate-180' : ''} ${
                          isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-350 opacity-0 group-hover:opacity-100'
                        }`} />
                      </div>

                      <div className="flex items-center gap-1.5 text-[10.5px] text-slate-450 mt-0.5 font-bold leading-tight truncate">
                        <span>{t.ageLabel} {getAge(p.dob)} {lang === 'fa' ? t.yearsSuffix : ''}</span>
                        <span>•</span>
                        <span className="truncate">{p.phone || t.noPhone}</span>
                      </div>

                      {/* Warning risk icons if patient history triggers conditions */}
                      {riskCount > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {p.history.heartDisease && (
                            <span className="px-1.5 py-0.5 rounded-sm bg-red-100 text-red-700 text-[8.5px] font-bold uppercase tracking-wide">
                              {lang === 'fa' ? 'قلب' : 'Heart'}
                            </span>
                          )}
                          {p.history.anticoagulantMeds && (
                            <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-700 text-[8.5px] font-bold uppercase tracking-wide">
                              {lang === 'fa' ? 'خونریزی' : 'Bleed'}
                            </span>
                          )}
                          {p.history.pregnancy && (
                            <span className="px-1.5 py-0.5 rounded-sm bg-pink-100 text-pink-700 text-[8.5px] font-bold uppercase tracking-wide">
                              {lang === 'fa' ? 'بارداری' : 'Preg'}
                            </span>
                          )}
                          {p.history.asthma && (
                            <span className="px-1.5 py-0.5 rounded-sm bg-purple-100 text-purple-700 text-[8.5px] font-bold uppercase tracking-wide">
                              {lang === 'fa' ? 'آسم' : 'Asth'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-10 px-4">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">{t.noPatientsFound}</p>
                <p className="text-[10px] text-slate-400 mt-1">{t.noPatientsFoundDesc}</p>
              </div>
            )}
          </div>

          {/* Database Info Stamp */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10.5px] text-slate-450 font-bold select-none text-center">
            {t.dbSavedLocally}
          </div>
        </section>

        {/* Right Active Workspace: Dental Chart, Medical history and Notes */}
        <section 
          id="patient-detail-workspace"
          className={`flex-1 overflow-y-auto h-[calc(100vh-108px)] bg-slate-100 p-4 sm:p-6 ${
            mobileView === 'list' && !selectedPatientId ? 'hidden md:block' : 'block'
          }`}
        >
          {activePatient ? (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Mobile Back Button to search list */}
              <div className="md:hidden mb-4">
                <button
                  type="button"
                  onClick={() => setMobileView('list')}
                  className="px-3.5 py-1.5 bg-white border border-slate-250 text-slate-600 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer select-none"
                >
                  {lang === 'fa' ? '← بازگشت به لیست مراجعین' : t.backToList}
                </button>
              </div>

              {/* 3. Patient Header Metrics & Metadata (Demographics Profile Card) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" id="patient-card-header">
                
                {/* Clinical Warning Bar if risk exist */}
                {getRiskFactorCount(activePatient.history) > 0 && (
                  <div className="bg-rose-50 text-rose-900 border-b border-rose-100 px-6 py-2.5 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-600 fill-rose-100 shrink-0" />
                    <span className="font-bold leading-relaxed">
                      {t.criticalSystemicFlags} ({getRiskFactorCount(activePatient.history)})
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl uppercase shadow-xs shrink-0 select-none">
                        {activePatient.firstName[0]}
                        {activePatient.lastName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                            {activePatient.firstName} {activePatient.lastName}
                          </h2>
                          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider">
                            {t.activePatientBadge}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap font-semibold">
                          <span>{t.dobLabel}: {activePatient.dob || t.noDate}</span>
                          <span>•</span>
                          <span>{t.ageLabel}: {getAge(activePatient.dob)} {lang === 'fa' ? t.yearsSuffix : 'years'}</span>
                          <span>•</span>
                          <span>{t.patientIdLabel}: #{activePatient.id}</span>
                        </p>
                      </div>
                    </div>

                    {/* Operational Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        id="print-file-btn"
                        onClick={() => setIsPrintPreviewOpen(true)}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-705 px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        {t.exportPdf}
                      </button>

                      <button
                        type="button"
                        id="edit-profile-btn"
                        onClick={() => {
                          setEditingPatient(activePatient);
                          setIsFormOpen(true);
                        }}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-705 px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {t.editProfile}
                      </button>

                      <button
                        type="button"
                        id="delete-patient-btn"
                        onClick={() => handleDeletePatient(activePatient.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-150 transition-colors cursor-pointer select-none"
                        title={t.deleteProfile}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Demographics details block */}
                  <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-2.5">
                        {t.contactHeader}
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400">{t.phoneLabel}</label>
                          <p className="text-slate-900 font-bold text-sm">{activePatient.phone || t.noPhone}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400">{t.firstVisitLabel}</label>
                          <p className="text-slate-900 font-bold text-sm">{activePatient.dateOfFirstVisit || t.noDate}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-2.5">
                        {t.systemicHistoryHeader}
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {Object.entries(activePatient.history).map(([key, value]) => {
                          const label = t.historyLabels[key as keyof PatientHistory] || key;
                          const active = !!value;

                          return (
                            <div 
                              key={key} 
                              className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                                active 
                                  ? key === 'heartDisease' || key === 'anticoagulantMeds' 
                                    ? 'bg-red-50 text-red-700 border-red-100 font-bold shadow-xs' 
                                    : 'bg-amber-50 text-amber-700 border-amber-100 font-bold'
                                  : 'bg-slate-50 border-slate-150 text-slate-400'
                              }`}
                            >
                              <span className="text-xs font-semibold">{label}</span>
                              <div className={`w-4 h-4 rounded flex items-center justify-center ${active ? 'bg-current text-white' : 'border border-slate-300'}`}>
                                {active && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 4. Interactive Dental Chart Segment */}
              <DentalChart 
                chart={activePatient.dentalChart} 
                onChange={handleUpdateChart} 
                isEditable={true}
                lang={lang}
              />

              {/* 4b. Ongoing Treatments Segment */}
              <TreatmentChart
                treatments={activePatient.ongoingTreatments || {}}
                onChange={handleUpdateOngoingTreatments}
                isEditable={true}
                lang={lang}
                appointments={activePatient.appointments || []}
                generalNotes={activePatient.generalTreatmentNotes || {}}
                onUpdateGeneralNotes={handleUpdateGeneralNotes}
              />

              {/* 5. Appointments Timeline & Notes Section */}
              <AppointmentsSection 
                appointments={activePatient.appointments || []} 
                onChange={handleUpdateAppointments} 
                lang={lang}
              />

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="w-16 h-16 bg-slate-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                  <BriefcaseMedical className="w-8 h-8" />
                </div>
                <h2 className="text-base font-bold text-slate-800">{t.noSelectedPatientTitle}</h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {t.noSelectedPatientDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPatient(null);
                    setIsFormOpen(true);
                  }}
                  className="mt-5 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5 select-none"
                >
                  <UserPlus className="w-4 h-4" />
                  {lang === 'fa' ? 'گشایش اولین پرونده بیمار' : 'Add First Patient'}
                </button>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* 8. Footer Bar of the App (Sleek Interface style) */}
      <footer className="bg-slate-900 text-slate-400 px-8 py-3 text-xs flex justify-between items-center w-full z-10" dir="ltr">
        <div className="flex gap-4">
          <span>Local DB Status: <strong className="text-emerald-400 font-mono">Synchronized</strong></span>
          <span>Last Backup: Just now</span>
        </div>
        <div className="text-[11px] font-bold text-slate-500 font-mono">
          EliDent Sopron Clinical Platform v2.5.0
        </div>
      </footer>

      {/* 6. Dialog: Patient Registration / Edit Profile Form (Modal Overlay) */}
      <AnimatePresence>
        {isFormOpen && (
          <PatientForm
            patient={editingPatient}
            onSave={handleSavePatient}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingPatient(null);
            }}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* 7. Dialog: Printable Patient File Preview Frame (Modal Overlay) */}
      <AnimatePresence>
        {isPrintPreviewOpen && activePatient && (
          <PrintReport
            patient={activePatient}
            onClose={() => setIsPrintPreviewOpen(false)}
            onUpdatePatient={(updatedPatient) => {
              const updatedList = patients.map(p => p.id === updatedPatient.id ? updatedPatient : p);
              handleUpdatePatientsList(updatedList);
            }}
            lang={lang}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
