import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  ar: {
    translation: {
       // â”€â”€ Navbar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
       app_name: 'D1',
      home: 'Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©',
      my_account: 'Ø­Ø³Ø§Ø¨ÙŠ',
      smart_search: 'Ø¨Ø­Ø« Ø°ÙƒÙŠ',
      reports: 'Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ±',
      management: 'Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©',
      settings: 'Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª',
      logout: 'ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬',
      back: 'Ø±Ø¬ÙˆØ¹',
      admin: 'Ù…Ø´Ø±Ù',

      // â”€â”€ Main Sections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      main_sections: 'Ø§Ù„Ø£Ù‚Ø³Ø§Ù… Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©',
      production: 'Ø§Ù„Ø¥Ù†ØªØ§Ø¬',
      labs: 'Ø§Ù„Ù…Ø®ØªØ¨Ø±Ø§Øª',
      filling: 'Ø§Ù„ØªØ¹Ø¨Ø¦Ø©',
      packaging: 'Ø§Ù„ØªØºÙ„ÙŠÙ',

      // â”€â”€ Dashboard & Analytics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      export_excel: 'ØªØµØ¯ÙŠØ± Excel',
      total_records: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø³Ø¬Ù„Ø§Øª',
      open_records: 'Ø³Ø¬Ù„Ø§Øª Ù…ÙØªÙˆØ­Ø©',
      closed_records: 'Ø³Ø¬Ù„Ø§Øª Ù…ØºÙ„Ù‚Ø©',
      emergencies: 'Ø·ÙˆØ§Ø±Ø¦',
      issues_by_department: 'Ø§Ù„Ø¥Ø´ÙƒØ§Ù„ÙŠØ§Øª Ø­Ø³Ø¨ Ø§Ù„Ù‚Ø³Ù…',
      severity_distribution: 'ØªÙˆØ²ÙŠØ¹ Ø§Ù„Ø®Ø·ÙˆØ±Ø©',
      latest_issues: 'Ø¢Ø®Ø± Ø§Ù„Ø¥Ø´ÙƒØ§Ù„ÙŠØ§Øª',
      main: 'Ø±Ø¦ÙŠØ³ÙŠ',
      critical: 'Ø­Ø±Ø¬',
      secondary: 'Ø«Ø§Ù†ÙˆÙŠ',
      reports_analytics: 'Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ± ÙˆØ§Ù„Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª',
      print: 'Ø·Ø¨Ø§Ø¹Ø©',
      loading_failed: 'ØªØ¹Ø°Ù‘Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª',
      ai_report_failed: 'ÙØ´Ù„ ØªÙˆÙ„ÙŠØ¯ Ø§Ù„ØªÙ‚Ø±ÙŠØ±. ØªØ£ÙƒØ¯ Ù…Ù† ØµØ­Ø© Ø§Ù„Ù€ API Key.',
      select_date_range: 'Ø­Ø¯Ø¯ Ø§Ù„ÙØªØ±Ø© Ø§Ù„Ø²Ù…Ù†ÙŠØ©',
      start_date: 'Ù…Ù† ØªØ§Ø±ÙŠØ®',
      end_date: 'Ø¥Ù„Ù‰ ØªØ§Ø±ÙŠØ®',
      download: 'ØªØ­Ù…ÙŠÙ„',
      cancel: 'Ø¥Ù„ØºØ§Ø¡',
      count: 'Ø§Ù„Ø¹Ø¯Ø¯',

      // â”€â”€ AI Report â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      ai_smart_report: 'Ø§Ù„ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ø°ÙƒÙŠ',
      generate_report: 'ØªÙˆÙ„ÙŠØ¯ Ø§Ù„ØªÙ‚Ø±ÙŠØ±',
      generate_ai_report: 'ØªÙˆÙ„ÙŠØ¯ ØªÙ‚Ø±ÙŠØ± Ø°ÙƒÙŠ',
      generating: 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªÙˆÙ„ÙŠØ¯...',
      copy: 'Ù†Ø³Ø®',
      copied: 'ØªÙ… Ø§Ù„Ù†Ø³Ø®',
      custom_report_prompt: 'Ø§ÙƒØªØ¨ Ù…Ø§ ØªØ±ÙŠØ¯ ØªØ­Ù„ÙŠÙ„Ù‡...',
      generate_custom_report: 'ØªÙˆÙ„ÙŠØ¯ ØªÙ‚Ø±ÙŠØ± Ù…Ø®ØµØµ',
      current_factory_status: 'Ø§Ù„ÙˆØ¶Ø¹ Ø§Ù„Ø­Ø§Ù„ÙŠ Ù„Ù„Ù…ØµÙ†Ø¹',
      monthly_performance: 'Ø§Ù„Ø£Ø¯Ø§Ø¡ Ø§Ù„Ø´Ù‡Ø±ÙŠ',
      monthly_performance_prompt: 'Ø­Ù„Ù„ Ø£Ø¯Ø§Ø¡ Ø§Ù„Ù…ØµÙ†Ø¹ Ø®Ù„Ø§Ù„ Ø§Ù„Ø´Ù‡Ø± Ø§Ù„Ù…Ø§Ø¶ÙŠ',

      // â”€â”€ Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      notifications: 'Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª',
      smart_alerts: 'ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø°ÙƒÙŠØ©',
      emergency_intervention: 'Ø£Ù…Ø± Ø·Ø§Ø±Ø¦ ÙŠØ­ØªØ§Ø¬ ØªØ¯Ø®Ù„ ÙÙˆØ±ÙŠ',
      emergency_still_open: 'Ø³Ø¬Ù„ Ø·Ø§Ø±Ø¦ ÙˆÙ„Ø§ ÙŠØ²Ø§Ù„ Ù…ÙØªÙˆØ­Ø§Ù‹',
      delayed_record: 'Ø³Ø¬Ù„ Ù…ØªØ£Ø®Ø±',
      open_since: 'Ù…ÙØªÙˆØ­ Ù…Ù†Ø°',
      not_closed_yet: 'ÙˆÙ„Ù… ÙŠØªÙ… Ø¥ØºÙ„Ø§Ù‚Ù‡ Ø¨Ø¹Ø¯',
      days_ago: 'Ù…Ù†Ø° {{count}} ÙŠÙˆÙ…',
      hours_ago: 'Ù…Ù†Ø° {{count}} Ø³Ø§Ø¹Ø©',
      minutes_ago: 'Ù…Ù†Ø° {{count}} Ø¯Ù‚ÙŠÙ‚Ø©',
      just_now: 'Ø§Ù„Ø¢Ù†',
      mark_all_read: 'Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„ÙƒÙ„',
      no_notifications: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¥Ø´Ø¹Ø§Ø±Ø§Øª',
      all: 'Ø§Ù„ÙƒÙ„',

      // â”€â”€ AI Search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      search_naturally: 'Ø§Ø¨Ø­Ø« Ø¨Ø§Ù„Ø¹Ø§Ù…ÙŠØ© ÙˆØ³ÙŠÙÙ‡Ù…Ùƒ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ',
      search_examples: 'Ø£Ù…Ø«Ù„Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø¨Ø­Ø«:',
      all_emergency_orders: 'ÙƒÙ„ Ø§Ù„Ø£ÙˆØ§Ù…Ø± Ø§Ù„Ø·Ø§Ø±Ø¦Ø©',
      open_lab_records: 'Ø³Ø¬Ù„Ø§Øª Ø§Ù„Ù…Ø®ØªØ¨Ø± Ø§Ù„Ù…ÙØªÙˆØ­Ø©',
      packaging_notes_week: 'Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„ØªØºÙ„ÙŠÙ Ù‡Ø°Ø§ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹',
      delayed_records: 'Ø§Ù„Ø³Ø¬Ù„Ø§Øª Ø§Ù„Ù…ØªØ£Ø®Ø±Ø©',
      search_placeholder: 'Ø§Ø¨Ø­Ø« Ø¹Ù† Ø¥Ø´ÙƒØ§Ù„ÙŠØ©...',
      searching: 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø¨Ø­Ø«...',
      search_results: 'Ù†ØªØ§Ø¦Ø¬ Ø§Ù„Ø¨Ø­Ø«',
      no_results: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ù†ØªØ§Ø¦Ø¬',
      search: 'Ø¨Ø­Ø«',
      error: 'Ø­Ø¯Ø« Ø®Ø·Ø£',

      // â”€â”€ Issue Types & Status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      problem: 'Ù…Ø´ÙƒÙ„Ø©',
      note: 'Ù…Ù„Ø§Ø­Ø¸Ø©',
      emergency: 'Ø·Ø§Ø±Ø¦',
      open: 'Ù…ÙØªÙˆØ­',
      in_progress: 'Ù‚ÙŠØ¯ Ø§Ù„ØªÙ†ÙÙŠØ°',
      closed: 'Ù…ØºÙ„Ù‚',
      reopened: 'Ù…Ø¹Ø§Ø¯ ÙØªØ­Ù‡',
      report_type: 'Ù†ÙˆØ¹ Ø§Ù„Ø³Ø¬Ù„',
      status: 'Ø§Ù„Ø­Ø§Ù„Ø©',

      // â”€â”€ Issue Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      add_comment: 'Ø£Ø¶Ù ØªØ¹Ù„ÙŠÙ‚Ø§Ù‹...',
      send: 'Ø¥Ø±Ø³Ø§Ù„',
      comments: 'Ø§Ù„ØªØ¹Ù„ÙŠÙ‚Ø§Øª',
      unknown: 'ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ',
      delete: 'Ø­Ø°Ù',
      archive: 'Ø£Ø±Ø´ÙØ©',
      view_image: 'Ø¹Ø±Ø¶ Ø§Ù„ØµÙˆØ±Ø©',
      print_issue: 'Ø·Ø¨Ø§Ø¹Ø© Ø§Ù„Ø³Ø¬Ù„',
      advance_status: 'ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø­Ø§Ù„Ø©',

      opened_at: 'فُتح',
      moved_to_progress: 'بدأ التنفيذ',
      closed_at_label: 'أُغلق',
      duration_open: 'مدة الفتح',
      // â”€â”€ Add Issue Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      add_new: 'Ø¥Ø¶Ø§ÙØ© Ø³Ø¬Ù„ Ø¬Ø¯ÙŠØ¯',
      title_placeholder: 'Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ù…Ø´ÙƒÙ„Ø©...',
      description_placeholder: 'ÙˆØµÙ ØªÙØµÙŠÙ„ÙŠ (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)...',
      attach_media: 'Ø¥Ø±ÙØ§Ù‚ ØµÙˆØ±Ø© Ø£Ùˆ ÙÙŠØ¯ÙŠÙˆ',
      submit: 'Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø³Ø¬Ù„',
      submitting: 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø¥Ø±Ø³Ø§Ù„...',
      select_department: 'Ø§Ù„Ù‚Ø³Ù…:',
      cross_post: 'Ù†Ø´Ø± ÙÙŠ Ø£Ù‚Ø³Ø§Ù… Ù…ØªØ¹Ø¯Ø¯Ø©',
      file_type_error: 'Ù†ÙˆØ¹ Ø§Ù„Ù…Ù„Ù ØºÙŠØ± Ù…Ø³Ù…ÙˆØ­. ÙŠÙØ³Ù…Ø­ ÙÙ‚Ø· Ø¨Ù€ JPG, PNG, WEBP, MP4, MOV',
      file_size_video_error: 'Ø­Ø¬Ù… Ø§Ù„ÙÙŠØ¯ÙŠÙˆ ÙƒØ¨ÙŠØ± Ø¬Ø¯Ø§Ù‹. Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ù‚ØµÙ‰ Ù‡Ùˆ 50MB',
      file_size_image_error: 'Ø­Ø¬Ù… Ø§Ù„ØµÙˆØ±Ø© ÙƒØ¨ÙŠØ± Ø¬Ø¯Ø§Ù‹. Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ù‚ØµÙ‰ Ù‡Ùˆ 10MB',

      // â”€â”€ Channel / Filter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      filter: 'ØªØµÙÙŠØ©',
      sort: 'ØªØ±ØªÙŠØ¨',
      sort_newest: 'Ø§Ù„Ø£Ø­Ø¯Ø« Ø£ÙˆÙ„Ø§Ù‹',
      sort_oldest: 'Ø§Ù„Ø£Ù‚Ø¯Ù… Ø£ÙˆÙ„Ø§Ù‹',
      sort_emergency: 'Ø§Ù„Ø·Ø§Ø±Ø¦ Ø£ÙˆÙ„Ø§Ù‹',
      clear_filters: 'Ù…Ø³Ø­ Ø§Ù„ÙÙ„Ø§ØªØ±',
      load_more: 'ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ù…Ø²ÙŠØ¯',
      no_issues: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø³Ø¬Ù„Ø§Øª',
      showing: 'Ø¹Ø±Ø¶',
      of: 'Ù…Ù†',
      add_issue: 'Ø¥Ø¶Ø§ÙØ© Ø³Ø¬Ù„',

      // â”€â”€ Login / Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      the_system: 'Ø§Ù„Ù†Ø¸Ø§Ù…',
      national_factory: 'Ø§Ù„Ù…ØµÙ†Ø¹ Ø§Ù„ÙˆØ·Ù†ÙŠ',
      login_title: 'ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„',
      register_title: 'Ø¥Ù†Ø´Ø§Ø¡ Ø­Ø³Ø§Ø¨',
      full_name: 'Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„',
      email: 'Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ',
      password: 'ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±',
      remember_me: 'ØªØ°ÙƒØ±Ù†ÙŠ',
      forgot_password: 'Ù†Ø³ÙŠØª ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±ØŸ',
      send_code: 'Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø±Ù…Ø²',
      recovery_code: 'Ø±Ù…Ø² Ø§Ù„Ø§Ø³ØªØ¹Ø§Ø¯Ø©',
      new_password: 'ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©',
      reset_password: 'ØªØºÙŠÙŠØ± ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±',
      verify_email: 'ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ',
      enter_code: 'Ø£Ø¯Ø®Ù„ Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚',
      verify: 'ØªØ­Ù‚Ù‚',
      loading: 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù…ÙŠÙ„...',
      enter_email_for_recovery: 'Ø£Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ ÙˆØ³Ù†Ø±Ø³Ù„ Ù„Ùƒ Ø±Ù…Ø² Ø§Ø³ØªØ¹Ø§Ø¯Ø©.',

      // Auth messages (dynamic)
      msg_verification_sent: 'ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø¥Ù„Ù‰ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ. Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø¥Ø¯Ø®Ø§Ù„Ù‡ Ø£Ø¯Ù†Ø§Ù‡.',
      msg_account_pending: 'Ø­Ø³Ø§Ø¨Ùƒ Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©. Ø§Ù†ØªØ¸Ø± Ù…ÙˆØ§ÙÙ‚Ø© Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©.',
      msg_account_rejected: 'ØªÙ… Ø±ÙØ¶ Ø·Ù„Ø¨ Ø§Ù†Ø¶Ù…Ø§Ù…Ùƒ.',
      msg_invalid_credentials: 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¯Ø®ÙˆÙ„ ØºÙŠØ± ØµØ­ÙŠØ­Ø©',
      msg_account_confirmed: 'âœ… ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø³Ø§Ø¨ Ø¨Ù†Ø¬Ø§Ø­! Ø­Ø³Ø§Ø¨Ùƒ Ø§Ù„Ø¢Ù† Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©.',
      msg_invalid_code: 'Ø§Ù„Ø±Ù…Ø² ØºÙŠØ± ØµØ­ÙŠØ­',
      msg_code_sent: 'ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„ÙƒÙˆØ¯ Ø¥Ù„Ù‰ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ.',
      msg_send_error: 'Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø¥Ø±Ø³Ø§Ù„',
      msg_password_changed: 'ØªÙ… ØªØºÙŠÙŠØ± ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø¨Ù†Ø¬Ø§Ø­.',
      msg_invalid_reset_code: 'Ø§Ù„ÙƒÙˆØ¯ ØºÙŠØ± ØµØ­ÙŠØ­',

      // â”€â”€ Profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      open_tracking_records: 'Ø³Ø¬Ù„Ø§Øª Ù…ÙØªÙˆØ­Ø© Ù„Ù„Ù…ØªØ§Ø¨Ø¹Ø©',
      closed_issues_records: 'Ø³Ø¬Ù„Ø§Øª ØªÙ… Ø¥ØºÙ„Ø§Ù‚Ù‡Ø§',
      issue_log: 'Ø³Ø¬Ù„ Ø§Ù„Ù…Ø´Ø§ÙƒÙ„',
      no_issues_yet: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø³Ø¬Ù„Ø§Øª Ø¨Ø¹Ø¯',

      // â”€â”€ Admin Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      users: 'Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙˆÙ†',
      join_requests: 'Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø§Ù†Ø¶Ù…Ø§Ù…',
      data: 'Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª',
      confirm_delete: 'Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø§Ù„Ø­Ø°ÙØŸ',
      make_admin: 'ØªØ±Ù‚ÙŠØ© Ù„Ù…Ø´Ø±Ù',
      remove_admin: 'Ø¥Ù„ØºØ§Ø¡ Ø§Ù„Ø¥Ø´Ø±Ø§Ù',
      approve: 'Ù‚Ø¨ÙˆÙ„',
      reject: 'Ø±ÙØ¶',
      permissions: 'Ø§Ù„ØµÙ„Ø§Ø­ÙŠØ§Øª',
      no_pending_requests: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø·Ù„Ø¨Ø§Øª Ù…Ø¹Ù„Ù‚Ø©',
      no_users: 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø³ØªØ®Ø¯Ù…ÙˆÙ†',

      // â”€â”€ Approve User Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      classify_user: 'ØªØµÙ†ÙŠÙ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…',
      select_department_for: 'ÙŠØ±Ø¬Ù‰ ØªØ­Ø¯ÙŠØ¯ Ù‚Ø³Ù… {{name}}',

      // â”€â”€ Permissions Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      edit_permissions: 'ØªØ¹Ø¯ÙŠÙ„ ØµÙ„Ø§Ø­ÙŠØ§Øª Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…',
      perm_add_label: 'ØµÙ„Ø§Ø­ÙŠØ© Ø§Ù„Ø¥Ø¶Ø§ÙØ©',
      perm_add_desc: 'Ø§Ù„Ø³Ù…Ø§Ø­ Ø¨Ø¥Ù†Ø´Ø§Ø¡ Ø³Ø¬Ù„Ø§Øª Ø¬Ø¯ÙŠØ¯Ø© ÙÙŠ Ø§Ù„Ù†Ø¸Ø§Ù…',
      perm_delete_label: 'ØµÙ„Ø§Ø­ÙŠØ© Ø§Ù„Ø­Ø°Ù',
      perm_delete_desc: 'Ø§Ù„Ø³Ù…Ø§Ø­ Ø¨Ø­Ø°Ù Ø§Ù„Ø³Ø¬Ù„Ø§Øª ÙˆØ§Ù„ØªØ¹Ù„ÙŠÙ‚Ø§Øª Ø§Ù„Ø®Ø§ØµØ© Ø¨Ù‡',
      perm_manage_label: 'ØµÙ„Ø§Ø­ÙŠØ© Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø£Ø°ÙˆÙ†Ø§Øª',
      perm_manage_desc: 'Ø¥Ø¹Ø·Ø§Ø¡ ØµÙ„Ø§Ø­ÙŠØ© Ù„ØªØ¹Ø¯ÙŠÙ„ Ø­Ø³Ø§Ø¨Ø§Øª Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ† Ø§Ù„Ø¢Ø®Ø±ÙŠÙ†',
      save: 'Ø­ÙØ¸ Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª',
      saving: 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø­ÙØ¸...',

      // â”€â”€ Security â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      security_warning: 'âš ï¸ ØªØ­Ø°ÙŠØ± Ø£Ù…Ù†ÙŠ',
      security_message: 'Ù„Ø§ ÙŠÙØ³Ù…Ø­ Ø¨Ø§Ù„ØªÙ‚Ø§Ø· Ù„Ù‚Ø·Ø§Øª Ø§Ù„Ø´Ø§Ø´Ø© Ø£Ùˆ Ø·Ø¨Ø§Ø¹Ø© Ø§Ù„Ù…Ø­ØªÙˆÙ‰. Ù‡Ø°Ø§ Ø§Ù„Ù†Ø¸Ø§Ù… Ø®Ø§Ø¶Ø¹ Ù„Ù„Ù…Ø±Ø§Ù‚Ø¨Ø©.',
      understood: 'ÙÙ‡Ù…Øª',
    },
  },

  en: {
    translation: {
      // â”€â”€ Navbar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      app_name: 'ðŸ­ System',
      home: 'Home',
      my_account: 'My Account',
      smart_search: 'Smart Search',
      reports: 'Reports',
      management: 'Management',
      settings: 'Settings',
      logout: 'Logout',
      back: 'Back',
      admin: 'Admin',

      // â”€â”€ Main Sections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      main_sections: 'Main Sections',
      production: 'Production',
      labs: 'Labs',
      filling: 'Filling',
      packaging: 'Packaging',

      // â”€â”€ Dashboard & Analytics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

      // â”€â”€ AI Report â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

      // â”€â”€ Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

      // â”€â”€ AI Search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

      // â”€â”€ Issue Types & Status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      problem: 'Problem',
      note: 'Note',
      emergency: 'Emergency',
      open: 'Open',
      in_progress: 'In Progress',
      closed: 'Closed',
      reopened: 'Reopened',
      report_type: 'Record Type',
      status: 'Status',

      // â”€â”€ Issue Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      add_comment: 'Add a comment...',
      send: 'Send',
      comments: 'Comments',
      unknown: 'Unknown',
      delete: 'Delete',
      archive: 'Archive',
      view_image: 'View Image',
      print_issue: 'Print Record',
      advance_status: 'Advance Status',
      opened_at: 'Opened',
      moved_to_progress: 'Started',
      closed_at_label: 'Closed',
      duration_open: 'Open duration',

      // â”€â”€ Add Issue Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

      // â”€â”€ Channel / Filter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

      // â”€â”€ Login / Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      msg_verification_sent: 'A confirmation link has been sent to your email. Please click it to verify your account.',
      msg_account_pending: 'Your account is under review. Await admin approval.',
      msg_account_rejected: 'Your join request has been rejected.',
      msg_invalid_credentials: 'Invalid login credentials.',
      msg_account_confirmed: 'âœ… Account confirmed! Your account is now under review.',
      msg_invalid_code: 'Invalid code.',
      msg_code_sent: 'A code has been sent to your email.',
      msg_send_error: 'An error occurred while sending.',
      msg_password_changed: 'Password changed successfully.',
      msg_invalid_reset_code: 'Invalid reset code.',

      // â”€â”€ Profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      open_tracking_records: 'Open records',
      closed_issues_records: 'Closed records',
      issue_log: 'Issue Log',
      no_issues_yet: 'No records yet',

      // â”€â”€ Admin Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

      // â”€â”€ Approve User Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      classify_user: 'Classify User',
      select_department_for: 'Select a department for {{name}}',

      // â”€â”€ Permissions Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      edit_permissions: 'Edit User Permissions',
      perm_add_label: 'Add Permission',
      perm_add_desc: 'Allow creating new records in the system',
      perm_delete_label: 'Delete Permission',
      perm_delete_desc: 'Allow deleting own records and comments',
      perm_manage_label: 'Manage Permissions',
      perm_manage_desc: 'Allow editing permissions of other users',
      save: 'Save Changes',
      saving: 'Saving...',

      // â”€â”€ Security â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      security_warning: 'âš ï¸ Security Warning',
      security_message: 'Screenshots and printing are not permitted. This system is monitored.',
      understood: 'Understood',
    },
  },

  tr: {
    translation: {
      // â”€â”€ Navbar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      app_name: 'ðŸ­ Sistem',
      home: 'Ana Sayfa',
      my_account: 'HesabÄ±m',
      smart_search: 'AkÄ±llÄ± Arama',
      reports: 'Raporlar',
      management: 'YÃ¶netim',
      settings: 'Ayarlar',
      logout: 'Ã‡Ä±kÄ±ÅŸ Yap',
      back: 'Geri',
      admin: 'YÃ¶netici',

      // â”€â”€ Main Sections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      main_sections: 'Ana BÃ¶lÃ¼mler',
      production: 'Ãœretim',
      labs: 'Laboratuvarlar',
      filling: 'Dolum',
      packaging: 'Ambalaj',

      // â”€â”€ Dashboard & Analytics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      export_excel: 'Excel\'e Aktar',
      total_records: 'Toplam KayÄ±t',
      open_records: 'AÃ§Ä±k KayÄ±tlar',
      closed_records: 'KapalÄ± KayÄ±tlar',
      emergencies: 'Acil Durumlar',
      issues_by_department: 'Departmana GÃ¶re Sorunlar',
      severity_distribution: 'Ã–nem DaÄŸÄ±lÄ±mÄ±',
      latest_issues: 'Son Sorunlar',
      main: 'Ana',
      critical: 'Kritik',
      secondary: 'Ä°kincil',
      reports_analytics: 'Raporlar ve Ä°statistikler',
      print: 'YazdÄ±r',
      loading_failed: 'Veriler yÃ¼klenemedi',
      ai_report_failed: 'Rapor oluÅŸturulamadÄ±. API AnahtarÄ±nÄ± kontrol edin.',
      select_date_range: 'Tarih aralÄ±ÄŸÄ± seÃ§in',
      start_date: 'BaÅŸlangÄ±Ã§ tarihi',
      end_date: 'BitiÅŸ tarihi',
      download: 'Ä°ndir',
      cancel: 'Ä°ptal',
      count: 'SayÄ±',

      // â”€â”€ AI Report â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      ai_smart_report: 'AkÄ±llÄ± Rapor',
      generate_report: 'Rapor OluÅŸtur',
      generate_ai_report: 'AI Raporu OluÅŸtur',
      generating: 'OluÅŸturuluyor...',
      copy: 'Kopyala',
      copied: 'KopyalandÄ±!',
      custom_report_prompt: 'Analiz etmek istediÄŸinizi yazÄ±n...',
      generate_custom_report: 'Ã–zel Rapor OluÅŸtur',
      current_factory_status: 'Mevcut Fabrika Durumu',
      monthly_performance: 'AylÄ±k Performans',
      monthly_performance_prompt: 'GeÃ§en aya ait fabrika performansÄ±nÄ± analiz et',

      // â”€â”€ Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      notifications: 'Bildirimler',
      smart_alerts: 'AkÄ±llÄ± UyarÄ±lar',
      emergency_intervention: 'Acil mÃ¼dahale gerektiren durum',
      emergency_still_open: 'Acil kayÄ±t hÃ¢lÃ¢ aÃ§Ä±k',
      delayed_record: 'GecikmiÅŸ kayÄ±t',
      open_since: 'AÃ§Ä±ldÄ±ÄŸÄ±ndan beri',
      not_closed_yet: 'henÃ¼z kapatÄ±lmadÄ±',
      days_ago: '{{count}} gÃ¼n Ã¶nce',
      hours_ago: '{{count}} saat Ã¶nce',
      minutes_ago: '{{count}} dakika Ã¶nce',
      just_now: 'Az Ã¶nce',
      mark_all_read: 'TÃ¼mÃ¼nÃ¼ okundu iÅŸaretle',
      no_notifications: 'Bildirim yok',
      all: 'TÃ¼mÃ¼',

      // â”€â”€ AI Search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      search_naturally: 'GÃ¼nlÃ¼k dille arayÄ±n, yapay zeka anlasÄ±n',
      search_examples: 'Arama Ã¶rnekleri:',
      all_emergency_orders: 'TÃ¼m acil emirler',
      open_lab_records: 'AÃ§Ä±k laboratuvar kayÄ±tlarÄ±',
      packaging_notes_week: 'Bu haftaki ambalaj notlarÄ±',
      delayed_records: 'GecikmiÅŸ kayÄ±tlar',
      search_placeholder: 'Sorun ara...',
      searching: 'AranÄ±yor...',
      search_results: 'Arama SonuÃ§larÄ±',
      no_results: 'SonuÃ§ bulunamadÄ±',
      search: 'Ara',
      error: 'Bir hata oluÅŸtu',

      // â”€â”€ Issue Types & Status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      problem: 'Sorun',
      note: 'Not',
      emergency: 'Acil',
      open: 'AÃ§Ä±k',
      in_progress: 'Devam Ediyor',
      closed: 'KapalÄ±',
      reopened: 'Yeniden AÃ§Ä±ldÄ±',
      report_type: 'KayÄ±t TÃ¼rÃ¼',
      status: 'Durum',

      // â”€â”€ Issue Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      add_comment: 'Yorum ekle...',
      send: 'GÃ¶nder',
      comments: 'Yorumlar',
      unknown: 'Bilinmiyor',
      delete: 'Sil',
      archive: 'ArÅŸivle',
      view_image: 'Resmi GÃ¶rÃ¼ntÃ¼le',
      print_issue: 'KaydÄ± YazdÄ±r',
      advance_status: 'Durumu GÃ¼ncelle',
      opened_at: 'Açıldı',
      moved_to_progress: 'Başladı',
      closed_at_label: 'Kapatıldı',
      duration_open: 'Açık süresi',

      // â”€â”€ Add Issue Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      add_new: 'Yeni KayÄ±t Ekle',
      title_placeholder: 'Sorun baÅŸlÄ±ÄŸÄ±...',
      description_placeholder: 'AyrÄ±ntÄ±lÄ± aÃ§Ä±klama (isteÄŸe baÄŸlÄ±)...',
      attach_media: 'FotoÄŸraf veya video ekle',
      submit: 'KaydÄ± GÃ¶nder',
      submitting: 'GÃ¶nderiliyor...',
      select_department: 'Departman:',
      cross_post: 'Birden fazla departmana yayÄ±nla',
      file_type_error: 'Dosya tÃ¼rÃ¼ne izin verilmiyor. YalnÄ±zca JPG, PNG, WEBP, MP4, MOV\'e izin verilir.',
      file_size_video_error: 'Video Ã§ok bÃ¼yÃ¼k. Maksimum boyut 50MB\'dir.',
      file_size_image_error: 'Resim Ã§ok bÃ¼yÃ¼k. Maksimum boyut 10MB\'dir.',

      // â”€â”€ Channel / Filter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      filter: 'Filtrele',
      sort: 'SÄ±rala',
      sort_newest: 'En yeni Ã¶nce',
      sort_oldest: 'En eski Ã¶nce',
      sort_emergency: 'Acil Ã¶nce',
      clear_filters: 'Filtreleri temizle',
      load_more: 'Daha fazla yÃ¼kle',
      no_issues: 'KayÄ±t bulunamadÄ±',
      showing: 'GÃ¶sterilen',
      of: '/',
      add_issue: 'KayÄ±t Ekle',

      // â”€â”€ Login / Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      the_system: 'Sistem',
      national_factory: 'Ulusal Fabrika',
      login_title: 'GiriÅŸ Yap',
      register_title: 'Hesap OluÅŸtur',
      full_name: 'Tam Ad',
      email: 'E-posta',
      password: 'Åžifre',
      remember_me: 'Beni HatÄ±rla',
      forgot_password: 'Åžifremi Unuttum?',
      send_code: 'Kod GÃ¶nder',
      recovery_code: 'Kurtarma Kodu',
      new_password: 'Yeni Åžifre',
      reset_password: 'Åžifreyi SÄ±fÄ±rla',
      verify_email: 'E-postayÄ± DoÄŸrula',
      enter_code: 'DoÄŸrulama kodunu girin',
      verify: 'DoÄŸrula',
      loading: 'YÃ¼kleniyor...',
      enter_email_for_recovery: 'E-posta adresinizi girin, size bir kurtarma kodu gÃ¶ndereceÄŸiz.',

      // Auth messages
      msg_verification_sent: 'E-postanÄ±za bir doÄŸrulama kodu gÃ¶nderildi. LÃ¼tfen aÅŸaÄŸÄ±ya girin.',
      msg_account_pending: 'HesabÄ±nÄ±z inceleniyor. YÃ¶netici onayÄ±nÄ± bekleyin.',
      msg_account_rejected: 'KatÄ±lma isteÄŸiniz reddedildi.',
      msg_invalid_credentials: 'GeÃ§ersiz giriÅŸ bilgileri.',
      msg_account_confirmed: 'âœ… Hesap onaylandÄ±! HesabÄ±nÄ±z ÅŸimdi inceleniyor.',
      msg_invalid_code: 'GeÃ§ersiz kod.',
      msg_code_sent: 'E-postanÄ±za bir kod gÃ¶nderildi.',
      msg_send_error: 'GÃ¶nderilirken bir hata oluÅŸtu.',
      msg_password_changed: 'Åžifre baÅŸarÄ±yla deÄŸiÅŸtirildi.',
      msg_invalid_reset_code: 'GeÃ§ersiz sÄ±fÄ±rlama kodu.',

      // â”€â”€ Profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      open_tracking_records: 'AÃ§Ä±k kayÄ±tlar',
      closed_issues_records: 'KapatÄ±lan kayÄ±tlar',
      issue_log: 'Sorun GÃ¼nlÃ¼ÄŸÃ¼',
      no_issues_yet: 'HenÃ¼z kayÄ±t yok',

      // â”€â”€ Admin Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      users: 'KullanÄ±cÄ±lar',
      join_requests: 'KatÄ±lma Ä°stekleri',
      data: 'Veriler',
      confirm_delete: 'Silmek istediÄŸinizden emin misiniz?',
      make_admin: 'YÃ¶netici Yap',
      remove_admin: 'YÃ¶neticiliÄŸi KaldÄ±r',
      approve: 'Onayla',
      reject: 'Reddet',
      permissions: 'Ä°zinler',
      no_pending_requests: 'Bekleyen istek yok',
      no_users: 'KullanÄ±cÄ± bulunamadÄ±',

      // â”€â”€ Approve User Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      classify_user: 'KullanÄ±cÄ±yÄ± SÄ±nÄ±flandÄ±r',
      select_department_for: '{{name}} iÃ§in departman seÃ§in',

      // â”€â”€ Permissions Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      edit_permissions: 'KullanÄ±cÄ± Ä°zinlerini DÃ¼zenle',
      perm_add_label: 'Ekleme Ä°zni',
      perm_add_desc: 'Sistemde yeni kayÄ±t oluÅŸturulmasÄ±na izin ver',
      perm_delete_label: 'Silme Ä°zni',
      perm_delete_desc: 'Kendi kayÄ±t ve yorumlarÄ±nÄ± silmesine izin ver',
      perm_manage_label: 'Ä°zin YÃ¶netimi',
      perm_manage_desc: 'DiÄŸer kullanÄ±cÄ±larÄ±n izinlerini dÃ¼zenlemesine izin ver',
      save: 'DeÄŸiÅŸiklikleri Kaydet',
      saving: 'Kaydediliyor...',

      // â”€â”€ Security â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      security_warning: 'âš ï¸ GÃ¼venlik UyarÄ±sÄ±',
      security_message: 'Ekran gÃ¶rÃ¼ntÃ¼sÃ¼ alma ve yazdÄ±rma yasaktÄ±r. Bu sistem izlenmektedir.',
      understood: 'AnladÄ±m',
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
