import React, { useState, useEffect } from 'react';
import { OngoingTreatment } from '../types';
import { Trash2, ShieldCheck, ClipboardList, Sparkles, FileText } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface TreatmentChartProps {
  treatments: Record<number, OngoingTreatment>;
  onChange: (treatments: Record<number, OngoingTreatment>) => void;
  isEditable?: boolean;
  lang: Language;
}

// Config to describe treatments, style badges, and colors on teeth representation
// All keys are strictly of keyof Omit<OngoingTreatment, 'notes' | 'toothColor' | 'colorNote'>
const treatmentKeyConfig = [
  { key: 'extraction', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-450', dotColor: 'bg-rose-500' },
  { key: 'surgicalExtraction', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-450', dotColor: 'bg-violet-500' },
  { key: 'crownPrep', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-450', dotColor: 'bg-amber-500' },
  { key: 'inlayPrep', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-450', dotColor: 'bg-orange-500' },
  { key: 'onlayPrep', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-450', dotColor: 'bg-yellow-500' },
  { key: 'rct', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-450', dotColor: 'bg-indigo-500' },
  { key: 'postAndCore', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-450', dotColor: 'bg-cyan-500' },
  { key: 'fillingClassII', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-450', dotColor: 'bg-teal-500' },
  { key: 'gingivalLift', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-450', dotColor: 'bg-emerald-600' },
  { key: 'sinusLift', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-450', dotColor: 'bg-purple-500' },
  { key: 'boneAugmentation', color: 'text-emerald-900', bg: 'bg-emerald-50', border: 'border-emerald-350', dotColor: 'bg-emerald-700' },
  { key: 'sutures', color: 'text-lime-700', bg: 'bg-lime-50', border: 'border-lime-450', dotColor: 'bg-lime-600' },
  { key: 'implantRemoval', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-450', dotColor: 'bg-red-650' },
  { key: 'oldCrownBridgeRemoval', color: 'text-stone-600', bg: 'bg-stone-50', border: 'border-stone-450', dotColor: 'bg-stone-500' },
  { key: 'onlyCementation', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-400', dotColor: 'bg-blue-450' },
  { key: 'implant', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-450', dotColor: 'bg-sky-500' },
  { key: 'intraoralScan', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-450', dotColor: 'bg-pink-500' },
  { key: 'ct', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-450', dotColor: 'bg-amber-700' },
] as const;

const popularShades = ['A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D2', 'D3', 'D4'];

export default function TreatmentChart({ treatments, onChange, isEditable = true, lang }: TreatmentChartProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [localNotes, setLocalNotes] = useState<string>('');
  const [localColorNote, setLocalColorNote] = useState<string>('');
  const [localToothColor, setLocalToothColor] = useState<string>('');
  
  const t = translations[lang];

  // Upper teeth in FDI (Quadrant 1: 18-11, Quadrant 2: 21-28)
  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  // Lower teeth in FDI (Quadrant 4: 48-41, Quadrant 3: 31-38)
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  // Synchronize local states when selectedTooth or treatments prop changes
  useEffect(() => {
    if (selectedTooth !== null) {
      const toothData = treatments[selectedTooth] || {};
      if (document.activeElement?.id !== `notes-${selectedTooth}`) {
        setLocalNotes(toothData.notes || '');
      }
      if (document.activeElement?.id !== `colorNote-${selectedTooth}`) {
        setLocalColorNote(toothData.colorNote || '');
      }
      if (document.activeElement?.id !== `toothColor-${selectedTooth}`) {
        setLocalToothColor(toothData.toothColor || '');
      }
    } else {
      setLocalNotes('');
      setLocalColorNote('');
      setLocalToothColor('');
    }
  }, [selectedTooth, treatments]);

  // Save outstanding edits for a given field
  const saveActiveText = (toothNum: number, field: 'notes' | 'colorNote' | 'toothColor', val: string) => {
    if (!isEditable) return;
    const current = treatments[toothNum] || {};
    if (current[field] !== val) {
      const updated = {
        ...current,
        [field]: val
      };
      const newTreatments = { ...treatments };
      newTreatments[toothNum] = updated;
      onChange(newTreatments);
    }
  };

  // Wrapper to save current tooth text fields before selecting another tooth or closing
  const handleSelectTooth = (num: number | null) => {
    if (selectedTooth !== null) {
      saveActiveText(selectedTooth, 'notes', localNotes);
      saveActiveText(selectedTooth, 'colorNote', localColorNote);
      saveActiveText(selectedTooth, 'toothColor', localToothColor);
    }
    setSelectedTooth(num);
  };

  const handleToggleTreatment = (toothNum: number, key: keyof Omit<OngoingTreatment, 'notes' | 'toothColor' | 'colorNote'>) => {
    if (!isEditable) return;
    const current = treatments[toothNum] || {};
    const updated = {
      ...current,
      [key]: !current[key]
    };

    // If intraoralScan is turned off, we can clear tooth color info
    if (key === 'intraoralScan' && !updated[key]) {
      delete updated.toothColor;
      delete updated.colorNote;
    }

    // Clean up if all keys are empty/false
    const hasActiveTreatments = Object.keys(updated).some(k => {
      if (k === 'notes' || k === 'toothColor' || k === 'colorNote') {
        return !!updated[k as keyof OngoingTreatment];
      }
      return !!updated[k as keyof Omit<OngoingTreatment, 'notes' | 'toothColor' | 'colorNote'>];
    });

    const newTreatments = { ...treatments };
    if (!hasActiveTreatments) {
      delete newTreatments[toothNum];
    } else {
      newTreatments[toothNum] = updated;
    }
    onChange(newTreatments);
  };

  const handleUpdateText = (toothNum: number, field: 'notes' | 'toothColor' | 'colorNote', val: string) => {
    if (!isEditable) return;
    const current = treatments[toothNum] || {};
    const updated = {
      ...current,
      [field]: val
    };

    const newTreatments = { ...treatments };
    newTreatments[toothNum] = updated;
    onChange(newTreatments);
  };

  const handleClearTooth = (toothNum: number) => {
    if (!isEditable) return;
    const newTreatments = { ...treatments };
    delete newTreatments[toothNum];
    onChange(newTreatments);
  };

  const getToothName = (num: number): string => {
    const digit2 = num % 10;
    if (lang === 'fa') {
      if (digit2 === 1) return 'ثنایای مرکزی (سنترال)';
      if (digit2 === 2) return 'ثنایای جانبی (لاترال)';
      if (digit2 === 3) return 'دندان نیش (کانین)';
      if (digit2 === 4) return 'آسیاب کوچک اول (پری‌مولار ۱)';
      if (digit2 === 5) return 'آسیاب کوچک دوم (پری‌مولار ۲)';
      if (digit2 === 6) return 'آسیاب بزرگ اول (مولار ۱)';
      if (digit2 === 7) return 'آسیاب بزرگ دوم (مولار ۲)';
      if (digit2 === 8) return 'دندان عقل (مولار ۳)';
      return 'دندان';
    } else {
      if (digit2 === 1) return 'Central Incisor';
      if (digit2 === 2) return 'Lateral Incisor';
      if (digit2 === 3) return 'Canine (Cuspid)';
      if (digit2 === 4) return 'First Premolar (Bicuspid)';
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
      if (q === 1) quadrant = 'بالا سمت راست (ماگزیلاری)';
      else if (q === 2) quadrant = 'بالا سمت چپ (ماگزیلاری)';
      else if (q === 3) quadrant = 'پایین سمت چپ (مندیبولار)';
      else if (q === 4) quadrant = 'پایین سمت راست (مندیبولار)';
      return `${quadrant} — دندان شماره #${num} (${toothName})`;
    } else {
      let quadrant = '';
      if (q === 1) quadrant = 'Upper Right (Maxillary)';
      else if (q === 2) quadrant = 'Upper Left (Maxillary)';
      else if (q === 3) quadrant = 'Lower Left (Mandibular)';
      else if (q === 4) quadrant = 'Lower Right (Mandibular)';
      return `${quadrant} — Tooth #${num} (${toothName})`;
    }
  };

  const renderTooth = (num: number) => {
    const tr = treatments[num] || {};
    const isSelected = selectedTooth === num;
    
    // Check if any treatments are logged on this tooth
    const isExt = !!tr.extraction || !!tr.surgicalExtraction;
    const isImplant = !!tr.implant;
    const isBoneAug = !!tr.boneAugmentation || !!tr.sinusLift;
    const isScan = !!tr.intraoralScan;
    const isCT = !!tr.ct;
    const hasTreatmentNotes = !!tr.notes;
    
    const activeKeys = treatmentKeyConfig.filter(cfg => !!tr[cfg.key]);
    const hasAny = activeKeys.length > 0 || hasTreatmentNotes;

    let toothBg = 'bg-white hover:bg-slate-50';
    let borderStyle = 'border-slate-200';

    if (hasAny) {
      if (tr.extraction || tr.surgicalExtraction) {
        toothBg = 'bg-rose-50/80';
        borderStyle = 'border-rose-450 border-2';
      } else if (tr.implant) {
        toothBg = 'bg-sky-50/80';
        borderStyle = 'border-sky-450 border-2';
      } else if (tr.boneAugmentation || tr.sinusLift) {
        toothBg = 'bg-emerald-50/80';
        borderStyle = 'border-emerald-450 border-2';
      } else if (tr.intraoralScan) {
        toothBg = 'bg-pink-50/80';
        borderStyle = 'border-pink-450 border-2';
      } else if (tr.rct || tr.postAndCore || tr.crownPrep) {
        toothBg = 'bg-indigo-50/80';
        borderStyle = 'border-indigo-400 border-2';
      } else {
        toothBg = 'bg-slate-50';
        borderStyle = 'border-slate-400 border';
      }
    }

    if (isSelected) {
      borderStyle = 'border-blue-600 ring-2 ring-blue-450 border-2 scale-105';
    }

    return (
      <button
        key={num}
        id={`treatment-tooth-btn-${num}`}
        type="button"
        onClick={() => handleSelectTooth(selectedTooth === num ? null : num)}
        className={`relative flex flex-col items-center justify-between p-1.5 rounded-lg shadow-xs transition-all cursor-pointer h-20 min-w-[42px] select-none ${toothBg} ${borderStyle}`}
      >
        <span className="text-[10px] font-mono font-bold text-slate-500">{num}</span>

        {/* Scaled graphic representation */}
        <div className="relative w-full flex-grow flex items-center justify-center">
          <div className="relative w-7 h-10 flex flex-col items-center justify-center">
            <svg className="w-6 h-8 text-slate-350" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Symmetrical Tooth Silhouette */}
              <path
                d="M2.5 5.5 C2.5 1.5, 21.5 1.5, 21.5 5.5 C21.5 9.5, 19.5 17.5, 17.5 21.5 C16.5 23.5, 15.5 31.5, 14 31.5 C12.5 31.5, 12.5 23.5, 12 23.5 C11.5 23.5, 11.5 31.5, 10 31.5 C8.5 31.5, 7.5 23.5, 6.5 21.5 C4.5 17.5, 2.5 9.5, 2.5 5.5 Z"
                fill={isImplant ? '#e0f2fe' : isBoneAug ? '#d1fae5' : isScan ? '#fce7f3' : '#ffffff'}
                stroke={isExt ? '#f43f5e' : isImplant ? '#0284c7' : isBoneAug ? '#059669' : isScan ? '#db2777' : '#cbd5e1'}
                strokeWidth="1.5"
              />
              {/* Extra visual indicators */}
              {isExt && (
                <path d="M5 8 L19 24 M19 8 L5 24" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              )}
              {isBoneAug && (
                <circle cx="12" cy="11" r="3.5" fill="#10b981" />
              )}
              {isScan && (
                <path d="M8 12 H16 M12 8 V16" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>

        {/* Small indicators at bottom */}
        <div className="flex flex-wrap justify-center gap-[2px] min-h-[8px] w-full mt-0.5 overflow-hidden">
          {activeKeys.slice(0, 4).map(cfg => (
            <span key={cfg.key} className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} title={t.treatmentKeys[cfg.key]} />
          ))}
          {hasTreatmentNotes && !activeKeys.some(c => c.key === 'intraoralScan') && (
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" title="Notes Logged" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-150 p-5 select-none" id="ongoing-treatments-comp" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-4 bg-purple-500 rounded-sm"></span>
            {t.treatmentSectionTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-semibold">
            {isEditable ? t.treatmentSectionDesc : translations[lang].activePatientBadge}
          </p>
        </div>

        {isEditable && Object.keys(treatments).length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t.confirmClearTreatments)) {
                onChange({});
                handleSelectTooth(null);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg border border-red-150 transition-colors cursor-pointer font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t.resetTreatmentChart}
          </button>
        )}
      </div>

      {/* Arches for treatments */}
      <div className="relative overflow-x-auto pb-4 pt-2">
        <div className="min-w-[760px] flex flex-col gap-6 p-1">
          {/* Upper Arch */}
          <div className="relative">
            <div className={`absolute ${lang === 'fa' ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-slate-450 tracking-wider uppercase`}>
              {lang === 'fa' ? 'فک بالا' : 'UPPER ARCH'}
            </div>
            <div className={`flex items-center justify-between gap-1.5 ${lang === 'fa' ? 'pr-14 pl-2' : 'pl-14 pr-2'}`}>
              {upperTeeth.map(renderTooth)}
            </div>
          </div>

          <div className={`h-[2px] bg-slate-100 border-dashed border-b border-slate-200 relative ${lang === 'fa' ? 'mr-14' : 'ml-14'}`}>
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 bg-slate-50 text-[9px] font-black text-slate-400 font-mono tracking-widest rounded-full uppercase">
              {t.biteMidline}
            </span>
          </div>

          {/* Lower Arch */}
          <div className="relative">
            <div className={`absolute ${lang === 'fa' ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-slate-450 tracking-wider uppercase`}>
              {lang === 'fa' ? 'فک پایین' : 'LOWER ARCH'}
            </div>
            <div className={`flex items-center justify-between gap-1.5 ${lang === 'fa' ? 'pr-14 pl-2' : 'pl-14 pr-2'}`}>
              {lowerTeeth.map(renderTooth)}
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Treatment selection panel for the selected tooth */}
      {selectedTooth !== null && (
        <div className="mt-5 p-5 rounded-xl border border-purple-200 bg-purple-50/15 animate-fade-in" id="treatment-tooth-panel">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-800 text-xs font-bold rounded-lg font-mono">
                  #{selectedTooth}
                </span>
                <span className="text-sm font-bold text-slate-800">{getToothName(selectedTooth)}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                  {t.treatmentLogBadge}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider font-mono">
                {getToothArchName(selectedTooth)}
              </p>
            </div>
            <button
              onClick={() => handleSelectTooth(null)}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 px-3 py-1.5 rounded-lg bg-white border border-purple-150 hover:bg-purple-50 transition-colors cursor-pointer"
            >
              {t.closeToothForm}
            </button>
          </div>

          {isEditable ? (
            <div className="space-y-4">
              {/* Treatment Checkbox Options */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {treatmentKeyConfig.map((item) => {
                  const isChecked = !!(treatments[selectedTooth] || {})[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleToggleTreatment(selectedTooth, item.key)}
                      className={`flex items-start gap-2.5 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        isChecked 
                          ? `${item.bg} ${item.border} ring-1 ring-purple-100 shadow-xs` 
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Swallowed: controlled via button click
                          className="w-4 h-4 text-purple-600 border-slate-350 rounded focus:ring-purple-500 pointer-events-none"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold leading-tight ${item.color}`}>{t.treatmentKeys[item.key]}</div>
                        <div className="text-[10px] text-slate-450 font-medium leading-normal mt-0.5 truncate" title={t.treatmentDescs[item.key]}>
                          {t.treatmentDescs[item.key]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Advanced Case: If Intraoral Scan is selected, show Tooth Color & Color Note options */}
              {!!(treatments[selectedTooth] || {}).intraoralScan && (
                <div className="p-4 rounded-xl border border-pink-250 bg-pink-50/10 space-y-4 animate-slide-up">
                  <div className="flex items-center gap-1.5 text-pink-700 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t.shadeSelectionTitle}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tooth Color dropdown & preset shades */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t.toothColorLabel}</label>
                      <select
                        id={`toothColor-${selectedTooth}`}
                        value={localToothColor || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalToothColor(val);
                          saveActiveText(selectedTooth, 'toothColor', val);
                        }}
                        className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      >
                        <option value="">{t.chooseVitaShade}</option>
                        {popularShades.map(s => (
                          <option key={s} value={s}>{s} Shade</option>
                        ))}
                        <option value="custom">Other Custom Shade...</option>
                      </select>

                      {/* Alternate manual entry if other custom shade is picked, or to write something precise */}
                      {((localToothColor === 'custom' || !popularShades.includes(localToothColor || '')) && localToothColor !== '') && (
                        <input
                          id={`toothColor-manual-${selectedTooth}`}
                          type="text"
                          placeholder="e.g., Bleach 05, Custom gradient..."
                          value={localToothColor === 'custom' ? '' : (localToothColor || '')}
                          onChange={(e) => setLocalToothColor(e.target.value)}
                          onBlur={() => saveActiveText(selectedTooth, 'toothColor', localToothColor)}
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 font-semibold text-slate-750 mt-2 focus:ring-1 focus:ring-pink-400"
                        />
                      )}

                      {/* Fast-tap circular shade presets */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {['A1', 'A2', 'A3', 'B1', 'B2', 'C2'].map(shade => (
                          <button
                            key={shade}
                            type="button"
                            onClick={() => {
                              setLocalToothColor(shade);
                              saveActiveText(selectedTooth, 'toothColor', shade);
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                              localToothColor === shade
                                ? 'bg-pink-100 text-pink-850 border-pink-300'
                                : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200'
                            }`}
                          >
                            {shade}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tooth Color Note */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t.colorNoteLabel}</label>
                      <textarea
                        id={`colorNote-${selectedTooth}`}
                        rows={2}
                        placeholder={t.colorNotePlaceholder}
                        value={localColorNote}
                        onChange={(e) => setLocalColorNote(e.target.value)}
                        onBlur={() => saveActiveText(selectedTooth, 'colorNote', localColorNote)}
                        className="w-full text-xs p-2.5 bg-white rounded-lg border border-slate-200 font-semibold text-slate-750 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Treatment / Appointment Notes section */}
              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1">
                  <ClipboardList className="w-3.5 h-3.5 text-purple-600" />
                  {t.clinicalNotesLabel} #{selectedTooth}
                </label>
                <textarea
                  id={`notes-${selectedTooth}`}
                  rows={2.5}
                  placeholder={t.clinicalNotesPlaceholder}
                  value={localNotes}
                  onChange={(e) => setLocalNotes(e.target.value)}
                  onBlur={() => saveActiveText(selectedTooth, 'notes', localNotes)}
                  className="w-full text-xs p-3 bg-white rounded-lg border border-slate-200 font-semibold text-slate-750 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400"
                />
              </div>

              {/* Save info block */}
              <div className="flex justify-between items-center text-xs text-slate-450 font-semibold">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                  {t.clinicalNotesSynced}
                </div>
                {Object.keys(treatments[selectedTooth] || {}).length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleClearTooth(selectedTooth)}
                    className="text-red-500 hover:underline flex items-center gap-1 font-bold cursor-pointer text-xs"
                  >
                    {t.clearToothTreatments}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Display read-only treatment status */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {treatmentKeyConfig.filter(item => !!(treatments[selectedTooth] || {})[item.key]).map(item => (
                    <span key={item.key} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${item.bg} ${item.color} ${item.border}`}>
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {t.treatmentKeys[item.key]}
                    </span>
                  ))}
                  {Object.keys(treatments[selectedTooth] || {}).filter(k => !['notes', 'toothColor', 'colorNote'].includes(k)).length === 0 && (
                    <span className="text-xs text-slate-400 italic font-semibold">No surgical or restorative operations mapped.</span>
                  )}
                </div>

                {/* Print tooth color if intraoralScan is present */}
                {!!(treatments[selectedTooth] || {}).intraoralScan && (
                  <div className="p-3 bg-pink-25/50 border border-pink-100 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-pink-850">{t.shadeSelectionTitle}</div>
                    <div>
                      <span className="font-bold text-slate-700">{t.toothColorLabel}: </span>
                      <span className="font-semibold text-slate-900 bg-pink-50 border border-pink-150 px-1.5 py-0.5 rounded">
                        {(treatments[selectedTooth] || {}).toothColor || 'N/A'}
                      </span>
                    </div>
                    {/* Tooth Color Note */}
                    {(treatments[selectedTooth] || {}).colorNote && (
                      <div className="mt-1 font-semibold text-slate-600">
                        <span className="font-bold text-slate-700">{t.colorNoteLabel}: </span>
                        {(treatments[selectedTooth] || {}).colorNote}
                      </div>
                    )}
                  </div>
                )}

                {/* Treatment/Appointment notes */}
                {(treatments[selectedTooth] || {}).notes && (
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-xs">
                    <div className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      {t.treatmentNotesLogged}:
                    </div>
                    <p className="text-slate-700 leading-relaxed font-semibold whitespace-pre-line">
                      {(treatments[selectedTooth] || {}).notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend for Treatments */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
          {t.legendTitle}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {treatmentKeyConfig.map((item) => (
            <div key={item.key} className="flex items-center gap-2 text-xs truncate">
              <span className={`w-3.5 h-3.5 rounded border ${item.bg} ${item.border} flex items-center justify-center`}>
                <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
              </span>
              <span className="font-bold text-slate-600">{t.treatmentKeys[item.key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
