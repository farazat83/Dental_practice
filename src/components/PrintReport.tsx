import React, { useState, useEffect } from 'react';
import { Patient, ToothCondition, Appointment, OngoingTreatment } from '../types';
import { Printer, FileText, Activity, ShieldCheck, Heart, Trash2, Plus, Calendar, Clock, Edit3, X, ClipboardList } from 'lucide-react';
import EliDentLogo from './EliDentLogo';
import { Language, translations } from '../utils/translations';

interface PrintReportProps {
  patient: Patient;
  onClose: () => void;
  onUpdatePatient?: (updatedPatient: Patient) => void;
  lang: Language;
}

const treatmentKeysList = [
  'extraction', 'surgicalExtraction', 'crownPrep', 'inlayPrep', 'onlayPrep', 'rct',
  'postAndCore', 'fillingClassII', 'gingivalLift', 'sinusLift', 'boneAugmentation',
  'sutures', 'implantRemoval', 'oldCrownBridgeRemoval', 'onlyCementation', 'implant',
  'intraoralScan', 'ct'
] as const;

export default function PrintReport({ patient, onClose, onUpdatePatient, lang }: PrintReportProps) {
  const [firstName, setFirstName] = useState(patient.firstName);
  const [lastName, setLastName] = useState(patient.lastName);
  const [dob, setDob] = useState(patient.dob || '');
  const [phone, setPhone] = useState(patient.phone || '');
  const [firstVisit, setFirstVisit] = useState(patient.dateOfFirstVisit || '');
  const [appointments, setAppointments] = useState(patient.appointments || []);

  const t = translations[lang];

  // Upper teeth in FDI (Quadrant 1: 18-11, Quadrant 2: 21-28)
  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  // Lower teeth in FDI (Quadrant 4: 48-41, Quadrant 3: 31-38)
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const handleSaveAndSync = () => {
    if (onUpdatePatient) {
      onUpdatePatient({
        ...patient,
        firstName,
        lastName,
        dob,
        phone,
        dateOfFirstVisit: firstVisit,
        appointments
      });
    }
  };

  const handleTriggerPrint = () => {
    handleSaveAndSync();
    window.print();
  };

  const handleClose = () => {
    handleSaveAndSync();
    onClose();
  };

  const getAge = (dobString: string) => {
    if (!dobString) return 'N/A';
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
      return 'N/A';
    }
  };

  const getToothName = (num: number): string => {
    const digit2 = num % 10;
    if (lang === 'fa') {
      if (digit2 === 1) return 'ثنایای مرکزی';
      if (digit2 === 2) return 'ثنایای جانبی';
      if (digit2 === 3) return 'دندان نیش';
      if (digit2 === 4) return 'آسیاب کوچک اول';
      if (digit2 === 5) return 'آسیاب کوچک دوم';
      if (digit2 === 6) return 'آسیاب بزرگ اول';
      if (digit2 === 7) return 'آسیاب بزرگ دوم';
      if (digit2 === 8) return 'دندان عقل';
      return 'دندان';
    } else {
      if (digit2 === 1) return 'Central Incisor';
      if (digit2 === 2) return 'Lateral Incisor';
      if (digit2 === 3) return 'Canine';
      if (digit2 === 4) return 'First Premolar';
      if (digit2 === 5) return 'Second Premolar';
      if (digit2 === 6) return 'First Molar';
      if (digit2 === 7) return 'Second Molar';
      if (digit2 === 8) return 'Third Molar (Wisdom)';
      return 'Tooth';
    }
  };

  const getToothArchName = (num: number): string => {
    const q = Math.floor(num / 10);
    const toothName = getToothName(num);
    if (lang === 'fa') {
      let quadrant = '';
      if (q === 1) quadrant = 'بالا راست';
      else if (q === 2) quadrant = 'بالا چپ';
      else if (q === 3) quadrant = 'پایین چپ';
      else if (q === 4) quadrant = 'پایین راست';
      return `${quadrant} — دندان #${num} (${toothName})`;
    } else {
      let quadrant = '';
      if (q === 1) quadrant = 'Upper Right';
      else if (q === 2) quadrant = 'Upper Left';
      else if (q === 3) quadrant = 'Lower Left';
      else if (q === 4) quadrant = 'Lower Right';
      return `${quadrant} — Tooth #${num} (${toothName})`;
    }
  };

  const getRiskFactorCount = (history: Patient['history']) => {
    return Object.values(history).filter(Boolean).length;
  };

  const handleUpdateAppointmentNotes = (id: string, text: string) => {
    setAppointments(appointments.map(apt => apt.id === id ? { ...apt, notes: text } : apt));
  };

  const handleUpdateAppointmentMeta = (id: string, field: 'date' | 'time', value: string) => {
    setAppointments(appointments.map(apt => apt.id === id ? { ...apt, [field]: value } : apt));
  };

  const handleAddAppointmentRow = () => {
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      time: '12:00',
      notes: ''
    };
    setAppointments([newApt, ...appointments]);
  };

  const handleDeleteAppointmentRow = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  const renderStaticDiagnosticalTooth = (num: number) => {
    const conditions = patient.dentalChart?.[num] || [];
    const isMissing = conditions.includes('missing');
    const isImplant = conditions.includes('implant');
    const isCrown = conditions.includes('crown');
    const hasCaries = conditions.includes('caries');
    const hasFracture = conditions.includes('fracture');
    const hasMovability = conditions.includes('movability');

    let toothBg = 'bg-white';
    let borderStyle = 'border-slate-200';

    if (isMissing) {
      toothBg = 'bg-slate-100/60 opacity-60';
      borderStyle = 'border-dashed border-slate-350';
    } else if (isImplant) {
      toothBg = 'bg-slate-200';
      borderStyle = 'border-slate-500 border-2';
    } else {
      if (hasCaries) {
        toothBg = 'bg-red-50';
        borderStyle = 'border-red-400 border-2';
      } else if (hasFracture) {
        toothBg = 'bg-fuchsia-50';
        borderStyle = 'border-fuchsia-400 border-2';
      } else if (isCrown) {
        toothBg = 'bg-teal-50';
        borderStyle = 'border-teal-400 border-2';
      } else if (hasMovability) {
        toothBg = 'bg-amber-50';
        borderStyle = 'border-amber-400 border-2';
      }
    }

    return (
      <div 
        key={num}
        className={`flex flex-col items-center justify-between p-1 rounded-sm border h-14 w-[34px] text-center select-none ${toothBg} ${borderStyle}`}
        style={{ contentVisibility: 'auto' }}
      >
        <span className="text-[8px] font-bold font-mono text-slate-850">{num}</span>
        <div className="relative flex-grow flex items-center justify-center w-full my-0.5">
          {isMissing ? (
            <div className="text-slate-400 relative flex items-center justify-center w-full h-full scale-75">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </div>
          ) : isImplant ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center scale-75">
              <div className="w-3.5 h-4 border border-slate-600 bg-slate-300 rounded-xs flex flex-col justify-between items-center overflow-hidden">
                <div className="w-full h-1 bg-slate-500" />
              </div>
            </div>
          ) : (
            <div className="relative w-4 h-6 flex flex-col items-center justify-center scale-90">
              <svg className="w-3.5 h-4 text-slate-300" viewBox="0 0 24 32" fill="none">
                <path
                  d="M2.5 5.5 C2.5 1.5, 21.5 1.5, 21.5 5.5 C21.5 9.5, 19.5 17.5, 17.5 21.5 C16.5 23.5, 15.5 31.5, 14 31.5 C12.5 31.5, 12.5 23.5, 12 23.5 C11.5 23.5, 11.5 31.5, 10 31.5 C8.5 31.5, 7.5 23.5, 6.5 21.5 C4.5 17.5, 2.5 9.5, 2.5 5.5 Z"
                  fill={isCrown ? '#ccfbf1' : '#ffffff'}
                  stroke={isCrown ? '#0d9488' : '#cbd5e1'}
                  strokeWidth="2"
                />
                {hasCaries && (
                  <circle cx="12" cy="11" r="3.5" fill="#dc2626" />
                )}
                {hasFracture && (
                  <path d="M4 6 L12 11 L16 8" stroke="#d946ef" strokeWidth="2.5" strokeLinecap="round" />
                )}
              </svg>
              {hasMovability && (
                <div className="absolute bottom-0 w-full flex justify-center space-x-[2px] mb-[-2px]">
                  <span className="w-1 h-1 rounded-full bg-amber-500" />
                  <span className="w-1 h-1 rounded-full bg-amber-500" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStaticTreatmentTooth = (num: number) => {
    const tr = patient.ongoingTreatments?.[num] || {};
    const isExt = !!tr.extraction || !!tr.surgicalExtraction;
    const isImplant = !!tr.implant;
    const isBoneAug = !!tr.boneAugmentation || !!tr.sinusLift;
    const isScan = !!tr.intraoralScan;
    const isCT = !!tr.ct;

    const hasAny = isExt || isImplant || isBoneAug || isScan || isCT;

    let toothBg = 'bg-white';
    let borderStyle = 'border-slate-200';

    if (hasAny) {
      if (isExt) {
        toothBg = 'bg-rose-50';
        borderStyle = 'border-rose-350 border-2';
      } else if (isBoneAug) {
        toothBg = 'bg-emerald-50';
        borderStyle = 'border-emerald-350 border-2';
      } else if (isImplant) {
        toothBg = 'bg-sky-50';
        borderStyle = 'border-sky-350 border-2';
      } else if (isScan) {
        toothBg = 'bg-pink-50';
        borderStyle = 'border-pink-350 border-2';
      } else if (isCT) {
        toothBg = 'bg-amber-50';
        borderStyle = 'border-amber-300 border-2';
      } else {
        toothBg = 'bg-indigo-50';
        borderStyle = 'border-indigo-300 border-2';
      }
    }

    return (
      <div 
        key={num}
        className={`flex flex-col items-center justify-between p-1 rounded-sm border h-14 w-[34px] text-center select-none ${toothBg} ${borderStyle}`}
        style={{ contentVisibility: 'auto' }}
      >
        <span className="text-[8px] font-bold font-mono text-slate-800">{num}</span>
        <div className="relative flex-grow flex items-center justify-center w-full my-0.5">
          <svg className="w-3.5 h-4 text-slate-300" viewBox="0 0 24 32" fill="none">
            <path
              d="M2.5 5.5 C2.5 1.5, 21.5 1.5, 21.5 5.5 C21.5 9.5, 19.5 17.5, 17.5 21.5 C16.5 23.5, 15.5 31.5, 14 31.5 C12.5 31.5, 12.5 23.5, 12 23.5 C11.5 23.5, 11.5 31.5, 10 31.5 C8.5 31.5, 7.5 23.5, 6.5 21.5 C4.5 17.5, 2.5 9.5, 2.5 5.5 Z"
              fill={isImplant ? '#e0f2fe' : isBoneAug ? '#d1fae5' : isScan ? '#fce7f3' : '#ffffff'}
              stroke={isExt ? '#f43f5e' : isImplant ? '#0284c7' : isBoneAug ? '#059669' : isScan ? '#db2777' : '#cbd5e1'}
              strokeWidth="2"
            />
            {isExt && (
              <path d="M5 8 L19 24 M19 8 L5 24" stroke="#e11d48" strokeWidth="2.5" />
            )}
            {isBoneAug && <circle cx="12" cy="11" r="3" fill="#10b981" />}
            {isScan && <path d="M8 12 H16 M12 8 V16" stroke="#db2777" strokeWidth="2" />}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans shadow-lg" id="printable-report-dialog" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <style>{`
        @media print {
          /* 1. Hide all main screen layout elements */
          header, footer, main, #patient-sidebar, #patient-detail-workspace, #register-patient-btn, .interactive-btn {
            display: none !important;
            visibility: hidden !important;
          }

          #dental-clinic-app > *:not(#printable-report-dialog) {
            display: none !important;
            visibility: hidden !important;
          }

          /* 2. Reset standard document box model for printing */
          html, body, #dental-clinic-app {
            display: block !important;
            position: relative !important;
            background: white !important;
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            width: 100% !important;
          }
          
          /* 3. Force position of the print wrapper to top of the page */
          #printable-report-dialog {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            background-color: #ffffff !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            z-index: 9999 !important;
          }

          /* 4. Disable rounded corners, scale animations, margins, and center alignment on the dialog body */
          #printable-report-dialog > div {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
            height: auto !important;
          }

          /* 5. Force the inner view container containing the letterhead etc. to render fully without scrolling */
          #printable-report-dialog .max-h-\\[80vh\\] {
            max-height: none !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            background-color: #ffffff !important;
          }

          #dental-printout {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: white !important;
            background-color: #ffffff !important;
            visibility: visible !important;
          }

          input, textarea, select {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            resize: none !important;
            outline: none !important;
            height: auto !important;
            overflow: visible !important;
            color: #000000 !important;
            box-shadow: none !important;
            width: 100% !important;
          }
          
          /* Hide interactive components on paper */
          .interactive-btn, button, .delete-btn-print {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions bar - Hidden in Print */}
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center print:hidden border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded-sm">
              {lang === 'fa' ? 'پیش‌نمایش زنده چاپی و ویرایشگر بالینی' : 'LIVE PREVIEW & EDITOR'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="trigger-print-btn"
              onClick={handleTriggerPrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-transform hover:-translate-y-0.5 shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              {t.exportPdf}
            </button>
            <button
              onClick={handleClose}
              className="px-3 py-1.5 border border-slate-600 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              {lang === 'fa' ? 'بستن و اعمال' : 'Close & Sync'}
            </button>
          </div>
        </div>

        {/* Outer view frame with gray printable container */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto bg-slate-100 print:bg-white print:p-0 print:max-h-full">
          
          <div className="bg-white p-8 sm:p-12 mx-auto rounded-xl shadow-sm border border-slate-200 max-w-3xl print:border-0 print:shadow-none print:p-0" id="dental-printout">
            
            {/* Medical Practice Letterhead with Logo & Name */}
            <div className="flex flex-col items-center justify-center pb-5 border-b-2 border-slate-800 mb-6 text-center">
              <div className="flex items-center justify-center mb-1">
                <EliDentLogo size={64} />
              </div>
              <h1 className="text-2xl font-black text-blue-900 tracking-tight leading-none mt-2">
                {t.clinicTitle}
              </h1>
              <p className="text-[10px] font-bold tracking-widest text-slate-450 mt-1.5 uppercase">
                {t.tagline}
              </p>
              
              {/* Clinical Contact Details */}
              <div className="mt-3 text-[10.5px] text-slate-600 font-semibold flex flex-wrap justify-center items-center gap-x-3.5 gap-y-1 w-full border-t border-slate-100 pt-2">
                <span>📍 Bécsi út 95, Sopron 9400, Ungarn</span>
                <span className="text-slate-300">•</span>
                <span>📞 0036203494166</span>
                <span className="text-slate-300">•</span>
                <span>✉️ Eli.dent.sopron@gmail.com</span>
                <span className="text-slate-300">•</span>
                <span>🌐 www.eli-dent.at</span>
              </div>

              <div className="w-full mt-2 flex justify-between items-center text-[10px] font-bold text-slate-400 border-t border-dashed border-slate-200 pt-2">
                <div>{t.dbSavedLocally}</div>
                <div>{t.patientIdLabel}: #{patient.id}</div>
                <div>{t.dateGenerated}: {new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { dateStyle: 'long' })}</div>
              </div>
            </div>

            {/* Demographics Profile Grid */}
            <div className="mb-6 mb-break-avoid animate-fade-in">
              <div className="flex justify-between items-center mb-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {lang === 'fa' ? '۱. اطلاعات دموگرافیک و مشخصات هویتی بیمار' : '1. Patient Demographics & Profile Details'}
                </h3>
                <span className="text-[9px] font-mono text-slate-405 font-black flex items-center gap-1 print:hidden">
                  <Edit3 className="w-3 h-3 text-blue-500" /> {lang === 'fa' ? 'برای جزییات کلیک کنید' : 'Click inline to adjust details'}
                </span>
              </div>
              <table className="w-full text-xs font-bold text-slate-700 border-collapse table-fixed">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 text-slate-400 font-bold w-1/4 uppercase tracking-wider text-[9.5px]">
                      {t.firstNameLabel}
                    </td>
                    <td className="py-2 text-slate-905 pr-4">
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 outline-hidden transition-all focus:ring-1 focus:ring-blue-400 print:bg-transparent print:border-none print:px-0 print:py-0"
                      />
                    </td>
                    <td className="py-2 text-slate-400 font-bold w-1/4 uppercase tracking-wider text-[9.5px]">
                      {t.lastNameLabel}
                    </td>
                    <td className="py-2 text-slate-905">
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 outline-hidden transition-all focus:ring-1 focus:ring-blue-400 print:bg-transparent print:border-none print:px-0 print:py-0"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 text-slate-400 font-bold w-1/4 uppercase tracking-wider text-[9.5px]">{t.dobLabel}</td>
                    <td className="py-2 text-slate-905 pr-4">
                      <input 
                        type="date" 
                        value={dob} 
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 outline-hidden transition-all focus:ring-1 focus:ring-blue-400 print:bg-transparent print:border-none print:px-0 print:py-0"
                      />
                    </td>
                    <td className="py-2 text-slate-400 font-bold w-1/4 uppercase tracking-wider text-[9.5px]">{t.ageLabel}</td>
                    <td className="py-2 text-slate-800">
                      <span className="px-2 font-black text-slate-900 bg-slate-100 rounded py-0.5">{getAge(dob)} {t.yearsSuffix}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-400 font-bold w-1/4 uppercase tracking-wider text-[9.5px]">{t.phoneLabel}</td>
                    <td className="py-2 text-slate-905 pr-4">
                      <input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 outline-hidden transition-all focus:ring-1 focus:ring-blue-400 print:bg-transparent print:border-none print:px-0 print:py-0"
                      />
                    </td>
                    <td className="py-2 text-slate-400 font-bold w-1/4 uppercase tracking-wider text-[9.5px]">{t.firstVisitLabel}</td>
                    <td className="py-2 text-slate-905">
                      <input 
                        type="date" 
                        value={firstVisit} 
                        onChange={(e) => setFirstVisit(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 outline-hidden transition-all focus:ring-1 focus:ring-blue-400 print:bg-transparent print:border-none print:px-0 print:py-0"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Systemic Medical History & Warnings */}
            <div className="mb-6 mb-break-avoid">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                {lang === 'fa' ? '۲. ارزیابی سلامت سیستماتیک و خطرات پزشکی' : '2. Systemic Health & Medical Risk Profile'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
                  <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-3">
                    {t.historyConcernsHeader}
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(patient.history).filter(([_, value]) => !!value).length === 0 ? (
                      <div className="text-slate-500 font-semibold text-xs py-2 text-center">
                        {lang === 'fa' ? '✓ هیچگونه مورد خطر سیستماتیک یا عوارض زمینه ای پزشکی ثبت نشده است.' : '✓ No systemic health concerns or medical risk factors reported.'}
                      </div>
                    ) : (
                      Object.entries(patient.history)
                        .filter(([_, value]) => !!value)
                        .map(([key, value]) => {
                          const active = !!value;
                          return (
                            <div key={key} className="flex items-center justify-between text-xs pb-1.5 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <span className="font-semibold text-red-700 font-bold">
                                {t.historyLabels[key as keyof Patient['history']]}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-850">
                                {t.yesState}
                              </span>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* Medical Advisory Comments */}
                <div className="border border-slate-200 rounded-xl p-4 bg-amber-50/10">
                  <h4 className="text-[11px] font-black uppercase text-yellow-800 tracking-wider mb-3">
                    {t.medicalAdvisoryNotes}
                  </h4>
                  
                  <div className="space-y-3.5 text-xs font-semibold leading-relaxed text-slate-700">
                    {getRiskFactorCount(patient.history) > 0 ? (
                      <div className="space-y-2">
                        {patient.history.heartDisease && (
                          <div className="text-red-800 bg-red-50/50 p-2 rounded border border-red-100 text-[11px]">
                            <strong>• Heart risk:</strong> Avoid adrenaline-based anesthetics (e.g. epinephrine) unless cleared. Monitor ECG/stress factors.
                          </div>
                        )}
                        {patient.history.anticoagulantMeds && (
                          <div className="text-amber-800 bg-amber-50/50 p-2 rounded border border-amber-100 text-[11px]">
                            <strong>• Anticoagulant bleeding hazard:</strong> Verify INR values. Prepare local hemostatic agents (gelatemp, suture material) before surgery.
                          </div>
                        )}
                        {patient.history.pregnancy && (
                          <div className="text-pink-800 bg-pink-50/50 p-2 rounded border border-pink-100 text-[11px]">
                            <strong>• Pregnancy restrictions:</strong> Postpone elective works. Use double-layer lead aprons for urgent diagnostic imaging.
                          </div>
                        )}
                        {patient.history.asthma && (
                          <div className="text-purple-800 bg-purple-50/50 p-2 rounded border border-purple-100 text-[11px]">
                            <strong>• Pulmonary asthmatic:</strong> Ensure inhaler bronchodilator accessibility. Avoid NSAIDs trigger.
                          </div>
                        )}
                        {patient.history.diabetes && (
                          <div className="text-emerald-800 bg-emerald-50/50 p-2 rounded border border-emerald-100 text-[11px]">
                            <strong>• Diabetes recovery warning:</strong> Anticipate socket healing delay. Pre-operative antibiotic prophylaxis is recommended.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-500 italic text-center py-6">
                        {lang === 'fa' ? 'هیچ هشدار حادی در تاریخچه پزشکی ثبت نشده است. شرایط بالینی در حالت پایدار قرار دارد.' : 'No active clinical warning flags detected. Safe for conventional local anesthesia and dental protocols.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Identified Dental Anomalies (Dental Chart) */}
            <div className="mb-6 mb-break-avoid">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                {lang === 'fa' ? '۳. آنومالی‌ها و شرایط شناسایی شده دندان‌ها' : '3. Identified Dental Chart Anatomy & Anomalies'}
              </h3>

              {/* Visual Diagnostical Arch Diagram in PDF */}
              <div className="bg-slate-50/50 p-4 border border-slate-200 rounded-xl mb-4 overflow-x-auto flex justify-center">
                <div className="min-w-[620px] max-w-[660px] flex flex-col gap-3.5 p-1 select-none text-[9px] font-semibold text-slate-400">
                  {/* Maxillary Upper Arch Row */}
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-bold text-slate-550 uppercase tracking-wider">
                      {lang === 'fa' ? 'بالا' : 'UPPER'}
                    </div>
                    <div className="flex items-center justify-between gap-1 pl-12">
                      {upperTeeth.map(renderStaticDiagnosticalTooth)}
                    </div>
                  </div>

                  {/* Symmetrical Bite midline */}
                  <div className="h-[1px] bg-slate-200 border-dashed border-b border-slate-250 ml-12 relative flex items-center justify-center">
                    <span className="absolute px-2.5 py-0.5 bg-white text-[7.5px] font-bold text-slate-400 font-mono uppercase tracking-widest rounded-full leading-none">
                      {t.biteMidline}
                    </span>
                  </div>

                  {/* Mandibular Lower Arch Row */}
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-bold text-slate-550 uppercase tracking-wider">
                      {lang === 'fa' ? 'پایین' : 'LOWER'}
                    </div>
                    <div className="flex items-center justify-between gap-1 pl-12">
                      {lowerTeeth.map(renderStaticDiagnosticalTooth)}
                    </div>
                  </div>
                </div>
              </div>
              
              {Object.keys(patient.dentalChart).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.keys(patient.dentalChart)
                    .sort((a,b) => parseInt(a) - parseInt(b))
                    .map((numStr) => {
                      const num = parseInt(numStr);
                      const conditions = patient.dentalChart[num] || [];
                      return (
                        <div key={num} className="border border-slate-200 rounded-lg p-3 bg-slate-50/45 flex items-start gap-2.5">
                          <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 font-mono text-[10px] font-black rounded-lg shrink-0">
                            #{num}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{getToothName(num)}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {conditions.map((cond, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-bold border border-blue-100">
                                  {t.conditionLabels[cond] || cond}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="p-4 bg-slate-25/50 rounded-xl border border-dashed border-slate-150 text-center text-xs text-slate-500 font-medium col-span-full">
                  {lang === 'fa' ? 'نمودار دندانی فاقد علامت فعال است.' : 'Dental chart has no logged pathology or existing hardware conditions.'}
                </div>
              )}
            </div>

            {/* Ongoing Clinical Treatment Plan */}
            <div className="mb-6 mb-break-avoid" id="print-ongoing-treatments-section">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {lang === 'fa' ? '۴. طرح‌های در حال درمان و شیدهای قالب‌گیری دیجیتال' : '4. Ongoing Clinical Treatment Plan & Restorative Log'}
              </h3>
              
              {/* Visual Treatment Arch Diagram in PDF */}
              <div className="bg-slate-50/50 p-4 border border-slate-200 rounded-xl mb-4 overflow-x-auto flex justify-center">
                <div className="min-w-[620px] max-w-[660px] flex flex-col gap-3.5 p-1 select-none text-[9px] font-semibold text-slate-400">
                  {/* Maxillary Upper Arch Row */}
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-bold text-slate-505 uppercase tracking-wider">
                      {lang === 'fa' ? 'بالا' : 'UPPER'}
                    </div>
                    <div className="flex items-center justify-between gap-1 pl-12">
                      {upperTeeth.map(renderStaticTreatmentTooth)}
                    </div>
                  </div>

                  {/* Symmetrical Bite midline */}
                  <div className="h-[1px] bg-slate-200 border-dashed border-b border-slate-250 ml-12 relative flex items-center justify-center">
                    <span className="absolute px-2.5 py-0.5 bg-white text-[7.5px] font-bold text-slate-400 font-mono uppercase tracking-widest rounded-full leading-none">
                      {t.biteMidline}
                    </span>
                  </div>

                  {/* Mandibular Lower Arch Row */}
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-bold text-slate-505 uppercase tracking-wider">
                      {lang === 'fa' ? 'پایین' : 'LOWER'}
                    </div>
                    <div className="flex items-center justify-between gap-1 pl-12">
                      {lowerTeeth.map(renderStaticTreatmentTooth)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Written treatment plan table underneath */}
              {patient.ongoingTreatments && Object.keys(patient.ongoingTreatments).length > 0 ? (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[9px] border-b border-slate-200">
                        <th className="p-2.5 w-16">{lang === 'fa' ? 'دندان' : 'Tooth #'}</th>
                        <th className="p-2.5">{lang === 'fa' ? 'موقعیت بالینی' : 'Arch & Quadrant'}</th>
                        <th className="p-2.5">{lang === 'fa' ? 'فرایند درمانی و شید انتخابی' : 'Ongoing Operations & Shade Selection'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(patient.ongoingTreatments).sort((a,b) => parseInt(a)-parseInt(b)).map((numStr) => {
                        const num = parseInt(numStr);
                        const tr = patient.ongoingTreatments?.[num] || {};
                        const archStr = getToothArchName(num);
                        const activeKeysForThisTooth = treatmentKeysList.filter(k => !!tr[k]);
                        
                        return (
                          <tr key={num} className="border-b border-slate-150 last:border-0 hover:bg-slate-25/50 transition-colors">
                            <td className="p-2.5 font-bold text-slate-900">
                              <span className="inline-block px-1.5 py-0.5 rounded-sm bg-purple-50 text-purple-800 border border-purple-150 text-[10px] font-mono">
                                #{num}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-500 font-medium">{archStr}</td>
                            <td className="p-2.5 space-y-1.5">
                              <div className="flex flex-wrap gap-1.5">
                                {activeKeysForThisTooth.map(key => (
                                  <span key={key} className="inline-block px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                                    {t.treatmentKeys[key]}
                                  </span>
                                ))}
                              </div>

                              {/* Shade Match info */}
                              {tr.intraoralScan && tr.toothColor && (
                                <div className="text-[10.5px] text-pink-800 font-semibold bg-pink-50/40 p-1.5 rounded border border-pink-100 flex flex-wrap gap-2">
                                  <span><strong>{t.toothColorLabel}:</strong> <span className="underline">{tr.toothColor}</span></span>
                                  {tr.colorNote && <span>| <strong>{t.colorNoteLabel}:</strong> {tr.colorNote}</span>}
                                </div>
                              )}

                              {/* Tooth treatment notes */}
                              {tr.notes && (
                                <div className="text-[10.5px] bg-slate-50 border border-slate-150 p-2 rounded text-slate-700 italic whitespace-pre-line leading-relaxed font-semibold">
                                  <strong>{t.clinicalNotesLabel}:</strong> {tr.notes}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-slate-25/50 rounded-xl border border-dashed border-slate-150 text-center text-xs text-slate-500 font-medium">
                  {t.noTreatmentsRecorded}
                </div>
              )}

              {/* General Treatment Notes Section for Print */}
              {patient.generalTreatmentNotes && Object.keys(patient.generalTreatmentNotes).length > 0 && (
                <div className="mt-4 mb-4" id="print-general-treatment-notes-section">
                  <div className="bg-pink-50/50 p-2.5 rounded-lg border border-pink-150 mb-2.5">
                    <h4 className="text-xs font-bold text-pink-900 uppercase tracking-wider m-0 flex items-center gap-1.5">
                      <ClipboardList className="w-4 h-4 text-pink-600" />
                      {lang === 'fa' ? 'یادداشت‌های عمومی درمان (بر اساس تاریخ قرار ملاقات)' : 'General Treatment Notes (By Appointment Date)'}
                    </h4>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[9px] border-b border-slate-200">
                          <th className="p-2.5 w-32">{lang === 'fa' ? 'تاریخ جلسه' : 'Appointment Date'}</th>
                          <th className="p-2.5">{lang === 'fa' ? 'توضیحات و اقدامات درمانی عمومی' : 'General Treatment Remarks & Progress Summary'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(patient.generalTreatmentNotes)
                          .sort((a, b) => b[0].localeCompare(a[0])) // newer first
                          .map(([dateKey, textVal]) => (
                            <tr key={dateKey} className="border-b border-slate-150 last:border-0 hover:bg-slate-25/50 transition-colors">
                              <td className="p-2.5 font-bold text-slate-900 font-mono">
                                {dateKey}
                              </td>
                              <td className="p-2.5 text-slate-700 font-semibold leading-relaxed whitespace-pre-line">
                                {textVal}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Session Logs and Notes */}
            <div className="mb-break-inside-avoid">
              <div className="flex justify-between items-center mb-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider m-0">
                  {lang === 'fa' ? '۵. تاریخچه و اقدامات جلسات درمانی (ویزیت‌ها)' : '5. Chronicled Appointment logs & Progress clinical comments'}
                </h3>
                <button
                  type="button"
                  onClick={handleAddAppointmentRow}
                  className="interactive-btn flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10.5px] rounded-md transition-shadow cursor-pointer select-none"
                >
                  <Plus className="w-3 h-3" />
                  {t.addSessionLogBtn}
                </button>
              </div>

              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="relative group border border-slate-201 rounded-xl p-4 bg-white hover:bg-slate-50/50 transition-colors">
                      <button
                        type="button"
                        onClick={() => handleDeleteAppointmentRow(apt.id)}
                        className="delete-btn-print absolute top-3 right-3 text-red-500 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg border border-red-150 cursor-pointer select-none"
                        title="Delete Session Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Header values */}
                      <div className="flex flex-wrap items-center gap-3 text-xs mb-3 font-semibold text-slate-550">
                        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <input
                            type="date"
                            value={apt.date}
                            onChange={(e) => handleUpdateAppointmentMeta(apt.id, 'date', e.target.value)}
                            className="bg-transparent font-bold text-slate-800 focus:outline-hidden text-xs py-0 px-1 border-none print:w-auto"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <input
                            type="text"
                            value={apt.time || ''}
                            onChange={(e) => handleUpdateAppointmentMeta(apt.id, 'time', e.target.value)}
                            className="bg-transparent font-bold text-slate-800 focus:outline-hidden text-xs py-0 px-1 border-none w-12"
                            placeholder="12:00"
                          />
                        </div>
                      </div>

                      {/* Notes component */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                          {t.sessionNotesLabel}
                        </label>
                        <textarea
                          rows={3}
                          value={apt.notes}
                          onChange={(e) => handleUpdateAppointmentNotes(apt.id, e.target.value)}
                          placeholder={t.sessionPlaceholder}
                          className="w-full p-2.5 bg-slate-50/50 hover:bg-slate-100/30 focus:bg-white border border-slate-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-402 rounded-lg text-xs font-bold text-slate-750 resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 italic">
                   {lang === 'fa' ? 'هیچ ویزیت یا جلسه درمانی ثبت نشده است. دکمه بالا را برای ثبت جلسه جدید لمس کنید.' : 'No appointment sessions recorded. click the button to add detailed diagnostic logs.'}
                </div>
              )}
            </div>

            {/* Regulatory Signatures / Stamp seals */}
            <div className="mt-8 pt-8 border-t-2 border-slate-800 border-dashed grid grid-cols-2 gap-6 leading-relaxed mb-break-inside-avoid">
              <div className="text-center flex flex-col items-center justify-between min-h-[140px]">
                <div className="text-slate-400 font-black uppercase tracking-wider text-[10px]">
                  {t.signatureLine}
                </div>
                <div className="font-serif italic text-slate-750 text-sm mt-3 border-b-2 border-slate-450 pb-2 px-10">
                  Dr. Nassajian Faraz (DMD)
                </div>
                <div className="text-[9.5px] text-slate-400 mt-1 font-semibold uppercase font-mono">
                  REG. 76059
                </div>
              </div>

              <div className="text-center flex flex-col items-center justify-between min-h-[140px]">
                <div className="text-slate-400 font-black uppercase tracking-wider text-[10px]">
                  {t.officialStamp}
                </div>
                
                {/* Simulated circular/octagonal stamp in PDF */}
                <div className="w-20 h-20 rounded-full border-4 border-double border-blue-800/60 p-1 flex items-center justify-center text-blue-800/60 select-none animate-pulse rotate-12">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-blue-800/60 flex flex-col items-center justify-center font-black select-none">
                    <span className="text-[6.5px] font-mono tracking-tighter">ELI-DENT</span>
                    <span className="text-[8px] font-black">APPROVED</span>
                    <span className="text-[6px] font-mono tracking-tighter">SOPRON HQ</span>
                  </div>
                </div>

                <div className="text-[9.5px] text-slate-400 font-semibold uppercase font-mono mt-1">
                  Eli-Dent Clinic Seal
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
