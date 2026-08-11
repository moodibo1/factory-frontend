import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  ar: {
    translation: {
      // ── Navbar ──────────────────────────────────────────────
      app_name: '🏭 النظام',
      home: 'الرئيسية',
      my_account: 'حسابي',
      smart_search: 'بحث ذكي',
      reports: 'التقارير',
      management: 'الإدارة',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
      back: 'رجوع',
      admin: 'مشرف',

      // ── Main Sections ────────────────────────────────────────
      main_sections: 'الأقسام الرئيسية',
      production: 'الإنتاج',
      labs: 'المختبرات',
      filling: 'التعبئة',
      packaging: 'التغليف',

      // ── Dashboard & Analytics ────────────────────────────────
      export_excel: 'تصدير Excel',
      total_records: 'إجمالي السجلات',
      open_records: 'سجلات مفتوحة',
      closed_records: 'سجلات مغلقة',
      emergencies: 'طوارئ',
      issues_by_department: 'الإشكاليات حسب القسم',
      severity_distribution: 'توزيع الخطورة',
      latest_issues: 'آخر الإشكاليات',
      main: 'رئيسي',
      critical: 'حرج',
      secondary: 'ثانوي',
      reports_analytics: 'التقارير والإحصائيات',
      print: 'طباعة',
      loading_failed: 'تعذّر تحميل البيانات',
      ai_report_failed: 'فشل توليد التقرير. تأكد من صحة الـ API Key.',
      select_date_range: 'حدد الفترة الزمنية',
      start_date: 'من تاريخ',
      end_date: 'إلى تاريخ',
      download: 'تحميل',
      cancel: 'إلغاء',
      count: 'العدد',

      // ── AI Report ────────────────────────────────────────────
      ai_smart_report: 'التقرير الذكي',
      generate_report: 'توليد التقرير',
      generate_ai_report: 'توليد تقرير ذكي',
      generating: 'جاري التوليد...',
      copy: 'نسخ',
      copied: 'تم النسخ',
      custom_report_prompt: 'اكتب ما تريد تحليله...',
      generate_custom_report: 'توليد تقرير مخصص',
      current_factory_status: 'الوضع الحالي للمصنع',
      monthly_performance: 'الأداء الشهري',
      monthly_performance_prompt: 'حلل أداء المصنع خلال الشهر الماضي',

      // ── Notifications ────────────────────────────────────────
      notifications: 'الإشعارات',
      smart_alerts: 'تنبيهات ذكية',
      emergency_intervention: 'أمر طارئ يحتاج تدخل فوري',
      emergency_still_open: 'سجل طارئ ولا يزال مفتوحاً',
      delayed_record: 'سجل متأخر',
      open_since: 'مفتوح منذ',
      not_closed_yet: 'ولم يتم إغلاقه بعد',
      days_ago: 'منذ {{count}} يوم',
      hours_ago: 'منذ {{count}} ساعة',
      minutes_ago: 'منذ {{count}} دقيقة',
      just_now: 'الآن',
      mark_all_read: 'قراءة الكل',
      no_notifications: 'لا توجد إشعارات',
      all: 'الكل',

      // ── AI Search ────────────────────────────────────────────
      search_naturally: 'ابحث بالعامية وسيفهمك الذكاء الاصطناعي',
      search_examples: 'أمثلة على البحث:',
      all_emergency_orders: 'كل الأوامر الطارئة',
      open_lab_records: 'سجلات المختبر المفتوحة',
      packaging_notes_week: 'ملاحظات التغليف هذا الأسبوع',
      delayed_records: 'السجلات المتأخرة',
      search_placeholder: 'ابحث عن إشكالية...',
      searching: 'جاري البحث...',
      search_results: 'نتائج البحث',
      no_results: 'لا توجد نتائج',
      search: 'بحث',
      error: 'حدث خطأ',

      // ── Issue Types & Status ─────────────────────────────────
      problem: 'مشكلة',
      note: 'ملاحظة',
      emergency: 'طارئ',
      open: 'مفتوح',
      in_progress: 'قيد التنفيذ',
      closed: 'مغلق',
      reopened: 'معاد فتحه',
      report_type: 'نوع السجل',
      status: 'الحالة',

      // ── Issue Card ───────────────────────────────────────────
      add_comment: 'أضف تعليقاً...',
      send: 'إرسال',
      comments: 'التعليقات',
      unknown: 'غير معروف',
      delete: 'حذف',
      archive: 'أرشفة',
      view_image: 'عرض الصورة',
      print_issue: 'طباعة السجل',
      advance_status: 'تقديم الحالة',

      // ── Add Issue Modal ──────────────────────────────────────
      add_new: 'إضافة سجل جديد',
      title_placeholder: 'عنوان المشكلة...',
      description_placeholder: 'وصف تفصيلي (اختياري)...',
      attach_media: 'إرفاق صورة أو فيديو',
      submit: 'إرسال السجل',
      submitting: 'جاري الإرسال...',
      select_department: 'القسم:',
      cross_post: 'نشر في أقسام متعددة',
      file_type_error: 'نوع الملف غير مسموح. يُسمح فقط بـ JPG, PNG, WEBP, MP4, MOV',
      file_size_video_error: 'حجم الفيديو كبير جداً. الحد الأقصى هو 50MB',
      file_size_image_error: 'حجم الصورة كبير جداً. الحد الأقصى هو 10MB',

      // ── Channel / Filter ─────────────────────────────────────
      filter: 'تصفية',
      sort: 'ترتيب',
      sort_newest: 'الأحدث أولاً',
      sort_oldest: 'الأقدم أولاً',
      sort_emergency: 'الطارئ أولاً',
      clear_filters: 'مسح الفلاتر',
      load_more: 'تحميل المزيد',
      no_issues: 'لا توجد سجلات',
      showing: 'عرض',
      of: 'من',
      add_issue: 'إضافة سجل',

      // ── Login / Auth ─────────────────────────────────────────
      the_system: 'النظام',
      national_factory: 'المصنع الوطني',
      login_title: 'تسجيل الدخول',
      register_title: 'إنشاء حساب',
      full_name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      remember_me: 'تذكرني',
      forgot_password: 'نسيت كلمة المرور؟',
      send_code: 'إرسال الرمز',
      recovery_code: 'رمز الاستعادة',
      new_password: 'كلمة المرور الجديدة',
      reset_password: 'تغيير كلمة المرور',
      verify_email: 'تأكيد البريد الإلكتروني',
      enter_code: 'أدخل رمز التحقق',
      verify: 'تحقق',
      loading: 'جاري التحميل...',
      enter_email_for_recovery: 'أدخل بريدك الإلكتروني وسنرسل لك رمز استعادة.',

      // Auth messages (dynamic)
      msg_verification_sent: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني. الرجاء إدخاله أدناه.',
      msg_account_pending: 'حسابك قيد المراجعة. انتظر موافقة الإدارة.',
      msg_account_rejected: 'تم رفض طلب انضمامك.',
      msg_invalid_credentials: 'بيانات الدخول غير صحيحة',
      msg_account_confirmed: '✅ تم تأكيد الحساب بنجاح! حسابك الآن قيد المراجعة.',
      msg_invalid_code: 'الرمز غير صحيح',
      msg_code_sent: 'تم إرسال الكود إلى بريدك الإلكتروني.',
      msg_send_error: 'حدث خطأ في الإرسال',
      msg_password_changed: 'تم تغيير كلمة المرور بنجاح.',
      msg_invalid_reset_code: 'الكود غير صحيح',

      // ── Profile ──────────────────────────────────────────────
      open_tracking_records: 'سجلات مفتوحة للمتابعة',
      closed_issues_records: 'سجلات تم إغلاقها',
      issue_log: 'سجل المشاكل',
      no_issues_yet: 'لا توجد سجلات بعد',

      // ── Admin Panel ──────────────────────────────────────────
      users: 'المستخدمون',
      join_requests: 'طلبات الانضمام',
      data: 'البيانات',
      confirm_delete: 'هل أنت متأكد من الحذف؟',
      make_admin: 'ترقية لمشرف',
      remove_admin: 'إلغاء الإشراف',
      approve: 'قبول',
      reject: 'رفض',
      permissions: 'الصلاحيات',
      no_pending_requests: 'لا توجد طلبات معلقة',
      no_users: 'لا يوجد مستخدمون',

      // ── Approve User Modal ───────────────────────────────────
      classify_user: 'تصنيف المستخدم',
      select_department_for: 'يرجى تحديد قسم {{name}}',

      // ── Permissions Modal ────────────────────────────────────
      edit_permissions: 'تعديل صلاحيات المستخدم',
      perm_add_label: 'صلاحية الإضافة',
      perm_add_desc: 'السماح بإنشاء سجلات جديدة في النظام',
      perm_delete_label: 'صلاحية الحذف',
      perm_delete_desc: 'السماح بحذف السجلات والتعليقات الخاصة به',
      perm_manage_label: 'صلاحية إدارة الأذونات',
      perm_manage_desc: 'إعطاء صلاحية لتعديل حسابات المستخدمين الآخرين',
      save: 'حفظ التغييرات',
      saving: 'جاري الحفظ...',

      // ── Security ─────────────────────────────────────────────
      security_warning: '⚠️ تحذير أمني',
      security_message: 'لا يُسمح بالتقاط لقطات الشاشة أو طباعة المحتوى. هذا النظام خاضع للمراقبة.',
      understood: 'فهمت',
    },
  },

  en: {
    translation: {
      // ── Navbar ──────────────────────────────────────────────
      app_name: '🏭 System',
      home: 'Home',
      my_account: 'My Account',
      smart_search: 'Smart Search',
      reports: 'Reports',
      management: 'Management',
      settings: 'Settings',
      logout: 'Logout',
      back: 'Back',
      admin: 'Admin',

      // ── Main Sections ────────────────────────────────────────
      main_sections: 'Main Sections',
      production: 'Production',
      labs: 'Labs',
      filling: 'Filling',
      packaging: 'Packaging',

      // ── Dashboard & Analytics ────────────────────────────────
      export_excel: 'Export Excel',
      total_records: 'Total Records',
      open_records: 'Open Records',
      closed_records: 'Closed Records',
      emergencies: 'Emergencies',
      issues_by_department: 'Issues by Department',
      severity_distribution: 'Severity Distribution',
      latest_issues: 'Latest Issues',
      main: 'Main',
      critical: 'Critical',
      secondary: 'Secondary',
      reports_analytics: 'Reports & Analytics',
      print: 'Print',
      loading_failed: 'Failed to load data',
      ai_report_failed: 'Failed to generate report. Check your API Key.',
      select_date_range: 'Select date range',
      start_date: 'From date',
      end_date: 'To date',
      download: 'Download',
      cancel: 'Cancel',
      count: 'Count',

      // ── AI Report ────────────────────────────────────────────
      ai_smart_report: 'AI Smart Report',
      generate_report: 'Generate Report',
      generate_ai_report: 'Generate AI Report',
      generating: 'Generating...',
      copy: 'Copy',
      copied: 'Copied!',
      custom_report_prompt: 'Describe what you want to analyze...',
      generate_custom_report: 'Generate Custom Report',
      current_factory_status: 'Current Factory Status',
      monthly_performance: 'Monthly Performance',
      monthly_performance_prompt: 'Analyze factory performance over the past month',

      // ── Notifications ────────────────────────────────────────
      notifications: 'Notifications',
      smart_alerts: 'Smart Alerts',
      emergency_intervention: 'Emergency requiring immediate action',
      emergency_still_open: 'Emergency record still open',
      delayed_record: 'Delayed record',
      open_since: 'Open since',
      not_closed_yet: 'not yet closed',
      days_ago: '{{count}} day(s) ago',
      hours_ago: '{{count}} hour(s) ago',
      minutes_ago: '{{count}} minute(s) ago',
      just_now: 'Just now',
      mark_all_read: 'Mark all read',
      no_notifications: 'No notifications',
      all: 'All',

      // ── AI Search ────────────────────────────────────────────
      search_naturally: 'Search in plain language and AI will understand you',
      search_examples: 'Search examples:',
      all_emergency_orders: 'All emergency orders',
      open_lab_records: 'Open lab records',
      packaging_notes_week: 'Packaging notes this week',
      delayed_records: 'Delayed records',
      search_placeholder: 'Search for an issue...',
      searching: 'Searching...',
      search_results: 'Search Results',
      no_results: 'No results found',
      search: 'Search',
      error: 'An error occurred',

      // ── Issue Types & Status ─────────────────────────────────
      problem: 'Problem',
      note: 'Note',
      emergency: 'Emergency',
      open: 'Open',
      in_progress: 'In Progress',
      closed: 'Closed',
      reopened: 'Reopened',
      report_type: 'Record Type',
      status: 'Status',

      // ── Issue Card ───────────────────────────────────────────
      add_comment: 'Add a comment...',
      send: 'Send',
      comments: 'Comments',
      unknown: 'Unknown',
      delete: 'Delete',
      archive: 'Archive',
      view_image: 'View Image',
      print_issue: 'Print Record',
      advance_status: 'Advance Status',

      // ── Add Issue Modal ──────────────────────────────────────
      add_new: 'Add New Record',
      title_placeholder: 'Issue title...',
      description_placeholder: 'Detailed description (optional)...',
      attach_media: 'Attach photo or video',
      submit: 'Submit Record',
      submitting: 'Submitting...',
      select_department: 'Department:',
      cross_post: 'Post to multiple departments',
      file_type_error: 'File type not allowed. Only JPG, PNG, WEBP, MP4, MOV are permitted.',
      file_size_video_error: 'Video is too large. Maximum size is 50MB.',
      file_size_image_error: 'Image is too large. Maximum size is 10MB.',

      // ── Channel / Filter ─────────────────────────────────────
      filter: 'Filter',
      sort: 'Sort',
      sort_newest: 'Newest first',
      sort_oldest: 'Oldest first',
      sort_emergency: 'Emergency first',
      clear_filters: 'Clear filters',
      load_more: 'Load more',
      no_issues: 'No records found',
      showing: 'Showing',
      of: 'of',
      add_issue: 'Add Record',

      // ── Login / Auth ─────────────────────────────────────────
      the_system: 'The System',
      national_factory: 'National Factory',
      login_title: 'Login',
      register_title: 'Create Account',
      full_name: 'Full Name',
      email: 'Email',
      password: 'Password',
      remember_me: 'Remember Me',
      forgot_password: 'Forgot Password?',
      send_code: 'Send Code',
      recovery_code: 'Recovery Code',
      new_password: 'New Password',
      reset_password: 'Reset Password',
      verify_email: 'Verify Email',
      enter_code: 'Enter verification code',
      verify: 'Verify',
      loading: 'Loading...',
      enter_email_for_recovery: 'Enter your email and we will send you a recovery code.',

      // Auth messages
      msg_verification_sent: 'A verification code has been sent to your email. Please enter it below.',
      msg_account_pending: 'Your account is under review. Await admin approval.',
      msg_account_rejected: 'Your join request has been rejected.',
      msg_invalid_credentials: 'Invalid login credentials.',
      msg_account_confirmed: '✅ Account confirmed! Your account is now under review.',
      msg_invalid_code: 'Invalid code.',
      msg_code_sent: 'A code has been sent to your email.',
      msg_send_error: 'An error occurred while sending.',
      msg_password_changed: 'Password changed successfully.',
      msg_invalid_reset_code: 'Invalid reset code.',

      // ── Profile ──────────────────────────────────────────────
      open_tracking_records: 'Open records',
      closed_issues_records: 'Closed records',
      issue_log: 'Issue Log',
      no_issues_yet: 'No records yet',

      // ── Admin Panel ──────────────────────────────────────────
      users: 'Users',
      join_requests: 'Join Requests',
      data: 'Data',
      confirm_delete: 'Are you sure you want to delete?',
      make_admin: 'Make Admin',
      remove_admin: 'Remove Admin',
      approve: 'Approve',
      reject: 'Reject',
      permissions: 'Permissions',
      no_pending_requests: 'No pending requests',
      no_users: 'No users found',

      // ── Approve User Modal ───────────────────────────────────
      classify_user: 'Classify User',
      select_department_for: 'Select a department for {{name}}',

      // ── Permissions Modal ────────────────────────────────────
      edit_permissions: 'Edit User Permissions',
      perm_add_label: 'Add Permission',
      perm_add_desc: 'Allow creating new records in the system',
      perm_delete_label: 'Delete Permission',
      perm_delete_desc: 'Allow deleting own records and comments',
      perm_manage_label: 'Manage Permissions',
      perm_manage_desc: 'Allow editing permissions of other users',
      save: 'Save Changes',
      saving: 'Saving...',

      // ── Security ─────────────────────────────────────────────
      security_warning: '⚠️ Security Warning',
      security_message: 'Screenshots and printing are not permitted. This system is monitored.',
      understood: 'Understood',
    },
  },

  tr: {
    translation: {
      // ── Navbar ──────────────────────────────────────────────
      app_name: '🏭 Sistem',
      home: 'Ana Sayfa',
      my_account: 'Hesabım',
      smart_search: 'Akıllı Arama',
      reports: 'Raporlar',
      management: 'Yönetim',
      settings: 'Ayarlar',
      logout: 'Çıkış Yap',
      back: 'Geri',
      admin: 'Yönetici',

      // ── Main Sections ────────────────────────────────────────
      main_sections: 'Ana Bölümler',
      production: 'Üretim',
      labs: 'Laboratuvarlar',
      filling: 'Dolum',
      packaging: 'Ambalaj',

      // ── Dashboard & Analytics ────────────────────────────────
      export_excel: 'Excel\'e Aktar',
      total_records: 'Toplam Kayıt',
      open_records: 'Açık Kayıtlar',
      closed_records: 'Kapalı Kayıtlar',
      emergencies: 'Acil Durumlar',
      issues_by_department: 'Departmana Göre Sorunlar',
      severity_distribution: 'Önem Dağılımı',
      latest_issues: 'Son Sorunlar',
      main: 'Ana',
      critical: 'Kritik',
      secondary: 'İkincil',
      reports_analytics: 'Raporlar ve İstatistikler',
      print: 'Yazdır',
      loading_failed: 'Veriler yüklenemedi',
      ai_report_failed: 'Rapor oluşturulamadı. API Anahtarını kontrol edin.',
      select_date_range: 'Tarih aralığı seçin',
      start_date: 'Başlangıç tarihi',
      end_date: 'Bitiş tarihi',
      download: 'İndir',
      cancel: 'İptal',
      count: 'Sayı',

      // ── AI Report ────────────────────────────────────────────
      ai_smart_report: 'Akıllı Rapor',
      generate_report: 'Rapor Oluştur',
      generate_ai_report: 'AI Raporu Oluştur',
      generating: 'Oluşturuluyor...',
      copy: 'Kopyala',
      copied: 'Kopyalandı!',
      custom_report_prompt: 'Analiz etmek istediğinizi yazın...',
      generate_custom_report: 'Özel Rapor Oluştur',
      current_factory_status: 'Mevcut Fabrika Durumu',
      monthly_performance: 'Aylık Performans',
      monthly_performance_prompt: 'Geçen aya ait fabrika performansını analiz et',

      // ── Notifications ────────────────────────────────────────
      notifications: 'Bildirimler',
      smart_alerts: 'Akıllı Uyarılar',
      emergency_intervention: 'Acil müdahale gerektiren durum',
      emergency_still_open: 'Acil kayıt hâlâ açık',
      delayed_record: 'Gecikmiş kayıt',
      open_since: 'Açıldığından beri',
      not_closed_yet: 'henüz kapatılmadı',
      days_ago: '{{count}} gün önce',
      hours_ago: '{{count}} saat önce',
      minutes_ago: '{{count}} dakika önce',
      just_now: 'Az önce',
      mark_all_read: 'Tümünü okundu işaretle',
      no_notifications: 'Bildirim yok',
      all: 'Tümü',

      // ── AI Search ────────────────────────────────────────────
      search_naturally: 'Günlük dille arayın, yapay zeka anlasın',
      search_examples: 'Arama örnekleri:',
      all_emergency_orders: 'Tüm acil emirler',
      open_lab_records: 'Açık laboratuvar kayıtları',
      packaging_notes_week: 'Bu haftaki ambalaj notları',
      delayed_records: 'Gecikmiş kayıtlar',
      search_placeholder: 'Sorun ara...',
      searching: 'Aranıyor...',
      search_results: 'Arama Sonuçları',
      no_results: 'Sonuç bulunamadı',
      search: 'Ara',
      error: 'Bir hata oluştu',

      // ── Issue Types & Status ─────────────────────────────────
      problem: 'Sorun',
      note: 'Not',
      emergency: 'Acil',
      open: 'Açık',
      in_progress: 'Devam Ediyor',
      closed: 'Kapalı',
      reopened: 'Yeniden Açıldı',
      report_type: 'Kayıt Türü',
      status: 'Durum',

      // ── Issue Card ───────────────────────────────────────────
      add_comment: 'Yorum ekle...',
      send: 'Gönder',
      comments: 'Yorumlar',
      unknown: 'Bilinmiyor',
      delete: 'Sil',
      archive: 'Arşivle',
      view_image: 'Resmi Görüntüle',
      print_issue: 'Kaydı Yazdır',
      advance_status: 'Durumu Güncelle',

      // ── Add Issue Modal ──────────────────────────────────────
      add_new: 'Yeni Kayıt Ekle',
      title_placeholder: 'Sorun başlığı...',
      description_placeholder: 'Ayrıntılı açıklama (isteğe bağlı)...',
      attach_media: 'Fotoğraf veya video ekle',
      submit: 'Kaydı Gönder',
      submitting: 'Gönderiliyor...',
      select_department: 'Departman:',
      cross_post: 'Birden fazla departmana yayınla',
      file_type_error: 'Dosya türüne izin verilmiyor. Yalnızca JPG, PNG, WEBP, MP4, MOV\'e izin verilir.',
      file_size_video_error: 'Video çok büyük. Maksimum boyut 50MB\'dir.',
      file_size_image_error: 'Resim çok büyük. Maksimum boyut 10MB\'dir.',

      // ── Channel / Filter ─────────────────────────────────────
      filter: 'Filtrele',
      sort: 'Sırala',
      sort_newest: 'En yeni önce',
      sort_oldest: 'En eski önce',
      sort_emergency: 'Acil önce',
      clear_filters: 'Filtreleri temizle',
      load_more: 'Daha fazla yükle',
      no_issues: 'Kayıt bulunamadı',
      showing: 'Gösterilen',
      of: '/',
      add_issue: 'Kayıt Ekle',

      // ── Login / Auth ─────────────────────────────────────────
      the_system: 'Sistem',
      national_factory: 'Ulusal Fabrika',
      login_title: 'Giriş Yap',
      register_title: 'Hesap Oluştur',
      full_name: 'Tam Ad',
      email: 'E-posta',
      password: 'Şifre',
      remember_me: 'Beni Hatırla',
      forgot_password: 'Şifremi Unuttum?',
      send_code: 'Kod Gönder',
      recovery_code: 'Kurtarma Kodu',
      new_password: 'Yeni Şifre',
      reset_password: 'Şifreyi Sıfırla',
      verify_email: 'E-postayı Doğrula',
      enter_code: 'Doğrulama kodunu girin',
      verify: 'Doğrula',
      loading: 'Yükleniyor...',
      enter_email_for_recovery: 'E-posta adresinizi girin, size bir kurtarma kodu göndereceğiz.',

      // Auth messages
      msg_verification_sent: 'E-postanıza bir doğrulama kodu gönderildi. Lütfen aşağıya girin.',
      msg_account_pending: 'Hesabınız inceleniyor. Yönetici onayını bekleyin.',
      msg_account_rejected: 'Katılma isteğiniz reddedildi.',
      msg_invalid_credentials: 'Geçersiz giriş bilgileri.',
      msg_account_confirmed: '✅ Hesap onaylandı! Hesabınız şimdi inceleniyor.',
      msg_invalid_code: 'Geçersiz kod.',
      msg_code_sent: 'E-postanıza bir kod gönderildi.',
      msg_send_error: 'Gönderilirken bir hata oluştu.',
      msg_password_changed: 'Şifre başarıyla değiştirildi.',
      msg_invalid_reset_code: 'Geçersiz sıfırlama kodu.',

      // ── Profile ──────────────────────────────────────────────
      open_tracking_records: 'Açık kayıtlar',
      closed_issues_records: 'Kapatılan kayıtlar',
      issue_log: 'Sorun Günlüğü',
      no_issues_yet: 'Henüz kayıt yok',

      // ── Admin Panel ──────────────────────────────────────────
      users: 'Kullanıcılar',
      join_requests: 'Katılma İstekleri',
      data: 'Veriler',
      confirm_delete: 'Silmek istediğinizden emin misiniz?',
      make_admin: 'Yönetici Yap',
      remove_admin: 'Yöneticiliği Kaldır',
      approve: 'Onayla',
      reject: 'Reddet',
      permissions: 'İzinler',
      no_pending_requests: 'Bekleyen istek yok',
      no_users: 'Kullanıcı bulunamadı',

      // ── Approve User Modal ───────────────────────────────────
      classify_user: 'Kullanıcıyı Sınıflandır',
      select_department_for: '{{name}} için departman seçin',

      // ── Permissions Modal ────────────────────────────────────
      edit_permissions: 'Kullanıcı İzinlerini Düzenle',
      perm_add_label: 'Ekleme İzni',
      perm_add_desc: 'Sistemde yeni kayıt oluşturulmasına izin ver',
      perm_delete_label: 'Silme İzni',
      perm_delete_desc: 'Kendi kayıt ve yorumlarını silmesine izin ver',
      perm_manage_label: 'İzin Yönetimi',
      perm_manage_desc: 'Diğer kullanıcıların izinlerini düzenlemesine izin ver',
      save: 'Değişiklikleri Kaydet',
      saving: 'Kaydediliyor...',

      // ── Security ─────────────────────────────────────────────
      security_warning: '⚠️ Güvenlik Uyarısı',
      security_message: 'Ekran görüntüsü alma ve yazdırma yasaktır. Bu sistem izlenmektedir.',
      understood: 'Anladım',
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    lng: 'ar',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

// Sync HTML attributes whenever language changes
const syncHtmlAttrs = (lang) => {
  const cleanLang = lang.substring(0, 2)
  document.documentElement.dir = cleanLang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = cleanLang
}

// Apply on init
syncHtmlAttrs(i18n.language)

// Apply on every language change
i18n.on('languageChanged', syncHtmlAttrs)

export default i18n
