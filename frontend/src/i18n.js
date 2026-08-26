import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Landing Page
      "landing.eyebrow": "// built for 14566 · nhaa",
      "landing.headline_part1": "Real-time Stress",
      "landing.headline_part2": "Assessment for Trauma Survivors",
      "landing.description": "SahAI provides intelligent triage support for victims accessing NHAA 14566. Our AI-powered assessment helps route cases by urgency and emotional state, connecting survivors with the right resources.",
      "landing.cta_primary": "Start Assessment",
      "landing.cta_secondary": "View Dashboard",
      "landing.social_proof": "• Smart India Hackathon prototype for NHAA 14566",
      "landing.sticky_note": "Built for real people. Real support.",

      // Consent Screen
      "consent.title": "Before We Begin",
      "consent.description": "We analyze your description to assess your current stress level and connect you with appropriate support. Your responses are:",
      "consent.privacy_point1": "✓ Anonymized—no personal identification stored",
      "consent.privacy_point2": "✓ Analyzed for emotional intensity and crisis indicators",
      "consent.privacy_point3": "✓ Used only to recommend appropriate resources",
      "consent.privacy_point4": "✓ Shared with trained counsellors for follow-up (if you consent)",
      "consent.disclaimer": "This is a decision-support tool, not a clinical diagnosis. A trained human counsellor will review your case.",
      "consent.agree": "I understand and consent to this assessment",
      "consent.language_label": "Language:",
      "consent.proceed": "Proceed to Assessment",

      // Intake Flow
      "intake.title": "Tell Us What's Happening",
      "intake.subtitle": "In your own words, describe your situation. You can type or record a voice note.",
      "intake.text_placeholder": "Type your situation here... (minimum 20 characters)",
      "intake.record_voice": "🎤 Record Voice Note",
      "intake.submit": "Submit Assessment",
      "intake.char_count": "Characters: {count}",
      "intake.error_too_short": "Please provide at least 20 characters",

      // Results Page
      "results.title": "Your Assessment Results",
      "results.svi_label": "Stress Vulnerability Index",
      "results.category_low": "Low Risk",
      "results.category_moderate": "Moderate Risk",
      "results.category_high": "High Risk",
      "results.category_critical": "Critical Risk",
      "results.recommended_action": "Recommended Action:",
      "results.factors": "Contributing Factors:",
      "results.next_steps": "What happens next?",
      "results.back_home": "Back to Home",
      "results.contact_counsellor": "Contact Counsellor",

      // Dashboard
      "dashboard.title": "Counsellor Case Review",
      "dashboard.critical_alert": "Critical Cases Requiring Review:",
      "dashboard.case_id": "Case ID",
      "dashboard.timestamp": "Submitted",
      "dashboard.language": "Language",
      "dashboard.svi_score": "SVI Score",
      "dashboard.category": "Category",
      "dashboard.excerpt": "Excerpt",
      "dashboard.action": "Recommended Action",
      "dashboard.status": "Status",
      "dashboard.mark_reviewed": "Mark as Reviewed",
      "dashboard.reviewed_by": "Reviewed by:",
      "dashboard.no_cases": "No cases yet",

      // Common
      "common.error": "An error occurred",
      "common.loading": "Loading...",
      "common.success": "Success",
      "footer.disclaimer": "Student prototype for Smart India Hackathon. Not affiliated with or a substitute for official NHAA 14566 services.",
    }
  },
  hi: {
    translation: {
      // Landing Page
      "landing.eyebrow": "// 14566 · nhaa के लिए बनाया गया",
      "landing.headline_part1": "रीयल-टाइम तनाव",
      "landing.headline_part2": "आघात से बचे लोगों के लिए मूल्यांकन",
      "landing.description": "SahAI NHAA 14566 को एक्सेस करने वाले पीड़ितों के लिए बुद्धिमान ट्रिएज समर्थन प्रदान करता है। हमारा AI-संचालित मूल्यांकन केसों को आपातकालीनता और भावनात्मक स्थिति के आधार पर रूट करने में मदद करता है।",
      "landing.cta_primary": "मूल्यांकन शुरू करें",
      "landing.cta_secondary": "डैशबोर्ड देखें",
      "landing.social_proof": "• स्मार्ट इंडिया हैकथॉन प्रोटोटाइप NHAA 14566 के लिए",
      "landing.sticky_note": "असली लोगों के लिए बनाया गया। असली समर्थन।",

      // Consent Screen
      "consent.title": "शुरुआत से पहले",
      "consent.description": "हम आपके विवरण का विश्लेषण करते हैं आपके वर्तमान तनाव स्तर का आकलन करने के लिए। आपकी प्रतिक्रियाएं हैं:",
      "consent.privacy_point1": "✓ गुमनाम—कोई व्यक्तिगत पहचान संग्रहीत नहीं",
      "consent.privacy_point2": "✓ भावनात्मक तीव्रता के लिए विश्लेषण किया",
      "consent.privacy_point3": "✓ केवल उचित संसाधनों की सिफारिश के लिए उपयोग किया",
      "consent.privacy_point4": "✓ प्रशिक्षित परामर्शदाताओं के साथ साझा किया (यदि आप सहमति देते हैं)",
      "consent.disclaimer": "यह एक निर्णय-समर्थन उपकरण है, नैदानिक निदान नहीं। एक प्रशिक्षित मानव परामर्शदाता आपके केस की समीक्षा करेगा।",
      "consent.agree": "मैं इस मूल्यांकन को समझता हूँ और सहमत हूँ",
      "consent.language_label": "भाषा:",
      "consent.proceed": "मूल्यांकन के लिए आगे बढ़ें",

      // Intake Flow
      "intake.title": "बताएं कि क्या हो रहा है",
      "intake.subtitle": "अपने शब्दों में, अपनी स्थिति बताएं। आप टाइप कर सकते हैं या वॉयस नोट रिकॉर्ड कर सकते हैं।",
      "intake.text_placeholder": "यहाँ अपनी स्थिति टाइप करें... (न्यूनतम 20 वर्ण)",
      "intake.record_voice": "🎤 वॉयस नोट रिकॉर्ड करें",
      "intake.submit": "मूल्यांकन सबमिट करें",
      "intake.char_count": "वर्ण: {count}",
      "intake.error_too_short": "कृपया कम से कम 20 वर्ण प्रदान करें",

      // Results Page
      "results.title": "आपके मूल्यांकन परिणाम",
      "results.svi_label": "तनाव असुरक्षा सूचकांक",
      "results.category_low": "कम जोखिम",
      "results.category_moderate": "मध्यम जोखिम",
      "results.category_high": "उच्च जोखिम",
      "results.category_critical": "गंभीर जोखिम",
      "results.recommended_action": "अनुशंसित कार्य:",
      "results.factors": "योगदान कारक:",
      "results.next_steps": "आगे क्या होगा?",
      "results.back_home": "होम पर वापस",
      "results.contact_counsellor": "परामर्शदाता से संपर्क करें",

      // Dashboard
      "dashboard.title": "परामर्शदाता केस समीक्षा",
      "dashboard.critical_alert": "समीक्षा की आवश्यकता वाले गंभीर केस:",
      "dashboard.case_id": "केस ID",
      "dashboard.timestamp": "सबमिट किया गया",
      "dashboard.language": "भाषा",
      "dashboard.svi_score": "SVI स्कोर",
      "dashboard.category": "श्रेणी",
      "dashboard.excerpt": "अंश",
      "dashboard.action": "अनुशंसित कार्य",
      "dashboard.status": "स्थिति",
      "dashboard.mark_reviewed": "समीक्षित के रूप में चिह्नित करें",
      "dashboard.reviewed_by": "द्वारा समीक्षित:",
      "dashboard.no_cases": "अभी कोई केस नहीं",

      // Common
      "common.error": "एक त्रुटि हुई",
      "common.loading": "लोड हो रहा है...",
      "common.success": "सफलता",
      "footer.disclaimer": "स्मार्ट इंडिया हैकथॉन के लिए छात्र प्रोटोटाइप। NHAA 14566 की आधिकारिक सेवाओं के साथ संबद्ध नहीं या उसके स्थान पर नहीं।",
    }
  }
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;
