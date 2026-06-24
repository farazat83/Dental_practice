import React, { useState } from 'react';
import { Appointment } from '../types';
import { Calendar, Clock, Plus, Edit, Trash2, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface AppointmentsSectionProps {
  appointments: Appointment[];
  onChange: (appointments: Appointment[]) => void;
  lang: Language;
}

export default function AppointmentsSection({ appointments, onChange, lang }: AppointmentsSectionProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'future' | 'past'>('current');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const t = translations[lang];

  // Form Fields
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const currentApts = appointments.filter(apt => apt.date === todayStr);
  const futureApts = appointments.filter(apt => apt.date > todayStr).sort((a,b) => a.date.localeCompare(b.date));
  const pastApts = appointments.filter(apt => apt.date < todayStr).sort((a,b) => b.date.localeCompare(a.date));

  const handleStartAdd = () => {
    setDate(todayStr);
    setTime('10:00');
    setNotes('');
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (apt: Appointment) => {
    setEditingId(apt.id);
    setDate(apt.date);
    setTime(apt.time || '');
    setNotes(apt.notes);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const confirmMsg = lang === 'fa' 
      ? 'آیا برای حذف این قرار ملاقات اطمینان دارید؟' 
      : 'Are you sure you want to delete this appointment?';
    if (window.confirm(confirmMsg)) {
      const updated = appointments.filter(apt => apt.id !== id);
      onChange(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    if (editingId) {
      const updated = appointments.map(apt => {
        if (apt.id === editingId) {
          return { ...apt, date, time, notes };
        }
        return apt;
      });
      onChange(updated);
      setEditingId(null);
    } else {
      const newApt: Appointment = {
        id: `apt-${Date.now()}`,
        date,
        time,
        notes
      };
      onChange([...appointments, newApt]);
      setIsAdding(false);
    }

    setDate('');
    setTime('');
    setNotes('');
  };

  const formatFriendlyDate = (dateVal: string) => {
    if (!dateVal) return '';
    try {
      const parts = dateVal.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      return dateVal;
    } catch {
      return dateVal;
    }
  };

  const getActiveList = () => {
    switch (activeTab) {
      case 'current': return currentApts;
      case 'future': return futureApts;
      case 'past': return pastApts;
    }
  };

  const activeApts = getActiveList();

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-150 p-5 mt-5" id="appointments-section" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-4 bg-blue-500 rounded-sm"></span>
            {t.sessionLogsTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-semibold">
            {lang === 'fa' ? 'سوابق جلسات، نسخه‌ها، ترمیم دندان‌ها و داروهای بیمار را در جدول زیر دنبال کنید.' : 'Log medical status, dental chart additions, treatments, and descriptions here.'}
          </p>
        </div>

        {!isAdding && !editingId && (
          <button
            type="button"
            id="add-apt-btn"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-xs transition-transform hover:-translate-y-0.5 shadow-sm cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5" />
            {lang === 'fa' ? 'ثبت ویزیت جدید' : 'Schedule Visit'}
          </button>
        )}
      </div>

      {/* Form Editor Panel (Inline create / edit) */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 animate-slide-up">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {editingId 
                ? (lang === 'fa' ? 'اصلاح یادداشت جلسه معتبر' : 'Edit Appointment Note') 
                : (lang === 'fa' ? 'ثبت قرار ملاقات دندان‌پزشکی جدید' : 'Log New Dental Appointment')
              }
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {t.cancelButton}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                {lang === 'fa' ? 'تاریخ مراجعه *' : 'Appointment Date *'}
              </label>
              <div className="relative">
                <Calendar className={`absolute ${lang === 'fa' ? 'right-2.5' : 'left-2.5'} top-2.5 w-4 h-4 text-slate-450`} />
                <input
                  id="apt-form-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full ${lang === 'fa' ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white font-semibold`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                {lang === 'fa' ? 'زمان ویزیت (اختیاری)' : 'Time (Optional)'}
              </label>
              <div className="relative">
                <Clock className={`absolute ${lang === 'fa' ? 'right-2.5' : 'left-2.5'} top-2.5 w-4 h-4 text-slate-455`} />
                <input
                  id="apt-form-time"
                  type="text"
                  placeholder="10:00"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`w-full ${lang === 'fa' ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white font-semibold`}
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              {lang === 'fa' ? 'توضیحات و اقدامات تفصیلی *' : 'Session Description / Clinical Notes *'}
            </label>
            <textarea
              id="apt-form-notes"
              rows={4}
              required
              placeholder={t.sessionPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 text-xs border border-slate-200 rounded-lg outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-white leading-relaxed resize-none font-semibold text-slate-750"
            />
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-3.5 py-1.5 border border-slate-250 bg-white rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer"
            >
              {lang === 'fa' ? 'لغو اصلاحات' : 'Discard'}
            </button>
            <button
              type="submit"
              id="save-apt-btn"
              className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              {editingId ? (lang === 'fa' ? 'ذخیره لاگ' : 'Save Comments') : t.saveButton}
            </button>
          </div>
        </form>
      )}

      {/* Appointment Categorized Tab Bar */}
      <div className="flex border-b border-slate-100 mb-4 bg-slate-50 p-1.5 rounded-lg select-none">
        <button
          type="button"
          onClick={() => setActiveTab('current')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
            activeTab === 'current'
              ? 'bg-white text-blue-900 shadow-xs border border-slate-150'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-orange-500" />
          {lang === 'fa' ? 'طرح ویزیت امروز' : "Today's Views"}
          {currentApts.length > 0 && (
            <span className="mr-1 ml-1 w-5 h-5 bg-orange-100 text-orange-850 text-[10px] rounded-full flex items-center justify-center font-black">
              {currentApts.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('future')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
            activeTab === 'future'
              ? 'bg-white text-blue-900 shadow-xs border border-slate-150'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-blue-500" />
          {lang === 'fa' ? 'مراجعات بعدی' : 'Upcoming Visits'}
          {futureApts.length > 0 && (
            <span className="mr-1 ml-1 w-5 h-5 bg-blue-100 text-blue-800 text-[10px] rounded-full flex items-center justify-center font-black">
              {futureApts.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
            activeTab === 'past'
              ? 'bg-white text-blue-900 shadow-xs border border-slate-150'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          {lang === 'fa' ? 'تاریخچه قبلی' : 'Past History'}
          {pastApts.length > 0 && (
            <span className="mr-1 ml-1 w-5 h-5 bg-slate-200 text-slate-705 text-[10px] rounded-full flex items-center justify-center font-black">
              {pastApts.length}
            </span>
          )}
        </button>
      </div>

      {/* Appointment Cards Display */}
      {activeApts.length > 0 ? (
        <div className="space-y-3">
          {activeApts.map((apt) => (
            <div
              key={apt.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white shadow-xs group"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2.5 pb-2 border-b border-dashed border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    activeTab === 'current' ? 'bg-orange-500' :
                    activeTab === 'future' ? 'bg-blue-500' : 'bg-slate-400'
                  }`} />
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    {formatFriendlyDate(apt.date)}
                  </span>
                  {apt.time && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md font-bold">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {apt.time}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-85 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(apt)}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                    title={lang === 'fa' ? 'ویرایش یادداشت' : 'Edit Note'}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(apt.id)}
                    className="p-1.5 hover:bg-red-50 text-slate-450 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    title={lang === 'fa' ? 'حذف سابقه' : 'Delete Record'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Note description with high-quality layout */}
              <div className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/40 p-3 rounded-lg border border-slate-100 font-semibold">
                <FileText className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <div className="flex-1 text-slate-705">{apt.notes}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-25/50 rounded-xl border border-dashed border-slate-200">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-550">
            {lang === 'fa' ? 'در این گروه‌بندی هیچ معاینه یا نوبت ویزیتی ثبت نشده است' : 'No appointments recorded in this category'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {activeTab === 'current' ? (lang === 'fa' ? 'برای تعریف نوبت امروز دکمه ثبت ویزیت جدید بالا را فشار دهید.' : 'Plan a treatment for today or click "Schedule Visit".') :
             activeTab === 'future' ? (lang === 'fa' ? 'آزمایش‌ها یا کاشت ایمپلنت‌های آینده را در سامانه زمان‌بندی کنید.' : 'Plan future consultations to visualize patient recovery.') :
             (lang === 'fa' ? 'سوابق تکمیل شده مراجعات بیمار در جدول زیر نمایش داده خواهند شد.' : 'Completed checkup sessions appear here.')}
          </p>
          {activeTab === 'current' && (
            <button
              onClick={handleStartAdd}
              type="button"
              className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-150 rounded-lg hover:bg-blue-105 cursor-pointer select-none"
            >
              {lang === 'fa' ? 'افزودن ویزیت امروز' : 'Log Visit'}
              <ArrowRight className={`w-3.5 h-3.5 ${lang === 'fa' ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
