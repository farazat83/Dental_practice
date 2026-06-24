export type Language = 'en' | 'fa';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  searchPlaceholder: string;
  registerPatient: string;
  importDb: string;
  backupDb: string;
  patientLogs: string;
  activeStatus: string;
  noPatientsFound: string;
  noPatientsFoundDesc: string;
  dbSavedLocally: string;
  backToList: string;
  criticalSystemicFlags: string;
  activePatientBadge: string;
  dobLabel: string;
  ageLabel: string;
  patientIdLabel: string;
  exportPdf: string;
  editProfile: string;
  deleteProfile: string;
  contactHeader: string;
  phoneLabel: string;
  firstVisitLabel: string;
  systemicHistoryHeader: string;
  riskFactorNotes: string;
  noSelectedPatientTitle: string;
  noSelectedPatientDesc: string;
  yesState: string;
  noState: string;
  saveButton: string;
  cancelButton: string;
  genderLabel: string;
  historyLabels: {
    asthma: string;
    heartDisease: string;
    anticoagulantMeds: string;
    diabetes: string;
    seizuresIssue: string;
    transparent: string;
    pregnancy: string;
  };
  conditionLabels: {
    caries: string;
    movability: string;
    fracture: string;
    crown: string;
    implant: string;
    missing: string;
  };
  treatmentKeys: {
    extraction: string;
    surgicalExtraction: string;
    crownPrep: string;
    inlayPrep: string;
    onlayPrep: string;
    rct: string;
    postAndCore: string;
    fillingClassII: string;
    gingivalLift: string;
    sinusLift: string;
    boneAugmentation: string;
    sutures: string;
    implantRemoval: string;
    oldCrownBridgeRemoval: string;
    onlyCementation: string;
    implant: string;
    intraoralScan: string;
    ct: string;
  };
  treatmentDescs: {
    extraction: string;
    surgicalExtraction: string;
    crownPrep: string;
    inlayPrep: string;
    onlayPrep: string;
    rct: string;
    postAndCore: string;
    fillingClassII: string;
    gingivalLift: string;
    sinusLift: string;
    boneAugmentation: string;
    sutures: string;
    implantRemoval: string;
    oldCrownBridgeRemoval: string;
    onlyCementation: string;
    implant: string;
    intraoralScan: string;
    ct: string;
  };
  treatmentSectionTitle: string;
  treatmentSectionDesc: string;
  resetTreatmentChart: string;
  upperArch: string;
  lowerArch: string;
  biteMidline: string;
  treatmentLogBadge: string;
  closeToothForm: string;
  shadeSelectionTitle: string;
  toothColorLabel: string;
  chooseVitaShade: string;
  colorNoteLabel: string;
  colorNotePlaceholder: string;
  clinicalNotesLabel: string;
  clinicalNotesPlaceholder: string;
  clinicalNotesSynced: string;
  clearToothTreatments: string;
  legendTitle: string;
  yearsSuffix: string;
  noPhone: string;
  noDate: string;
  confirmClearTreatments: string;
  confirmDeletePatient: string;
  // Patient Form
  addNewPatientTitle: string;
  editPatientTitle: string;
  firstNameLabel: string;
  lastNameLabel: string;
  middleNameLabel?: string;
  // Print components
  reportTitle: string;
  clinicTitle: string;
  practitionerTitle: string;
  dateGenerated: string;
  clinicalSummary: string;
  medicalClearanceAlert: string;
  recommendations: string;
  signatureLine: string;
  officialStamp: string;
  toothCol: string;
  archCol: string;
  operationsCol: string;
  noTreatmentsRecorded: string;
  sessionLogsTitle: string;
  addSessionLogBtn: string;
  sessionNotesLabel: string;
  sessionPlaceholder: string;
  treatmentNotesLogged: string;
  historyConcernsHeader: string;
  medicalAdvisoryNotes: string;
  dentalConditionsHeader: string;
  activeTreatmentsHeader: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "EliDent Portal",
    tagline: "Orthosurg & Restorative Dental Record Systems",
    searchPlaceholder: "Search patient file by name or phone...",
    registerPatient: "Register Patient",
    importDb: "Import File",
    backupDb: "Backup DB",
    patientLogs: "Patient Logs",
    activeStatus: "Active",
    noPatientsFound: "No patients found",
    noPatientsFoundDesc: "Refine your active filters or register a new patient file above.",
    dbSavedLocally: "Database Saved Locally on Device File",
    backToList: "← Back to Patient List",
    criticalSystemicFlags: "CRITICAL SYSTEMIC FLAGS: This patient file has active systemic risks. Consult medical advisory suggestions below.",
    activePatientBadge: "Active Patient",
    dobLabel: "DOB",
    ageLabel: "Age",
    patientIdLabel: "Patient ID",
    exportPdf: "Export PDF",
    editProfile: "Edit Profile",
    deleteProfile: "Delete Profile",
    contactHeader: "Patient Contact",
    phoneLabel: "Phone Number",
    firstVisitLabel: "First Visit",
    systemicHistoryHeader: "Systemic Medical History",
    riskFactorNotes: "Risk Factors & Diagnostics Warnings",
    noSelectedPatientTitle: "No Patient Selected",
    noSelectedPatientDesc: "Select an existing clinical file from the sidebar registry or create a new file file to view full clinical charting and history logs.",
    yesState: "Yes",
    noState: "No",
    saveButton: "Save Records",
    cancelButton: "Cancel",
    genderLabel: "Gender",
    historyLabels: {
      asthma: "Asthma & Pulmonary Sensitivity",
      heartDisease: "Ischemic Heart Disease / Cardio risk",
      anticoagulantMeds: "Anticoagulant Drugs (Bleeding Hazard)",
      diabetes: "Diabetes Mellitus (Healing Delay)",
      seizuresIssue: "Epilepsy / Seizure Susceptibility",
      transparent: "Blood Transfusion Hazards / Hepatitis",
      pregnancy: "Pregnancy / Radiation caution"
    },
    conditionLabels: {
      caries: "Caries / Decay",
      movability: "Mobility (Gr. I-III)",
      fracture: "Fractured / Trauma",
      crown: "Existing Crown",
      implant: "Existing Implant",
      missing: "Missing tooth"
    },
    treatmentKeys: {
      extraction: "Extraction",
      surgicalExtraction: "Surgical Extraction",
      crownPrep: "Crown prep.",
      inlayPrep: "Inlay prep.",
      onlayPrep: "Onlay prep.",
      rct: "RCT",
      postAndCore: "Post and core",
      fillingClassII: "Filling class II",
      gingivalLift: "Gingival lift",
      sinusLift: "Sinus lift",
      boneAugmentation: "Bone augmentation",
      sutures: "Sutures",
      implantRemoval: "Implant removal",
      oldCrownBridgeRemoval: "Old crown/bridge removal",
      onlyCementation: "Only cementation",
      implant: "Implant Restor.",
      intraoralScan: "Intraoral Scan",
      ct: "CT (3D Imaging)"
    },
    treatmentDescs: {
      extraction: "Routine tooth removal",
      surgicalExtraction: "Complex surgical tooth removal",
      crownPrep: "Preparation for permanent crown coverage",
      inlayPrep: "Preparation for porcelain inlay",
      onlayPrep: "Preparation for cuspal onlay restoration",
      rct: "Root Canal Treatment of the internal pulpal canal",
      postAndCore: "Canal post and composite core build-up",
      fillingClassII: "Class II interproximal composite restoration",
      gingivalLift: "Cosmetic or functional gingivectomy/gingival lift",
      sinusLift: "Maxillary sinus membrane floor elevation/bone graft",
      boneAugmentation: "Ridge augmentation or socket preservation",
      sutures: "Clinical suturing of surgical flaps",
      implantRemoval: "Surgical explantation of failed implant fixture",
      oldCrownBridgeRemoval: "De-bonding/cutting old failed crown or bridge",
      onlyCementation: "Re-cementing loose crown or provisional restoration",
      implant: "Surgical implant fixture mapping",
      intraoralScan: "3D Digital visual impressions",
      ct: "Cone-Beam Volumetric Imaging scan"
    },
    treatmentSectionTitle: "Ongoing Treatment Plan & Dental Chart",
    treatmentSectionDesc: "Tap a tooth in this chart to log ongoing extractions, preps, RCTs, grafts, implants, scanning details, or CTs.",
    resetTreatmentChart: "Reset Treatment Chart",
    upperArch: "UPPER ARCHE",
    lowerArch: "LOWER ARCHE",
    biteMidline: "Bite Midline",
    treatmentLogBadge: "Ongoing Restorations",
    closeToothForm: "Close Tooth Form",
    shadeSelectionTitle: "Intraoral Scan - Shade Selection & Details",
    toothColorLabel: "Tooth Color / Shade Option",
    chooseVitaShade: "-- Choose VITA Classic Shade --",
    colorNoteLabel: "Tooth Color & Prep Note",
    colorNotePlaceholder: "e.g. Neck of tooth is deeper A3, incisal half is A2...",
    clinicalNotesLabel: "Clinical & Appointment Notes for Selected Tooth",
    clinicalNotesPlaceholder: "Record treatment stages, materials used, patient comfort levels, or scheduling timeline for this tooth's sessions...",
    clinicalNotesSynced: "Clinical logs are synced instantly. No manual saving needed.",
    clearToothTreatments: "Clear All Treatments for Tooth",
    legendTitle: "Ongoing Treatments (Legend)",
    yearsSuffix: "years",
    noPhone: "No phone recorded",
    noDate: "None",
    confirmClearTreatments: "Are you absolutely sure you want to clear all marked ongoing treatment operations for this patient?",
    confirmDeletePatient: "Are you absolutely sure you want to permanently delete this patient record?",
    addNewPatientTitle: "Register New Patient Record",
    editPatientTitle: "Update Patient Profile Details",
    firstNameLabel: "First Name",
    lastNameLabel: "Last Name",
    reportTitle: "COMPREHENSIVE CLINICAL PATIENT REPORT",
    clinicTitle: "Elite Dental & Implant Clinic",
    practitionerTitle: "Senior Dental Surgeon & Prosthodontist",
    dateGenerated: "Date Generated",
    clinicalSummary: "CLINICAL STATUS SUMMARY REPORT",
    medicalClearanceAlert: "CRITICAL SYSTEMIC ALERTS - CLINICAL COMPLIANCE CONCERNS DETECTED",
    recommendations: "OPERATIONAL MEDICAL CLEARANCE RECOMMENDATIONS",
    signatureLine: "Senior Clinician Signature & ID License",
    officialStamp: "OFFICIAL MEDICAL RECORD EMBLEM STAMP",
    toothCol: "Tooth",
    archCol: "Clinical Arch Location",
    operationsCol: "Ongoing Operations & Shade Selection",
    noTreatmentsRecorded: "No active/ongoing extractions, grafts, implants, scanning details, or CTs recorded in current treatment plan.",
    sessionLogsTitle: "Session Logs & Appointment Directives",
    addSessionLogBtn: "Add Appointment Session",
    sessionNotesLabel: "Appointment Session Commentary & Directives",
    sessionPlaceholder: "Record clinical comments, prescription details, next steps, and specific treatment logs...",
    treatmentNotesLogged: "Treatment Notes Logged",
    historyConcernsHeader: "Systemic Medical Concerns Identified",
    medicalAdvisoryNotes: "Clinical Medical Advisory Remarks",
    dentalConditionsHeader: "Identified Dental Anomalies (Dental Chart)",
    activeTreatmentsHeader: "Ongoing Active Treatment Mapping"
  },
  fa: {
    appName: "پورتال الی‌دنت",
    tagline: "سامانه پرونده‌های دندان‌پزشکی، جراحی و ترمیمی",
    searchPlaceholder: "جستجوی پرونده بیمار با نام یا شماره تلفن...",
    registerPatient: "ثبت نام بیمار جدید",
    importDb: "ورود فایل داده",
    backupDb: "پشتیبان‌گیری",
    patientLogs: "پرونده بیماران",
    activeStatus: "فعال",
    noPatientsFound: "بیماری یافت نشد",
    noPatientsFoundDesc: "فیلترها را تغییر دهید یا اطلاعات بیمار جدید را وارد نمایید.",
    dbSavedLocally: "پایگاه داده به‌صورت محلی روی دستگاه ذخیره شد",
    backToList: "← بازگشت به لیست بیماران",
    criticalSystemicFlags: "هشدار حساس پزشکی: این بیمار دارای بیماری زمینه‌ای یا ریسک سیستماتیک فعال است. به توصیه‌های زیر توجه فرمایید.",
    activePatientBadge: "بیمار فعال",
    dobLabel: "تاریخ تولد",
    ageLabel: "سن",
    patientIdLabel: "شناسه بیمار",
    exportPdf: "خروجی PDF",
    editProfile: "ویرایش پرونده",
    deleteProfile: "حذف پرونده",
    contactHeader: "اطلاعات تماس بیمار",
    phoneLabel: "شماره تلفن",
    firstVisitLabel: "تاریخ اولین مراجعه",
    systemicHistoryHeader: "سابقه پزشکی سیستماتیک (بیماری زمینه‌ای)",
    riskFactorNotes: "عوامل خطر و هشدارهای تشخیصی",
    noSelectedPatientTitle: "بیمار انتخاب نشده است",
    noSelectedPatientDesc: "برای مشاهده نمودار دندانی و سوابق درمان، دندان دندان یا فایلی را از پنل کناری انتخاب کنید یا بیمار جدید ثبت کنید.",
    yesState: "بله",
    noState: "خیر",
    saveButton: "ذخیره تغییرات",
    cancelButton: "انصراف",
    genderLabel: "جنسیت",
    historyLabels: {
      asthma: "آسم و حساسیت‌های ریوی",
      heartDisease: "بیماری‌های قلبی عروقی / ایسکمیک",
      anticoagulantMeds: "مصرف داروهای ضد انعقاد خون (خطر خونریزی)",
      diabetes: "دیابت شیرین (تاخیر در بهبود زخم‌ها)",
      seizuresIssue: "صرع / استعداد تشنج و غش",
      transparent: "سابقه انتقال خون / ریسک هپاتیت",
      pregnancy: "بارداری / لزوم احتیاط در تصویربرداری"
    },
    conditionLabels: {
      caries: "پوسیدگی دندانی",
      movability: "لقی دندان (درجه ۱ تا ۳)",
      fracture: "شکستگی / تروما دندان",
      crown: "روکش دندانی از قبل",
      implant: "ایمپلنت از قبل",
      missing: "خالی / کشیده شده"
    },
    treatmentKeys: {
      extraction: "کشیدن دندان (معمولی)",
      surgicalExtraction: "جراحی کشیدن دندان",
      crownPrep: "تراش روکش",
      inlayPrep: "تراش ایندی",
      onlayPrep: "تراش آنلی",
      rct: "عصب‌کشی (RCT)",
      postAndCore: "پست و کور دندان (قالب‌گیری/کومپوزیت)",
      fillingClassII: "ترمیم کلاس ۲ (کومپوزیت/آمالگام)",
      gingivalLift: "لیفت لثه (جراحی زیبایی یا کاربردی)",
      sinusLift: "لیفت سینوس (پودر استخوان و بالابری غشا)",
      boneAugmentation: "بازسازی استخوان (پیوند یاSocket)",
      sutures: "بخیه جراحی لثه",
      implantRemoval: "خارج کردن ایمپلنت (شکست خورده)",
      oldCrownBridgeRemoval: "برداشتن روکش یا بریج قدیمی",
      onlyCementation: "سیمان کردن مجدد روکش",
      implant: "کاشت ایمپلنت نوین",
      intraoralScan: "اسکن داخل دهانی دیجیتال",
      ct: "تصویربرداری سه بعدی (CT)"
    },
    treatmentDescs: {
      extraction: "خارج کردن دندان بدون نیاز به جراحی پیشرفته",
      surgicalExtraction: "خارج کردن دندان همراه با جراحی و جداسازی فلپ",
      crownPrep: "تراش دندان برای روکش‌های سرامیکی یا فلزی دائمی",
      inlayPrep: "تراش برای ترمیم‌های غیرمستقیم اینلی",
      onlayPrep: "تراش برای ترمیم‌های غیرمستقیم آنلی روی کاسپ",
      rct: "درمان ریشه کانال دندانی در جلسات درمانی",
      postAndCore: "قرار دادن پست در کانال ریشه و بازسازی تاج",
      fillingClassII: "ترمیم پوسیدگی بین دندانی کلاس دو",
      gingivalLift: "افزایش طول تاج کلینیکی یا زیبایی با برش لثه",
      sinusLift: "بالا بردن کف ائوس و پیوند استخوان فک بالا",
      boneAugmentation: "پیوند استخوان یا حفظ سوکت کشیده شده دندان",
      sutures: "بخیه زدن بخش‌های جراحی شده لثه و دهان",
      implantRemoval: "جراحی و درآوردن فیکسچر آسیب‌دیده ایمپلنت مخروبه",
      oldCrownBridgeRemoval: "پاسخ به شکست روکش قدیمی و جدا کردن آن با فرز مخصوص",
      onlyCementation: "سیمان مجدد روکش شل شده یا موقت",
      implant: "تعیین موقعیت فیکسچر ایمپلنت در لثه",
      intraoralScan: "تصویربرداری سه‌بعدی قالب‌گیری نوین",
      ct: "تصویربرداری توموگرافی کامپیوتری دندانی (CBCT)"
    },
    treatmentSectionTitle: "نمودار طرح درمان فعال و مستمر",
    treatmentSectionDesc: "دندان مورد نظر را لمس کرده و فرایند درمان نظیر جراحی، عصب کشی، قالب‌گیری، اسکن، روکش یا سی‌تی اسکن را اعمال کنید.",
    resetTreatmentChart: "بازنشانی طرح‌های درمان بیمار",
    upperArch: "فک بالا",
    lowerArch: "فک پایین",
    biteMidline: "خط میانی دهان",
    treatmentLogBadge: "پرونده درمان‌های در جریان",
    closeToothForm: "بستن فرم دندان",
    shadeSelectionTitle: "جزئیات اسکن داخل‌دهانی - انتخاب شید رنگ دندان",
    toothColorLabel: "رنگ دندان / شید رنگ انتخابی",
    chooseVitaShade: "-- شید VITA Classic را انتخاب کنید --",
    colorNoteLabel: "توضیحات و یادداشت رنگ و فرم",
    colorNotePlaceholder: "مثلاً: طوق دندان تیره‌تر (A3) و لبه دندانی روشن‌تر (A2)...",
    clinicalNotesLabel: "یادداشت‌ها و هشدارهای بالینی درمان دندان بیمار",
    clinicalNotesPlaceholder: "مراحل درمان دندان، مواد مصرف شده، وضعیت راحتی بیمار یا زمان‌بندی جلسات بعدی دندان را وارد کنید...",
    clinicalNotesSynced: "تغییرات به صورت آنی و خودکار ذخیره می‌شوند. نیازی به دخالت دستی نیست.",
    clearToothTreatments: "پاکسازی تمام موارد درمانی این دندان",
    legendTitle: "راهنمای علائم طرح درمان فعال دندان‌ها",
    yearsSuffix: "سال",
    noPhone: "بدون شماره تلفن",
    noDate: "ثبت نشده",
    confirmClearTreatments: "آیا واقعاً می‌خواهید تمام درمان‌های ثبت‌شده این دندان را در طرح درمان بیمار پاک کنید؟",
    confirmDeletePatient: "آیا برای حذف همیشگی این پرونده دندانپزشکی در سامانه مطمئن هستید؟",
    addNewPatientTitle: "ثبت و گشایش پرونده بیمار جدید",
    editPatientTitle: "اصلاح و بروزرسانی مشخصات بیمار",
    firstNameLabel: "نام بیمار",
    lastNameLabel: "نام خانوادگی",
    reportTitle: "گزارش جامع پرونده بالینی و طرح درمان بیمار",
    clinicTitle: "کلینیک تخصصی دندانپزشکی و ایمپلنت الی‌دنت",
    practitionerTitle: "جراح، دندان‌پزشک و متخصص پروتز‌های دندانی",
    dateGenerated: "تاریخ صدور گزارش",
    clinicalSummary: "خلاصه گزارش بالینی وضعیت دندانپزشکی بیمار",
    medicalClearanceAlert: "هشدارهای زمینه‌ای سیستماتیک و لزوم مشاوره دارویی",
    recommendations: "توصیه‌ها و اقدامات پیشگیرانه دندانپزشکی",
    signatureLine: "مهر و امضای جراح معالج و شماره نظام پزشکی",
    officialStamp: "مهر رسمی تایید بخش کنترل کیفیت بالینی",
    toothCol: "شماره دندان",
    archCol: "موقعیت دندانی در دهان",
    operationsCol: "طرح‌های در جریان فک و دهان و شید رنگ انتخابی",
    noTreatmentsRecorded: "هیچ عملیات جراحی فعال، ترمیم، لیفت، پیوند استخوان، اسکن یا سی‌تی اسکن در این پرونده ثبت نشده است.",
    sessionLogsTitle: "تاریخچه مراجعات، ویزیت‌ها و اقدامات انجام شده",
    addSessionLogBtn: "افزودن لاگ ویزیت و ویزیت جدید",
    sessionNotesLabel: "جزئیات بالینی اقدام انجام شده در این ویزیت",
    sessionPlaceholder: "نسخه دارویی، اقدامات انجام شده، مراحل ترمیم، روند بهبود یا زمان بعدی مراجعه تفصیلی...",
    treatmentNotesLogged: "یادداشت‌های درمانی ثبت‌شده",
    historyConcernsHeader: "سابقه بیماری‌های زمینه‌ای بیمار دندانپزشکی",
    medicalAdvisoryNotes: "توصیه‌های پیشگیرانه با توجه به بیماری‌های زمینه‌ای",
    dentalConditionsHeader: "نمودار دندانی و آنومالی‌های شناسایی شده",
    activeTreatmentsHeader: "طرح‌های درمان فعال و پرپر آماده‌سازی"
  }
};
