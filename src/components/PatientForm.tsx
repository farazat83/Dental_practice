import React, { useState, useEffect } from 'react';
import { Patient, PatientHistory } from '../types';
import { Heart, ShieldAlert, Check, X, Phone, Calendar, User, Save } from 'lucide-react';
import { Language, translations, TranslationDictionary } from '../utils/translations';

interface PatientFormProps {
  patient?: Patient | null;
  onSave: (patient: Partial<Patient>) => void;
  onCancel: () => void;
  lang: Language;
}

const initialHistory: PatientHistory = {
  asthma: false,
  heartDisease: false,
  anticoagulantMeds: false,
  diabetes: false,
  seizuresIssue: false,
  transparent: false,
  pregnancy: false,
};

export default function PatientForm({ patient, onSave, onCancel, lang }: PatientFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfFirstVisit, setDateOfFirstVisit] = useState('');
  const [history, setHistory] = useState<PatientHistory>(initialHistory);

  const t = translations[lang];

  const medicalQuestionsConfig: { key: keyof PatientHistory; labelPath: keyof TranslationDictionary['historyLabels']; descEn: string; descFa: string; warningEn?: string; warningFa?: string }[] = [
    {
      key: 'heartDisease',
      labelPath: 'heartDisease',
      descEn: 'Coronary artery condition, valve issues, or heart attacks history.',
      descFa: 'بیماری عروق کرونر، نارسایی دریچه‌ای یا سابقه سکته‌های حاد قلبی.',
      warningEn: 'Consider adrenaline-free local anesthetics if high risk.',
      warningFa: 'در صورت ریسک بالا استفاده از بی‌حس‌کننده‌های فاقد آدرنالین توصیه می‌شود.'
    },
    {
      key: 'anticoagulantMeds',
      labelPath: 'anticoagulantMeds',
      descEn: 'Using Warfarin, Heparin, or Aspirin daily.',
      descFa: 'مصرف روزانه اسپرین، وارفارین، پلاویکس یا هپارین.',
      warningEn: 'Bleeding risk! Check INR levels prior to extractions/treatments.',
      warningFa: 'خطر خونریزی شدید! بررسی فاکتورهای آزمایشگاهی (INR/PT) قبل از جراحی.'
    },
    {
      key: 'asthma',
      labelPath: 'asthma',
      descEn: 'Requires inhaler accessibility and sedation caution.',
      descFa: 'نیاز به دسترسی سریع به اسپری اسپری برونکودیلاتور در صورت بروز حساسیت.',
    },
    {
      key: 'diabetes',
      labelPath: 'diabetes',
      descEn: 'Slower oral healing times or prone to periodontal abscesses.',
      descFa: 'تاخیر در التیام بافت حفره استخوان دندان و مستعد آبسه‌های لثه.',
    },
    {
      key: 'seizuresIssue',
      labelPath: 'seizuresIssue',
      descEn: 'Susceptible to stress-induced fitting or hyperplastic gums from meds.',
      descFa: 'احتمال بروز تشنج در اثر استرس‌های دندانپزشکی یا هیپرپلازی لثه ناشی از دارو.',
    },
    {
      key: 'transparent',
      labelPath: 'transparent',
      descEn: 'Undergone recent organ transplants, blood transfusions or other immune issues.',
      descFa: 'سابقه انتقال خون، جراحی‌های بزرگ اندام، یا کبد چرب و هپاتیت.',
    },
    {
      key: 'pregnancy',
      labelPath: 'pregnancy',
      descEn: 'If patient is pregnant (requires dental X-ray protection shield).',
      descFa: 'در صورت بارداری بیمار (لزوم محافظت ویژه شکمی و تیروئیدی با آپرون سربی برای تصویربرداری).',
    }
  ];

  useEffect(() => {
    if (patient) {
      setFirstName(patient.firstName);
      setLastName(patient.lastName);
      setDob(patient.dob);
      setPhone(patient.phone);
      setDateOfFirstVisit(patient.dateOfFirstVisit);
      setHistory(patient.history);
    } else {
      setFirstName('');
      setLastName('');
      setDob('');
      setPhone('');
      setDateOfFirstVisit(new Date().toISOString().split('T')[0]);
      setHistory(initialHistory);
    }
  }, [patient]);

  const toggleHistoryItem = (key: keyof PatientHistory) => {
    setHistory(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      alert(lang === 'fa' ? 'نام و نام خانوادگی فامیلی بیمار الزامی است.' : 'First and Family Name are required.');
      return;
    }

    const savedData: Partial<Patient> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob,
      phone,
      dateOfFirstVisit,
      history,
    };

    onSave(savedData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" id="patient-form-modal" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-blue-400" />
              {patient ? t.editPatientTitle : t.addNewPatientTitle}
            </h2>
            <p className="text-slate-400 text-[11px] mt-0.5 font-semibold">
              {lang === 'fa' ? 'لطفاً سابقه فکری بیمار و اطلاعات دموگرافیک وی را با نهایت دقت تکمیل فرمایید.' : 'Ensure accurate demographic and systemic health history mapping.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Modal Content - Scrollable Form */}
        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Demographics */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-3.5 pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
              <span>01</span> {lang === 'fa' ? 'مشخصات دموگرافیک تماس بیمار' : 'Patient Demographics'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t.firstNameLabel} *</label>
                <div className="relative">
                  <User className={`absolute ${lang === 'fa' ? 'right-3' : 'left-3'} top-2.5 w-4 h-4 text-slate-400`} />
                  <input
                    id="patient-form-first-name"
                    type="text"
                    required
                    placeholder={lang === 'fa' ? 'مثلا: فرناز' : 'e.g. Eleanor'}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full ${lang === 'fa' ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white font-bold text-slate-800`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t.lastNameLabel} *</label>
                <div className="relative">
                  <User className={`absolute ${lang === 'fa' ? 'right-3' : 'left-3'} top-2.5 w-4 h-4 text-slate-400`} />
                  <input
                    id="patient-form-last-name"
                    type="text"
                    required
                    placeholder={lang === 'fa' ? 'مثلا: احمدی' : 'e.g. Vance'}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full ${lang === 'fa' ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white font-bold text-slate-800`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t.dobLabel}</label>
                <div className="relative">
                  <Calendar className={`absolute ${lang === 'fa' ? 'right-3' : 'left-3'} top-2.5 w-4 h-4 text-slate-400`} />
                  <input
                    id="patient-form-dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`w-full ${lang === 'fa' ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white font-semibold text-slate-800`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t.phoneLabel}</label>
                <div className="relative">
                  <Phone className={`absolute ${lang === 'fa' ? 'right-3' : 'left-3'} top-2.5 w-4 h-4 text-slate-400`} />
                  <input
                    id="patient-form-phone"
                    type="tel"
                    placeholder={lang === 'fa' ? 'مثلا: ۰۹۱۲۳۴۵۶۷۸۹' : 'e.g. +1 (555) 000-0000'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full ${lang === 'fa' ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white font-semibold text-slate-800 ltr:text-left`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t.firstVisitLabel}</label>
                <div className="relative">
                  <Calendar className={`absolute ${lang === 'fa' ? 'right-3' : 'left-3'} top-2.5 w-4 h-4 text-slate-400`} />
                  <input
                    id="patient-form-first-visit"
                    type="date"
                    value={dateOfFirstVisit}
                    onChange={(e) => setDateOfFirstVisit(e.target.value)}
                    className={`w-full ${lang === 'fa' ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white font-semibold text-slate-800`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Risk */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-3.5 pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
              <span>02</span> {t.systemicHistoryHeader}
            </h3>
            
            <p className="text-[11px] text-slate-500 mb-4 bg-amber-50 rounded-lg p-2.5 border border-amber-100 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="font-semibold text-amber-900 leading-normal">
                {lang === 'fa' 
                  ? 'بررسی سوابق سیستمیک بیمار الزامی است. دایره خطر مربوط هر بیماری برای تدابیر بیهوشی معتبر اهمیت دارد.'
                  : 'Please crosscheck all active illnesses. Any flagged systemic status requires cautious dental anesthesia formulation or clinical premedications.'
                }
              </span>
            </p>

            <div className="space-y-2.5">
              {medicalQuestionsConfig.map((q) => {
                const isSelected = !!history[q.key];
                return (
                  <button
                    key={q.key}
                    type="button"
                    onClick={() => toggleHistoryItem(q.key)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      lang === 'fa' ? 'text-right' : 'text-left'
                    } ${
                      isSelected
                        ? 'bg-red-50/50 border-red-200 ring-1 ring-red-100'
                        : 'bg-slate-50/40 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected 
                          ? 'bg-red-500 border-red-500 text-white shadow-xs' 
                          : 'bg-white border-slate-300 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold ${isSelected ? 'text-red-900' : 'text-slate-850'}`}>
                        {t.historyLabels[q.labelPath]}
                      </div>
                      <div className="text-[11px] text-slate-450 leading-relaxed font-semibold mt-0.5">
                        {lang === 'fa' ? q.descFa : q.descEn}
                      </div>
                      {isSelected && (
                        <div className="text-[10px] uppercase font-bold text-red-600 tracking-wider flex items-center gap-1 mt-1.5">
                          <Heart className="w-3 h-3 text-red-500 animate-pulse fill-red-500 shrink-0" />
                          <span>{lang === 'fa' ? 'توصیه پزشکی: ' : 'Clinical Advisory: '}</span>
                          <span className="font-semibold text-red-705 leading-normal">{lang === 'fa' ? q.warningFa : q.warningEn}</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-150 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-250 bg-white rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer select-none"
            >
              {t.cancelButton}
            </button>
            <button
              type="submit"
              id="save-patient-submit-btn"
              className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-1.5 cursor-pointer select-none"
            >
              <Save className="w-3.5 h-3.5" />
              {patient ? (lang === 'fa' ? 'اعمال ویرایش‌ها' : 'Save Changes') : (lang === 'fa' ? 'ثبت و باز دندان‌پزشکی جدید' : 'Complete Registration')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
