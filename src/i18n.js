import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  ar: {
    translation: {
      // Navbar
      app_name: "🏭 النظام",
      home: "الرئيسية",
      my_account: "حسابي",
      smart_search: "بحث ذكي",
      reports: "التقارير",
      management: "الإدارة",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      
      // Main Sections
      main_sections: "الأقسام الرئيسية",
      production: "الإنتاج",
      labs: "المختبرات",
      filling: "التعبئة",
      packaging: "التعبئة",
      
      // Dashboard & Analytics
      export_excel: "تصدير Excel",
      total_records: "إجمالي السجلات",
      open_records: "سجلات مفتوحة",
      closed_records: "سجلات مغلقة",
      emergencies: "طوارئ",
      issues_by_department: "الإشكاليات حسب القسم",
      severity_distribution: "توزيع الخطورة",
      latest_issues: "آخر الإشكاليات",
      main: "رئيسي",
      critical: "حرج",
      secondary: "ثانوي",
      reports_analytics: "التقارير والإحصائيات",
      print: "طباعة",
      
      // Notifications
      notifications: "الإشعارات",
      smart_alerts: "تنبيهات ذكية",
      emergency_intervention: "أمر طارئ يحتاج تدخل فوري",
      emergency_still_open: "سجل طارئ ولا يزال مفتوحاً",
      delayed_record: "سجل متأخر",
      open_since: "مفتوح منذ",
      not_closed_yet: "ولم يتم إغلاقه بعد",
      days_ago: "منذ {{count}} يوم",
      hours_ago: "منذ {{count}} ساعة",
      minutes_ago: "منذ {{count}} دقيقة",
      
      // AI Search & Reports
      search_naturally: "ابحث بالعامية وسيفهمك الذكاء الاصطناعي",
      search_examples: "أمثلة على البحث:",
      all_emergency_orders: "كل الأوامر الطارئة",
      open_lab_records: "سجلات المختبر المفتوحة",
      packaging_notes_week: "ملاحظات التعبئة هذا الأسبوع",
      delayed_records: "السجلات المتأخرة",
      search_placeholder: "ابحث بالعامية... مثال:",
      search_button: "بحث",
      smart_reports_tool: "أداة التقارير والتحليلات الذكية",
      generate_quick_report: "توليد تقرير سريع:",
      current_factory_status: "تقرير الوضع الحالي للمصنع",
      monthly_performance: "تقرير الأداء الشهري",
      custom_query: "استعلم بشكل مخصص... مثال:",
      query_button: "استعلام",
      
      // Admin Page
      users: "المستخدمون",
      pending: "طلبات الانضمام",
      join_requests: "طلبات الانضمام",
      data: "البيانات",
      archive: "الأرشيف",
      normal_user: "مستخدم عادي",
      system_admin: "مدير النظام",
      you: "(أنت)",
      
      // User Actions
      approve: "موافقة",
      reject: "رفض",
      delete: "حذف",
      edit: "تعديل",
      save: "حفظ",
      cancel: "إلغاء",
      publish: "نشر",
      add: "إضافة",
      
      // Issue Types
      problem: "مشكلة",
      note: "ملاحظة",
      emergency: "أمر طارئ",
      report_type: "نوع البلاغ / الإضافة",
      
      // Issue Status
      open: "مفتوح",
      in_progress: "قيد المعالجة",
      closed: "مغلق",
      reopened: "معاد فتحه",
      
      // Issue Cards
      unknown: "مجهول",
      comment: "تعليق",
      add_comment: "أضف تعليق",
      comments: "تعليقات",
      records: "سجل",
      
      // Add Issue Form
      add_new: "إضافة جديدة",
      add_issue: "إضافة بلاغ",
      media_attachment: "مرفق وسائط",
      upload_image_video: "ارفع صورة أو فيديو",
      allowed_types: "الأنواع المسموحة: JPG, PNG, WEBP, MP4, MOV",
      max_limits: "الحد الأقصى: صور 10 ميجا | فيديو 500 ميجا",
      problem_title: "عنوان المشكلة",
      title_placeholder: "اكتب عنوان المشكلة هنا...",
      publish_in: "نشر في",
      admins_only: "(للمدراء فقط)",
      problem_description: "وصف المشكلة",
      description_placeholder: "اكتب تفاصيل ووصف المشكلة أو الملاحظة...",
      select_category: "اختر القسم",
      select_type: "اختر النوع",
      
      // Login & Security
      the_system: "النظام",
      national_factory: "المصنع الوطني",
      security_warning: "تحذير أمني",
      screenshot_denied: "محاولة التقاط الشاشة مرفوضة",
      activity_logged: "تم تسجيل هذا النشاط",
      forgot_password: "نسيت كلمة المرور؟",
      remember_me: "تذكرني",
      login: "دخول",
      register: "حساب جديد",
      login_title: "تسجيل الدخول",
      full_name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      
      // Common
      all: "الكل",
      back: "رجوع",
      loading: "جاري التحميل...",
      no_data: "لا توجد بيانات",
      search: "بحث",
      filter: "تصفية",
      admin: "مدير",
      user: "مستخدم",
      role: "الدور",
      permissions: "الصلاحيات",
      category: "القسم",
      description: "الوصف",
      title: "العنوان",
      created_at: "تاريخ الإنشاء",
      updated_at: "تاريخ التحديث",
      
      // Messages
      success: "تم بنجاح",
      error: "حدث خطأ",
      confirm_delete: "هل أنت متأكد من الحذف؟",
      confirm_approve: "هل تريد الموافقة على هذا المستخدم؟",
      confirm_reject: "هل تريد رفض هذا المستخدم؟",
    }
  },
  en: {
    translation: {
      // Navbar
      app_name: "🏭 The System",
      home: "Home",
      my_account: "Profile",
      smart_search: "AI Search",
      reports: "Dashboard",
      management: "Admin",
      settings: "Settings",
      logout: "Log out",
      
      // Main Sections
      main_sections: "Main Sections",
      production: "Production",
      labs: "Labs",
      filling: "Filling",
      packaging: "Packaging",
      
      // Dashboard & Analytics
      export_excel: "Export Excel",
      total_records: "Total Records",
      open_records: "Open Records",
      closed_records: "Closed Records",
      emergencies: "Emergencies",
      issues_by_department: "Issues by Department",
      severity_distribution: "Severity Distribution",
      latest_issues: "Latest Issues",
      main: "Main",
      critical: "Critical",
      secondary: "Secondary",
      reports_analytics: "Reports & Analytics",
      print: "Print",
      
      // Notifications
      notifications: "Notifications",
      smart_alerts: "Smart Alerts",
      emergency_intervention: "Emergency requiring immediate intervention",
      emergency_still_open: "Emergency record is still open",
      delayed_record: "Delayed record",
      open_since: "Open since",
      not_closed_yet: "and hasn't been closed yet",
      days_ago: "{{count}} days ago",
      hours_ago: "{{count}} hours ago",
      minutes_ago: "{{count}} minutes ago",
      
      // AI Search & Reports
      search_naturally: "Search naturally and AI will understand",
      search_examples: "Search examples:",
      all_emergency_orders: "All emergency orders",
      open_lab_records: "Open lab records",
      packaging_notes_week: "Packaging notes this week",
      delayed_records: "Delayed records",
      search_placeholder: "Search naturally... example:",
      search_button: "Search",
      smart_reports_tool: "Smart Reports & Analytics Tool",
      generate_quick_report: "Generate quick report:",
      current_factory_status: "Current factory status report",
      monthly_performance: "Monthly performance report",
      custom_query: "Custom query... example:",
      query_button: "Query",
      
      // Admin Page
      users: "Users",
      pending: "Pending",
      join_requests: "Join Requests",
      data: "Data",
      archive: "Archive",
      normal_user: "Normal User",
      system_admin: "System Admin",
      you: "(You)",
      
      // User Actions
      approve: "Approve",
      reject: "Reject",
      delete: "Delete",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      publish: "Publish",
      add: "Add",
      
      // Issue Types
      problem: "Problem",
      note: "Note",
      emergency: "Emergency",
      report_type: "Report / Addition Type",
      
      // Issue Status
      open: "Open",
      in_progress: "In Progress",
      closed: "Closed",
      reopened: "Reopened",
      
      // Issue Cards
      unknown: "Unknown",
      comment: "Comment",
      add_comment: "Add a comment",
      comments: "Comments",
      records: "record",
      
      // Add Issue Form
      add_new: "Add New",
      add_issue: "Add Issue",
      media_attachment: "Media Attachment",
      upload_image_video: "Upload image or video",
      allowed_types: "Allowed types: JPG, PNG, WEBP, MP4, MOV",
      max_limits: "Max limits: Images 10 MB | Video 500 MB",
      problem_title: "Problem Title",
      title_placeholder: "Write the problem title here...",
      publish_in: "Publish in",
      admins_only: "(Admins only)",
      problem_description: "Problem Description",
      description_placeholder: "Write details and description of the problem or note...",
      select_category: "Select Category",
      select_type: "Select Type",
      
      // Login & Security
      the_system: "The System",
      national_factory: "National Factory",
      security_warning: "Security Warning",
      screenshot_denied: "Screenshot attempt denied",
      activity_logged: "This activity has been logged",
      forgot_password: "Forgot password?",
      remember_me: "Remember me",
      login: "Login",
      register: "Register",
      login_title: "Sign In",
      full_name: "Full Name",
      email: "Email",
      password: "Password",
      
      // Common
      all: "All",
      back: "Back",
      loading: "Loading...",
      no_data: "No data available",
      search: "Search",
      filter: "Filter",
      admin: "Admin",
      user: "User",
      role: "Role",
      permissions: "Permissions",
      category: "Category",
      description: "Description",
      title: "Title",
      created_at: "Created At",
      updated_at: "Updated At",
      
      // Messages
      success: "Success",
      error: "Error",
      confirm_delete: "Are you sure you want to delete?",
      confirm_approve: "Do you want to approve this user?",
      confirm_reject: "Do you want to reject this user?",
    }
  },
  tr: {
    translation: {
      // Navbar
      app_name: "🏭 Sistem",
      home: "Ana Sayfa",
      my_account: "Hesabım",
      smart_search: "Yapay Zeka Arama",
      reports: "Raporlar",
      management: "Yönetim",
      settings: "Ayarlar",
      logout: "Çıkış Yap",
      
      // Main Sections
      main_sections: "Ana Bölümler",
      production: "Üretim",
      labs: "Laboratuvarlar",
      filling: "Dolum",
      packaging: "Paketleme",
      
      // Dashboard & Analytics
      export_excel: "Excel'e Aktar",
      total_records: "Toplam Kayıtlar",
      open_records: "Açık Kayıtlar",
      closed_records: "Kapalı Kayıtlar",
      emergencies: "Acil Durumlar",
      issues_by_department: "Bölüme Göre Sorunlar",
      severity_distribution: "Önem Dağılımı",
      latest_issues: "Son Sorunlar",
      main: "Ana",
      critical: "Kritik",
      secondary: "İkincil",
      reports_analytics: "Raporlar ve Analitik",
      print: "Yazdır",
      
      // Notifications
      notifications: "Bildirimler",
      smart_alerts: "Akıllı Uyarılar",
      emergency_intervention: "Acil müdahale gerektiren",
      emergency_still_open: "Acil kayıt hala açık",
      delayed_record: "Gecikmiş kayıt",
      open_since: "Açık olduğu süre",
      not_closed_yet: "ve henüz kapatılmadı",
      days_ago: "{{count}} gün önce",
      hours_ago: "{{count}} saat önce",
      minutes_ago: "{{count}} dakika önce",
      
      // AI Search & Reports
      search_naturally: "Doğal dilde arayın, yapay zeka anlayacak",
      search_examples: "Arama örnekleri:",
      all_emergency_orders: "Tüm acil emirler",
      open_lab_records: "Açık laboratuvar kayıtları",
      packaging_notes_week: "Bu haftanın paketleme notları",
      delayed_records: "Gecikmiş kayıtlar",
      search_placeholder: "Doğal dilde arayın... örnek:",
      search_button: "Ara",
      smart_reports_tool: "Akıllı Raporlar ve Analitik Aracı",
      generate_quick_report: "Hızlı rapor oluştur:",
      current_factory_status: "Mevcut fabrika durumu raporu",
      monthly_performance: "Aylık performans raporu",
      custom_query: "Özel sorgu... örnek:",
      query_button: "Sorgula",
      
      // Admin Page
      users: "Kullanıcılar",
      pending: "Bekleyen",
      join_requests: "Katılım İstekleri",
      data: "Veri",
      archive: "Arşiv",
      normal_user: "Normal Kullanıcı",
      system_admin: "Sistem Yöneticisi",
      you: "(Sen)",
      
      // User Actions
      approve: "Onayla",
      reject: "Reddet",
      delete: "Sil",
      edit: "Düzenle",
      save: "Kaydet",
      cancel: "İptal",
      publish: "Yayınla",
      add: "Ekle",
      
      // Issue Types
      problem: "Sorun",
      note: "Not",
      emergency: "Acil Durum",
      report_type: "Rapor / Ekleme Türü",
      
      // Issue Status
      open: "Açık",
      in_progress: "Devam Ediyor",
      closed: "Kapalı",
      reopened: "Yeniden Açıldı",
      
      // Issue Cards
      unknown: "Bilinmiyor",
      comment: "Yorum",
      add_comment: "Yorum ekle",
      comments: "Yorumlar",
      records: "kayıt",
      
      // Add Issue Form
      add_new: "Yeni Ekle",
      add_issue: "Sorun Ekle",
      media_attachment: "Medya Eki",
      upload_image_video: "Resim veya video yükle",
      allowed_types: "İzin verilen türler: JPG, PNG, WEBP, MP4, MOV",
      max_limits: "Maksimum sınırlar: Resimler 10 MB | Video 500 MB",
      problem_title: "Sorun Başlığı",
      title_placeholder: "Sorun başlığını buraya yazın...",
      publish_in: "Şurada yayınla",
      admins_only: "(Sadece yöneticiler)",
      problem_description: "Sorun Açıklaması",
      description_placeholder: "Sorun veya notun ayrıntılarını ve açıklamasını yazın...",
      select_category: "Kategori Seç",
      select_type: "Tür Seç",
      
      // Login & Security
      the_system: "Sistem",
      national_factory: "Ulusal Fabrika",
      security_warning: "Güvenlik Uyarısı",
      screenshot_denied: "Ekran görüntüsü girişimi reddedildi",
      activity_logged: "Bu etkinlik kaydedildi",
      forgot_password: "Şifremi unuttum?",
      remember_me: "Beni hatırla",
      login: "Giriş",
      register: "Kayıt Ol",
      login_title: "Oturum Aç",
      full_name: "Tam Ad",
      email: "E-posta",
      password: "Şifre",
      
      // Common
      all: "Tümü",
      back: "Geri",
      loading: "Yükleniyor...",
      no_data: "Veri yok",
      search: "Ara",
      filter: "Filtrele",
      admin: "Yönetici",
      user: "Kullanıcı",
      role: "Rol",
      permissions: "İzinler",
      category: "Kategori",
      description: "Açıklama",
      title: "Başlık",
      created_at: "Oluşturma Tarihi",
      updated_at: "Güncelleme Tarihi",
      
      // Messages
      success: "Başarılı",
      error: "Hata",
      confirm_delete: "Silmek istediğinizden emin misiniz?",
      confirm_approve: "Bu kullanıcıyı onaylamak istiyor musunuz?",
      confirm_reject: "Bu kullanıcıyı reddetmek istiyor musunuz?",
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    interpolation: { escapeValue: false }
  })

export default i18n
