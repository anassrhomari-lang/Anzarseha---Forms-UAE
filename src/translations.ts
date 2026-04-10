export type Language = 'en' | 'ar';

export const translations = {
  en: {
    dir: 'ltr',
    welcome: {
      title: "The Future of Clinical Efficiency",
      subtitle: "Anzarseha integrates specialized AI intelligence into your clinical workflow. Eliminate administrative friction, automate documentation, and reclaim hours for patient care.",
      cta: "Get Started",
      secure: "Secure",
      efficient: "Efficient",
    },
    steps: {
      back: "Back",
      proceed: "Select to proceed",
      start: {
        title: "Select your clinical domain",
        subtitle: "Precision starts with context. Help us understand your medical environment.",
        options: ["General Practice", "Specialist (Hospital)", "Private Clinic Owner", "Aesthetic / Cosmetic", "Other"],
      },
      pain: {
        title: "Identify your primary bottleneck",
        subtitle: "Where does friction most impact your clinical workflow?",
        options: ["Clinical Notes & Documentation", "Patient Follow-ups & Reminders", "Repetitive Patient Inquiries", "Scheduling & No-shows", "All of the above"],
      },
      timing: {
        title: "Pinpoint peak administrative load",
        subtitle: "When is the demand for your attention most overwhelming?",
        options: ["During Clinic Hours", "After Clinic (Evenings/Weekends)", "Both Equally"],
      },
      useCase: {
        title: "AI-Driven Optimization",
        question: "Ready to see Anzarseha in action with a 10-minute clinical demo?",
        options: ["Yes, I'd like a demo", "Send me more information first", "Perhaps at a later time"],
      },
      contact: {
        title: "Secure your AI Integration",
        subtitle: "Provide your contact details to receive your personalized clinical optimization report.",
        placeholder: "Your WhatsApp or Email...",
        submit: "Submit",
        privacy: "Your data is secure & private",
      },
      final: {
        title: "Your AI Journey Begins",
        message: "Your clinical optimization profile is being processed. An Anzarseha specialist will contact you at {contact} within 24 hours to discuss your AI integration strategy.",
        cta: "Return to Start",
      }
    },
    footer: {
      copyright: "© 2026 Anzarseha AI",
      tagline: "Medical AI",
    },
    useCases: {
      '1': "📋 Anzarseha's Neural Engine automates clinical documentation with 99% accuracy, reclaiming over 2 hours of your daily schedule for patient care.",
      '2': "📲 Our Intelligent Follow-up System manages patient recovery via WhatsApp, ensuring zero-gap continuity of care without manual intervention.",
      '3': "🤖 Anzarseha's Bilingual AI handles routine inquiries 24/7, acting as a tireless virtual receptionist for your medical practice.",
      '4': "📅 Predictive Scheduling reduces no-shows by 40% through smart reminders and automated re-booking, optimizing your clinic's revenue.",
      '5': "⚡ The Full Clinical Suite provides a 360° AI ecosystem, handling everything from documentation to patient engagement and scheduling.",
    }
  },
  ar: {
    dir: 'rtl',
    welcome: {
      title: "مستقبل الكفاءة السريرية",
      subtitle: "أنزار صحة تدمج الذكاء الاصطناعي المتخصص في سير عملك السريري. تخلص من العوائق الإدارية، أتمت التوثيق، واستعد ساعات من وقتك لرعاية المرضى.",
      cta: "ابدأ الآن",
      secure: "آمن",
      efficient: "فعال",
    },
    steps: {
      back: "رجوع",
      proceed: "اختر للمتابعة",
      start: {
        title: "اختر مجالك السريري",
        subtitle: "الدقة تبدأ بالسياق. ساعدنا على فهم بيئتك الطبية.",
        options: ["الطب العام", "أخصائي (مستشفى)", "صاحب عيادة خاصة", "تجميل / ليزر", "آخر"],
      },
      pain: {
        title: "حدد العائق الرئيسي لديك",
        subtitle: "أين يؤثر الاحتكاك أكثر على سير عملك السريري؟",
        options: ["الملاحظات السريرية والتوثيق", "متابعة المرضى والتذكيرات", "استفسارات المرضى المتكررة", "الجدولة وعدم الحضور", "كل ما سبق"],
      },
      timing: {
        title: "حدد ذروة العبء الإداري",
        subtitle: "متى يكون الطلب على انتباهك أكثر إرهاقاً؟",
        options: ["خلال ساعات العمل", "بعد العيادة (المساء/عطلات نهاية الأسبوع)", "كلاهما بالتساوي"],
      },
      useCase: {
        title: "التحسين المدفوع بالذكاء الاصطناعي",
        question: "هل أنت مستعد لرؤية أنزار صحة في العمل من خلال عرض تجريبي سريري لمدة 10 دقائق؟",
        options: ["نعم، أود عرضاً تجريبياً", "أرسل لي المزيد من المعلومات أولاً", "ربما في وقت لاحق"],
      },
      contact: {
        title: "أمن تكامل الذكاء الاصطناعي الخاص بك",
        subtitle: "قدم تفاصيل الاتصال الخاصة بك لتلقي تقرير تحسين سريري مخصص.",
        placeholder: "واتساب أو البريد الإلكتروني الخاص بك...",
        submit: "إرسال",
        privacy: "بياناتك آمنة وخاصة",
      },
      final: {
        title: "تبدأ رحلتك مع الذكاء الاصطناعي",
        message: "جاري معالجة ملف تحسين سير العمل السريري الخاص بك. سيتواصل معك أخصائي من أنزار صحة على {contact} خلال 24 ساعة لمناقشة استراتيجية دمج الذكاء الاصطناعي الخاصة بك.",
        cta: "العودة إلى البداية",
      }
    },
    footer: {
      copyright: "© 2026 أنزار صحة للذكاء الاصطناعي",
      tagline: "الذكاء الاصطناعي الطبي",
    },
    useCases: {
      '1': "📋 يقوم محرك أنزار صحة العصبي بتمتة التوثيق السريري بدقة 99٪، مما يوفر أكثر من ساعتين من جدولك اليومي لرعاية المرضى.",
      '2': "📲 يدير نظام المتابعة الذكي الخاص بنا تعافي المرضى عبر واتساب، مما يضمن استمرارية الرعاية دون تدخل يدوي.",
      '3': "🤖 يتعامل ذكاء أنزار صحة الاصطناعي ثنائي اللغة مع الاستفسارات الروتينية على مدار الساعة طوال أيام الأسبوع، ويعمل كموظف استقبال افتراضي لا يكل لممارستك الطبية.",
      '4': "📅 تقلل الجدولة التنبؤية من حالات عدم الحضور بنسبة 40٪ من خلال التذكيرات الذكية وإعادة الحجز التلقائي، مما يحسن إيرادات عيادتك.",
      '5': "⚡ توفر المجموعة السريرية الكاملة نظاماً بيئياً للذكاء الاصطناعي بزاوية 360 درجة، وتتعامل مع كل شيء من التوثيق إلى مشاركة المرضى والجدولة.",
    }
  }
};
