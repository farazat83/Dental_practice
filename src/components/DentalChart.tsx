import React, { useState } from 'react';
import { ToothCondition } from '../types';
import { ShieldCheck, Trash2 } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface DentalChartProps {
  chart: Record<number, ToothCondition[]>;
  onChange: (chart: Record<number, ToothCondition[]>) => void;
  isEditable?: boolean;
  lang: Language;
}

export default function DentalChart({ chart, onChange, isEditable = true, lang }: DentalChartProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const t = translations[lang];

  const conditionConfig: Record<ToothCondition, { label: string; color: string; bg: string; border: string; desc: string }> = {
    caries: {
      label: t.conditionLabels.caries,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-400',
      desc: lang === 'fa' ? 'پوسیدگی فعال یا حفره دندانی نیازمند ترمیم' : 'Active cavity or infectious decay'
    },
    movability: {
      label: t.conditionLabels.movability,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-400',
      desc: lang === 'fa' ? 'شلی دندان یا ضعف بافت پریودنتال نگهدارنده' : 'Tooth looseness or periodontal weakness'
    },
    fracture: {
      label: t.conditionLabels.fracture,
      color: 'text-fuchsia-600',
      bg: 'bg-fuchsia-50',
      border: 'border-fuchsia-400',
      desc: lang === 'fa' ? 'ترک دندانی، شکستگی ناشی از تروما یا فشار' : 'Crack or structural tooth fracture'
    },
    crown: {
      label: t.conditionLabels.crown,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-400',
      desc: lang === 'fa' ? 'روکش مصنوعی نصب شده بر دندان از پیش' : 'Artificial dental crown restoration'
    },
    implant: {
      label: t.conditionLabels.implant,
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      border: 'border-slate-400',
      desc: lang === 'fa' ? 'فیکسچر پروتز به همراه فیسکر ایمپلنت لثه‌ای' : 'Dental implant post & crown'
    },
    missing: {
      label: t.conditionLabels.missing,
      color: 'text-zinc-650',
      bg: 'bg-zinc-50',
      border: 'border-zinc-300',
      desc: lang === 'fa' ? 'جای خالی دندان، از قبل کشیده شده یا مادرزادی' : 'Missing tooth or extraction'
    }
  };

  // Upper teeth in FDI/FDA (Quadrant 1: 18-11, Quadrant 2: 21-28)
  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  // Lower teeth in FDI/FDA (Quadrant 4: 48-41, Quadrant 3: 31-38)
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const handleToggleCondition = (toothNum: number, condition: ToothCondition) => {
    if (!isEditable) return;
    const currentConditions = chart[toothNum] || [];
    let updated: ToothCondition[];

    if (condition === 'missing') {
      if (currentConditions.includes('missing')) {
        updated = [];
      } else {
        updated = ['missing'];
      }
    } else if (condition === 'implant') {
      if (currentConditions.includes('implant')) {
        updated = [];
      } else {
        updated = ['implant'];
      }
    } else {
      const basicConditions = currentConditions.filter(c => c !== 'missing' && c !== 'implant');
      if (basicConditions.includes(condition)) {
        updated = basicConditions.filter(c => c !== condition);
      } else {
        updated = [...basicConditions, condition];
      }
    }

    const newChart = { ...chart };
    if (updated.length === 0) {
      delete newChart[toothNum];
    } else {
      newChart[toothNum] = updated;
    }
    onChange(newChart);
  };

  const handleClearTooth = (toothNum: number) => {
    if (!isEditable) return;
    const newChart = { ...chart };
    delete newChart[toothNum];
    onChange(newChart);
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
    const conditions = chart[num] || [];
    const isSelected = selectedTooth === num;
    const isMissing = conditions.includes('missing');
    const isImplant = conditions.includes('implant');
    const isCrown = conditions.includes('crown');
    const hasCaries = conditions.includes('caries');
    const hasFracture = conditions.includes('fracture');
    const hasMovability = conditions.includes('movability');

    let toothBg = 'bg-white hover:bg-slate-50';
    let borderStyle = 'border-slate-200';
    let ringColor = '';

    if (isMissing) {
      toothBg = 'bg-slate-100 opacity-40';
      borderStyle = 'border-dashed border-slate-350';
    } else if (isImplant) {
      toothBg = 'bg-slate-200';
      borderStyle = 'border-slate-500 border-2';
    } else {
      if (hasCaries) {
        toothBg = 'bg-red-50';
        borderStyle = 'border-red-405 border-2';
        ringColor = 'ring-1 ring-red-300';
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

    if (isSelected) {
      borderStyle = 'border-blue-500 ring-2 ring-blue-400 border-2 scale-105';
    }

    return (
      <button
        key={num}
        id={`tooth-btn-${num}`}
        type="button"
        onClick={() => setSelectedTooth(selectedTooth === num ? null : num)}
        className={`relative flex flex-col items-center justify-between p-1.5 rounded-lg shadow-xs transition-all cursor-pointer h-20 min-w-[42px] select-none ${toothBg} ${borderStyle} ${ringColor}`}
      >
        <span className="text-[10px] font-mono font-bold text-slate-500">{num}</span>

        <div className="relative w-full flex-grow flex items-center justify-center">
          {isMissing ? (
            <div className="text-zinc-500 relative flex items-center justify-center w-full h-full">
              <svg className="w-5 h-5 absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </div>
          ) : isImplant ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ contentVisibility: 'auto' }}>
              <div className="w-4 h-5 border border-slate-600 bg-slate-300 rounded-lg flex flex-col justify-between items-center overflow-hidden">
                <div className="w-full h-1 bg-slate-500" />
                <div className="w-full h-[1px] bg-slate-600" />
                <div className="w-full h-[1px] bg-slate-400" />
              </div>
              <div className="w-2 h-2 bg-slate-600 rounded-sm -mt-[2px]" />
            </div>
          ) : (
            <div className="relative w-7 h-10 flex flex-col items-center justify-center" style={{ contentVisibility: 'auto' }}>
              <svg className="w-6 h-8 text-slate-300" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.5 5.5 C2.5 1.5, 21.5 1.5, 21.5 5.5 C21.5 9.5, 19.5 17.5, 17.5 21.5 C16.5 23.5, 15.5 31.5, 14 31.5 C12.5 31.5, 12.5 23.5, 12 23.5 C11.5 23.5, 11.5 31.5, 10 31.5 C8.5 31.5, 7.5 23.5, 6.5 21.5 C4.5 17.5, 2.5 9.5, 2.5 5.5 Z"
                  fill={isCrown ? '#ccfbf1' : '#ffffff'}
                  stroke={isCrown ? '#0d9488' : '#cbd5e1'}
                  strokeWidth="1.5"
                />
                {hasCaries && (
                  <circle cx="12" cy="11" r="3.5" fill="#dc2626" className="animate-pulse" />
                )}
                {hasFracture && (
                  <path d="M4 6 L12 11 L16 8" stroke="#d946ef" strokeWidth="2.2" strokeLinecap="round" />
                )}
              </svg>
              {hasMovability && (
                <div className="absolute bottom-0 w-full flex justify-center space-x-[2px] mb-[-4px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 border border-white" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 border border-white" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-[2px] min-h-[8px] w-full mt-0.5 overflow-hidden">
          {conditions.slice(0, 3).map((c, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                c === 'caries' ? 'bg-red-500' :
                c === 'movability' ? 'bg-amber-500' :
                c === 'fracture' ? 'bg-fuchsia-500' :
                c === 'crown' ? 'bg-teal-500' :
                c === 'implant' ? 'bg-slate-600' :
                'bg-zinc-400'
              }`}
              title={conditionConfig[c].label}
            />
          ))}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-150 p-5 select-none" id="dental-chart-component" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-4 bg-blue-500 rounded-sm"></span>
            {t.dentalConditionsHeader}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-semibold">
            {isEditable 
              ? (lang === 'fa' ? 'روی یک دندان کلیک کنید تا پوسیدگی، روکش، شکستگی، لقی یا ایمپلنت را ثبت و ویرایش کنید.' : 'Tap a tooth to view details or log decay, crowns, fractures, loose teeth, or implants.')
              : (lang === 'fa' ? 'نمودار دندانی و آنومالی های ثبت شده بیمار' : 'Teeth status view.')
            }
          </p>
        </div>
        
        {isEditable && Object.keys(chart).length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(lang === 'fa' ? 'آیا از پاکسازی کامل تمام شرایط ثبت‌شده دندان‌ها اطمینان دارید؟' : 'Are you sure you want to clear all marked tooth statuses for this patient?')) {
                onChange({});
                setSelectedTooth(null);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg border border-red-150 transition-colors cursor-pointer font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {lang === 'fa' ? 'پاکسازی نمودار دندانی' : 'Reset Chart'}
          </button>
        )}
      </div>

      {/* Interactive Arches Layout */}
      <div className="relative overflow-x-auto pb-4 pt-2">
        <div className="min-w-[760px] flex flex-col gap-6 p-1">
          {/* Maxillary Upper Arch */}
          <div className="relative">
            <div className={`absolute ${lang === 'fa' ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-slate-450 tracking-wider uppercase`}>
              {lang === 'fa' ? 'فک بالا' : 'UPPER ARCH'}
            </div>
            <div className={`flex items-center justify-between gap-1.5 ${lang === 'fa' ? 'pr-14 pl-2' : 'pl-14 pr-2'}`}>
              {upperTeeth.map(renderTooth)}
            </div>
          </div>

          {/* Symmetrical divider line representing patient bite alignment */}
          <div className={`h-[2px] bg-slate-100 border-dashed border-b border-slate-200 relative ${lang === 'fa' ? 'mr-14' : 'ml-14'}`}>
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 bg-slate-50 text-[9px] font-black text-slate-450 font-mono tracking-widest rounded-full uppercase">
              {t.biteMidline}
            </span>
          </div>

          {/* Mandibular Lower Arch */}
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

      {/* Detailed Edit Panel for the Selected Tooth */}
      {selectedTooth !== null && (
        <div className="mt-5 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 animate-fade-in" id="tooth-editor-pannel">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg font-mono">
                  #{selectedTooth}
                </span>
                <span className="text-sm font-bold text-slate-800">{getToothName(selectedTooth)}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-450 mt-1 uppercase tracking-wider font-mono">
                {getToothArchName(selectedTooth)}
              </p>
            </div>
            <button
              onClick={() => setSelectedTooth(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {lang === 'fa' ? 'بستن پنل' : 'Close Panel'}
            </button>
          </div>

          {isEditable ? (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(Object.keys(conditionConfig) as ToothCondition[]).map((cond) => {
                  const isChecked = (chart[selectedTooth] || []).includes(cond);
                  const cfg = conditionConfig[cond];
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => handleToggleCondition(selectedTooth, cond)}
                      className={`flex items-start gap-2.5 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        isChecked 
                          ? `${cfg.bg} ${cfg.border} ring-1 ring-blue-105` 
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5">
                        <input
                          id={`cond-chk-${cond}`}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Controlled click on button handle
                          className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500 pointer-events-none"
                        />
                      </div>
                      <div className="flex-1">
                        <div className={`text-xs font-bold leading-tight ${cfg.color}`}>{cfg.label}</div>
                        <div className="text-[10px] text-slate-450 font-medium leading-normal mt-0.5">{cfg.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-between items-center text-xs text-slate-450 font-semibold">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  {lang === 'fa' ? 'تغییرات به صورت آنی در دستگاه ذخیره می‌شوند.' : 'No manual save needed — records persist on device instantly.'}
                </div>
                {(chart[selectedTooth] || []).length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleClearTooth(selectedTooth)}
                    className="text-red-500 hover:underline flex items-center gap-1 font-bold cursor-pointer text-xs"
                  >
                    {lang === 'fa' ? 'پاک کردن وضعیت دندان' : 'Clear Tooth Status'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              {(chart[selectedTooth] || []).length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {(chart[selectedTooth] || []).map((cond) => {
                    const cfg = conditionConfig[cond];
                    return (
                      <span key={cond} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        <div className={`w-2 h-2 rounded-full ${cond === 'caries' ? 'bg-red-500' : 'bg-current'}`} />
                        {cfg.label}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic pb-1">
                  {lang === 'fa' ? 'دندان در وضعیت کاملا سالم است.' : 'This tooth is marked healthy with no specific conditions.'}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Legend Grid Display */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
          {t.legendTitle}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.keys(conditionConfig) as ToothCondition[]).map((cond) => {
            const cfg = conditionConfig[cond];
            return (
              <div key={cond} className="flex items-center gap-2 text-xs truncate">
                <span className={`w-3.5 h-3.5 rounded border ${cfg.bg} ${cfg.border} flex items-center justify-center`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    cond === 'caries' ? 'bg-red-500' :
                    cond === 'movability' ? 'bg-amber-500' :
                    cond === 'fracture' ? 'bg-fuchsia-500' :
                    cond === 'crown' ? 'bg-teal-500' :
                    cond === 'implant' ? 'bg-slate-600' :
                    'bg-zinc-400'
                  }`} />
                </span>
                <span className="font-bold text-slate-600">{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
