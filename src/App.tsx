import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Step, UserData } from './types';
import { ChevronRight, CheckCircle2, ArrowLeft, ShieldCheck, Clock, ArrowRight, Languages, Loader2 } from 'lucide-react';
import { Language, translations } from './translations';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, setDoc, doc, arrayUnion } from 'firebase/firestore';

const LOGO_URL = "https://framerusercontent.com/images/YPAzIjoMNrFadoMFFkX13J0nXrs.png?scale-down-to=512&width=3432&height=3432";

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('WELCOME');
  const [userData, setUserData] = useState<UserData>({});
  const [direction, setDirection] = useState(1);
  const [lang, setLang] = useState<Language>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionId = useMemo(() => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), []);

  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  const handleChoice = useCallback(async (choice: string) => {
    setDirection(1);
    const nextStepMap: Record<Step, Step> = {
      'WELCOME': 'START',
      'START': 'PAIN',
      'PAIN': 'TIMING',
      'TIMING': 'USE_CASE',
      'USE_CASE': 'CONTACT_FORM',
      'CONTACT_FORM': 'FINAL',
      'FINAL': 'FINAL'
    };

    const nextStep: Step = nextStepMap[currentStep];
    
    // Record the click in Firestore (grouped by session ID)
    try {
      const sessionRef = doc(db, 'sessions', sessionId);
      await setDoc(sessionRef, {
        sessionId: sessionId,
        lastUpdate: serverTimestamp(),
        events: arrayUnion({
          step: currentStep,
          choice: choice,
          timestamp: new Date().toISOString()
        })
      }, { merge: true });
    } catch (error) {
      const errInfo = {
        error: error instanceof Error ? error.message : String(error),
        operationType: 'set',
        path: `sessions/${sessionId}`,
        data: { step: currentStep, choice }
      };
      console.error('Firestore Session Error:', JSON.stringify(errInfo));
    }

    if (currentStep === 'CONTACT_FORM') {
      setIsSubmitting(true);
      try {
        // Update session with contact info
        const sessionRef = doc(db, 'sessions', sessionId);
        await setDoc(sessionRef, {
          contactInfo: userData.contactInfo || 'N/A',
          lastUpdate: serverTimestamp()
        }, { merge: true });

        await addDoc(collection(db, 'responses'), {
          specialty: userData.specialty || 'N/A',
          pain: userData.pain || 'N/A',
          timing: userData.timing || 'N/A',
          demoChoice: userData.demoChoice || 'N/A',
          contactInfo: userData.contactInfo || 'N/A',
          language: lang,
          submittedAt: serverTimestamp()
        });
      } catch (error) {
        const errInfo = {
          error: error instanceof Error ? error.message : String(error),
          operationType: 'create',
          path: 'responses',
          data: { ...userData, lang }
        };
        console.error('Firestore Response Error:', JSON.stringify(errInfo));
        // We still proceed to the final step to not block the user, 
        // but the error is logged for diagnosis.
      } finally {
        setIsSubmitting(false);
      }
    }

    setUserData(prev => {
      const newData = { ...prev };
      if (currentStep === 'START') newData.specialty = choice;
      if (currentStep === 'PAIN') newData.pain = choice;
      if (currentStep === 'TIMING') newData.timing = choice;
      if (currentStep === 'USE_CASE') newData.demoChoice = choice;
      return newData;
    });

    setCurrentStep(nextStep);
  }, [currentStep, userData, lang]);

  const goBack = useCallback(() => {
    setDirection(-1);
    const prevStepMap: Record<Step, Step> = {
      'START': 'WELCOME',
      'PAIN': 'START',
      'TIMING': 'PAIN',
      'USE_CASE': 'TIMING',
      'CONTACT_FORM': 'USE_CASE',
      'FINAL': 'WELCOME',
      'WELCOME': 'WELCOME'
    };
    setCurrentStep(prevStepMap[currentStep]);
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 'WELCOME':
        return (
          <div className="text-center space-y-6 md:space-y-8 py-2 md:py-4">
            <motion.div
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.1
              }}
              className="relative w-16 h-16 md:w-24 md:h-24 mx-auto"
            >
              <div className="absolute inset-0 bg-brand/20 blur-3xl rounded-full animate-pulse" />
              <motion.img 
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                src={LOGO_URL} 
                alt="Anzarseha Logo" 
                className="w-full h-full object-contain relative z-10"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="space-y-4 md:space-y-5">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-extrabold text-[#001B3D] leading-tight tracking-tight text-balance">
                {t.welcome.title.split(' ').map((word, i) => 
                  word === 'Clinical' || word === 'Efficiency' || word === 'الكفاءة' || word === 'السريرية' ? 
                  <span key={i} className="text-brand">{word} </span> : word + ' '
                )}
              </h2>
              <p className="text-slate-600 text-sm md:text-lg lg:text-xl leading-relaxed font-medium max-w-xl mx-auto italic opacity-90">
                {t.welcome.subtitle}
              </p>
            </div>
            
            <div className="pt-2 md:pt-4">
              <button 
                onClick={() => handleChoice('START')}
                className="group relative flex items-center gap-3 mx-auto px-8 py-3.5 bg-brand/90 backdrop-blur-md text-white rounded-2xl font-bold hover:bg-brand transition-all shadow-2xl shadow-brand/20 active:scale-95 text-base md:text-lg border border-white/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10">{t.welcome.cta}</span>
                <ArrowRight className={`w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform relative z-10 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 md:gap-6 text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand/40" />
                <span>{t.welcome.secure}</span>
              </div>
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-slate-200 rounded-full" />
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand/40" />
                <span>{t.welcome.efficient}</span>
              </div>
            </div>
          </div>
        );
      case 'START':
        return (
          <StepContainer 
            title={t.steps.start.title} 
            subtitle={t.steps.start.subtitle}
            options={t.steps.start.options}
            onSelect={handleChoice}
            lang={lang}
            t={t}
          />
        );
      case 'PAIN':
        return (
          <StepContainer 
            title={t.steps.pain.title} 
            subtitle={t.steps.pain.subtitle}
            options={t.steps.pain.options}
            onSelect={handleChoice}
            onBack={goBack}
            lang={lang}
            t={t}
          />
        );
      case 'TIMING':
        return (
          <StepContainer 
            title={t.steps.timing.title} 
            subtitle={t.steps.timing.subtitle}
            options={t.steps.timing.options}
            onSelect={handleChoice}
            onBack={goBack}
            lang={lang}
            t={t}
          />
        );
      case 'USE_CASE':
        const painChoice = userData.pain || '5';
        return (
          <StepContainer 
            title={t.steps.useCase.title} 
            subtitle={t.useCases[painChoice]}
            question={t.steps.useCase.question}
            options={t.steps.useCase.options}
            onSelect={handleChoice}
            onBack={goBack}
            lang={lang}
            t={t}
          />
        );
      case 'CONTACT_FORM':
        return (
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <motion.img 
                  src={LOGO_URL} 
                  className="w-6 h-6 object-contain"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  referrerPolicy="no-referrer"
                />
                <div className="h-3 w-[1px] bg-slate-200" />
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Anzarseha AI</span>
              </div>
              <button 
                onClick={goBack}
                className="flex items-center gap-1.5 text-slate-400 hover:text-brand transition-all text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] mb-2 md:mb-4 group"
              >
                <ArrowLeft className={`w-3 h-3 group-hover:-translate-x-0.5 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} /> 
                <span>{t.steps.back}</span>
              </button>
              <h2 className="text-xl md:text-3xl font-display font-extrabold text-[#001B3D] leading-tight tracking-tight text-balance">
                {t.steps.contact.title}
              </h2>
              <p className="text-slate-600 text-xs md:text-base leading-relaxed font-medium max-w-md">
                {t.steps.contact.subtitle}
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <input 
                  type="text"
                  placeholder={t.steps.contact.placeholder}
                  className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/40 bg-white/30 backdrop-blur-xl focus:bg-white/50 focus:border-brand/40 focus:ring-8 focus:ring-brand/5 transition-all duration-500 outline-none text-sm md:text-base font-bold text-[#001B3D] placeholder:text-slate-500 shadow-inner"
                  onChange={(e) => setUserData({ ...userData, contactInfo: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && userData.contactInfo) handleChoice('FINAL');
                  }}
                />
              </div>

              <button 
                disabled={!userData.contactInfo || isSubmitting}
                onClick={() => handleChoice('FINAL')}
                className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 bg-brand text-white rounded-xl md:rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 active:scale-95 text-sm md:text-base disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                ) : (
                  <>
                    <span className="relative z-10">{t.steps.contact.submit}</span>
                    <ArrowRight className={`w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform relative z-10 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </div>

            <div className="pt-1 md:pt-2 flex items-center justify-center gap-2 md:gap-3 text-[7px] md:text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">
              <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-brand/40" />
              <span>{t.steps.contact.privacy}</span>
            </div>
          </div>
        );
      case 'FINAL':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-6 md:py-10"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.img 
                src={LOGO_URL} 
                className="w-8 h-8 object-contain"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                referrerPolicy="no-referrer"
              />
              <div className="h-4 w-[1px] bg-slate-200" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Anzarseha AI</span>
            </div>

            <div className="relative inline-block">
              <div className="w-20 h-20 bg-brand/5 rounded-2xl flex items-center justify-center mx-auto rotate-6">
                <div className="w-16 h-16 bg-brand/10 rounded-xl flex items-center justify-center -rotate-6">
                  <CheckCircle2 className="w-8 h-8 text-brand" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-[#001B3D] tracking-tight">{t.steps.final.title}</h2>
              <div className="text-slate-700 max-w-md mx-auto text-sm md:text-base font-medium leading-relaxed">
                {t.steps.final.message.split('{contact}').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="inline-block px-2 py-0.5 bg-brand/5 text-brand font-bold rounded-md border border-brand/10 mx-1">
                        {userData.contactInfo}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => { setCurrentStep('WELCOME'); setUserData({}); }}
                className="group flex items-center gap-2 mx-auto px-8 py-3 bg-brand/90 backdrop-blur-md text-white rounded-xl font-bold hover:bg-brand transition-all shadow-xl shadow-brand/10 active:scale-95 text-sm border border-white/20"
              >
                <span>{t.steps.final.cta}</span>
                <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen md:h-screen bg-white font-sans text-slate-900 flex flex-col items-center justify-start md:justify-center p-4 md:p-6 overflow-x-hidden relative">
      
      {/* Background Decorative Elements for Glassmorphism */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-brand/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] bg-brand/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[10%] left-[40%] w-[20%] h-[20%] bg-brand/5 rounded-full blur-[60px]" />
      </div>

      {/* Header */}
      <header className="w-full max-w-xl mt-1 mb-2 md:mb-4 relative z-10 shrink-0 h-12 md:h-16">
        {/* Logo Section */}
        <div className="absolute top-0 left-0 md:-left-12 lg:-left-24 flex items-center gap-2 md:gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-brand/5 blur-lg rounded-full" />
            <img 
              src={LOGO_URL} 
              alt="Anzarseha Logo" 
              className="w-8 h-8 md:w-10 md:h-10 object-contain relative"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="h-5 md:h-6 w-[1px] bg-slate-200" />
          <div className="flex flex-col">
            <h1 className="text-sm md:text-lg font-display font-extrabold tracking-tight text-brand leading-none">{lang === 'ar' ? 'أنزار صحة' : 'Anzarseha'}</h1>
            <p className="text-[6px] md:text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">{t.footer.tagline}</p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="absolute top-0 right-0 md:-right-12 lg:-right-24">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/40 backdrop-blur-xl border border-white/40 rounded-full text-[10px] md:text-[11px] font-display font-black text-[#001B3D] hover:bg-white/60 hover:scale-105 transition-all shadow-xl shadow-brand/5 active:scale-95"
          >
            <Languages className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand" />
            <span className="tracking-tight uppercase">{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Form Container */}
      <main className="w-full max-w-xl glass-card rounded-xl md:rounded-[2rem] overflow-hidden relative z-10 flex flex-col min-h-0 max-h-[90vh] md:max-h-none">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 backdrop-blur-sm">
          <motion.div 
            className="h-full bg-brand relative"
            initial={{ width: "0%" }}
            animate={{ width: `${(Object.keys(userData).length / 5) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-r from-transparent to-white/40 blur-sm" />
            <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,53,107,0.4)]" />
          </motion.div>
        </div>

        <div className="p-4 md:p-8 lg:p-10 flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction * 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: direction * -20, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-4 md:mt-6 mb-4 relative z-10 shrink-0">
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-slate-200" />
          <span className="text-[9px] md:text-[10px] font-display font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-brand transition-colors cursor-default">
            {t.footer.copyright}
          </span>
          <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-slate-200" />
        </div>
      </footer>
    </div>
  );
}

interface StepProps {
  title: string;
  subtitle: string;
  question?: string;
  options: string[];
  onSelect: (choice: string) => void;
  onBack?: () => void;
  lang: Language;
  t: any;
}

const StepContainer = memo(({ title, subtitle, question, options, onSelect, onBack, lang, t }: StepProps) => {
  return (
    <div className="space-y-4 md:space-y-8 lg:space-y-10">
      <div className="space-y-2 md:space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <motion.img 
            src={LOGO_URL} 
            className="w-6 h-6 object-contain"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            referrerPolicy="no-referrer"
          />
          <div className="h-3 w-[1px] bg-slate-200" />
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Anzarseha AI</span>
        </div>
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-brand transition-all text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] mb-2 md:mb-4 group"
          >
            <ArrowLeft className={`w-3 h-3 group-hover:-translate-x-0.5 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} /> 
            <span>{t.steps.back}</span>
          </button>
        )}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-extrabold text-[#001B3D] leading-tight tracking-tight text-balance">
          {title}
        </h2>
        <p className="text-slate-600 text-[11px] md:text-sm lg:text-base leading-relaxed font-medium max-w-md">
          {subtitle}
        </p>
        {question && (
          <p className="text-brand text-xs md:text-sm font-bold mt-4 pt-4 border-t border-brand/5">
            {question}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 md:gap-3 lg:gap-4">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect((index + 1).toString())}
            className="group relative flex items-center gap-3 md:gap-4 p-3 md:p-4 lg:p-5 rounded-lg md:rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md hover:bg-white/50 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="w-6 h-6 md:w-8 lg:w-9 md:h-8 lg:h-9 rounded-md md:rounded-lg bg-brand/5 border border-brand/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand group-hover:border-brand transition-all duration-300 relative z-10">
              <span className="text-brand font-display font-black text-[10px] md:text-xs lg:text-sm group-hover:text-white transition-colors">
                {index + 1}
              </span>
            </div>
            <span className="flex-1 text-[11px] md:text-sm lg:text-base font-bold text-slate-800 group-hover:text-brand transition-colors leading-tight relative z-10">
              {option}
            </span>
            <ChevronRight className={`w-3 h-3 md:w-4 md:h-4 text-slate-300 group-hover:text-brand transition-all group-hover:translate-x-0.5 relative z-10 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </motion.button>
        ))}
      </div>

      <div className="pt-1 md:pt-2 flex items-center justify-center gap-2 md:gap-3 text-[7px] md:text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">
        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-brand/20 rounded-full animate-pulse" />
        <span>{t.steps.proceed}</span>
      </div>
    </div>
  );
});
