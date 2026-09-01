import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  LayoutGrid, 
  List, 
  Timer, 
  BarChart3, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  X, 
  Wand2, 
  Volume2, 
  Search, 
  Zap, 
  HelpCircle, 
  MousePointerClick, 
  Info,
  Languages,
  Check,
  CheckSquare,
  Trophy,
  Users,
  ExternalLink
} from 'lucide-react';
import { soundFx } from '../utils/effects';

const TOUR_STEPS_I18N = [
  {
    id: 'welcome',
    targetSelector: null,
    icon: Sparkles,
    gradient: 'from-violet-600 via-indigo-600 to-cyan-500',
    en: {
      badge: 'Welcome to Your task Manager',
      title: 'Smart Task Intelligence Workspace',
      desc: 'All-in-one productivity workspace uniting AI smart parsing, drag-and-drop Kanban, quick lists, and Zen Pomodoro timers.',
      howTo: 'Click "Start Tour" below to walk through key buttons highlighted directly on your screen.',
      tip: '💡 Replay anytime using the "?" help icon in the Navbar.',
      nextBtn: 'Start Tour 🚀'
    },
    bn: {
      badge: 'Your task Manager এ স্বাগতম',
      title: 'স্মার্ট টাস্ক ও ফোকাস ওয়ার্কস্পেস',
      desc: 'AI টাস্ক ইনপুট, ড্র্যাগ-অ্যান্ড-ড্রপ কানবান, লিস্ট ভিউ এবং পোমোডোরো টাইমারকে একত্রিত করা একটি আধুনিক প্রোডাক্টিভিটি অ্যাপ।',
      howTo: 'স্ক্রিনের প্রতিটি গুরুত্বপূর্ণ বাটন চিনে নিতে নিচে "ট্যুর শুরু করুন" বাটনে ক্লিক করুন।',
      tip: '💡 যেকোনো সময় Navbar-এর "?" আইকনে ক্লিক করে পুনরায় দেখতে পারেন।',
      nextBtn: 'ট্যুর শুরু করুন 🚀'
    }
  },
  {
    id: 'smart-input',
    targetSelector: '#tour-smart-input',
    icon: Wand2,
    gradient: 'from-violet-600 to-purple-600',
    en: {
      badge: '1 · AI Natural Language Input',
      title: 'Smart Task Creation Bar',
      desc: 'Type your raw stream of thought (e.g. "Finish report tomorrow at 4pm #work !high ~45m") to extract dates, tags, and priority automatically.',
      howTo: 'Press Enter to create instantly, or click "🪄 Formalize" to generate structured AI subtasks.',
      tip: '✨ Features live typo spellcheck and a 1-click "✕" clear button.',
      nextBtn: 'Next Feature'
    },
    bn: {
      badge: '১ · স্মার্ট AI টাস্ক ইনপুট',
      title: 'স্মার্ট টাস্ক তৈরির ইনপুট বার',
      desc: 'স্বাভাবিক লেখালিখি থেকেই তারিখ, সময়, হ্যাশট্যাগ (#work), সময়কাল (~45m) এবং প্রায়োরিটি নিজে থেকেই বুঝে নেয়।',
      howTo: 'Enter চাপলেই টাস্ক তৈরি হবে, অথবা "🪄 Formalize" বাটনে ক্লিক করে AI সাবটাস্ক তৈরি করুন।',
      tip: '✨ ভুল বানান ঠিক করার পরামর্শ ও ১-ক্লিক ক্লিয়ার বাটন রয়েছে।',
      nextBtn: 'পরবর্তী ফিচার'
    }
  },
  {
    id: 'list-card',
    targetSelector: '#tour-list-first-task',
    icon: CheckSquare,
    gradient: 'from-emerald-600 to-teal-600',
    en: {
      badge: '2 · Interactive Task Actions',
      title: '1-Tap Status & Priority Cyclers',
      desc: 'Interactive task cards featuring quick checkbox completion, creation time ago, and inline edit controls.',
      howTo: 'Click the Priority badge (HIGH/MED/LOW) to cycle urgency, or drag the grip handle (⠿) to reorder.',
      tip: '⚡ Click ✏️ on any task to open the full detailed task editor.',
      nextBtn: 'Next Feature'
    },
    bn: {
      badge: '২ · ইন্টারেক্টিভ টাস্ক কার্ড',
      title: '১-ট্যাপ প্রায়োরিটি ও স্ট্যাটাস চেঞ্জার',
      desc: 'কোনো মোডাল না খুলেই সরাসরি প্রায়োরিটি, স্ট্যাটাস পরিবর্তন এবং কতক্ষণ আগে তৈরি হয়েছে তা দেখতে পারেন।',
      howTo: 'প্রায়োরিটি ব্যাজে (HIGH/MED/LOW) ক্লিক করে গুরুত্ব পরিবর্তন করুন, অথবা গ্রিপ হ্যান্ডেল (⠿) দিয়ে সিরিয়াল সাজান।',
      tip: '⚡ বিস্তারিত এডিট করতে ✏️ আইকনে চাপ দিন।',
      nextBtn: 'পরবর্তী ফিচার'
    }
  },
  {
    id: 'view-switcher',
    targetSelector: '#tour-view-switcher',
    icon: LayoutGrid,
    gradient: 'from-cyan-600 to-blue-600',
    en: {
      badge: '3 · View Switcher',
      title: 'Kanban, List, Analytics & History',
      desc: '4-in-1 layout toggle keeping all your tasks synchronized across different visualization workflows.',
      howTo: 'Click "Kanban", "List", "Analytics", or "History" to pivot views seamlessly.',
      tip: '🚀 View deleted tasks with exact timestamps inside the History view.',
      nextBtn: 'Next Feature'
    },
    bn: {
      badge: '৩ · ভিউ সুইচার',
      title: 'কানবান, লিস্ট, অ্যানালিটিক্স ও হিস্ট্রি',
      desc: '৪টি ভিন্ন ভিউ যার মাধ্যমে আপনার কাজের স্টাইল অনুযায়ী টাস্ক পরিচালনা ও অ্যানালিটিক্স দেখতে পারবেন।',
      howTo: '"Kanban", "List", "Analytics" বা "History" বাটনে ক্লিক করে ভিউ পরিবর্তন করুন।',
      tip: '🚀 হিস্ট্রি ভিউতে গিয়ে যেকোনো সময় ডিলিট হওয়া টাস্ক রিস্টোর করতে পারেন।',
      nextBtn: 'পরবর্তী ফিচার'
    }
  },
  {
    id: 'focus-timer',
    targetSelector: '#tour-focus-timer',
    icon: Timer,
    gradient: 'from-emerald-600 to-teal-600',
    en: {
      badge: '4 · Zen Focus Pomodoro',
      title: 'Live Navbar Timer & Sprints',
      desc: 'Customizable Focus (25m), Short (5m), and Long Break (15m) sessions that tick live right in the Navbar.',
      howTo: 'Start a sprint and navigate freely—it continues ticking with reload protection.',
      tip: '🔔 Plays a soothing chime and confetti celebration upon countdown completion!',
      nextBtn: 'Next Feature'
    },
    bn: {
      badge: '৪ · জেন ফোকাস পোমোডোরো',
      title: 'লাইভ ন্যাভবার টাইমার ও ফোকাস',
      desc: 'ফোকাস (25m), শর্ট ব্রেক (5m) এবং লং ব্রেক (15m) টাইমার যা Navbar-এ লাইভ চলতে থাকে।',
      howTo: 'Start দিয়ে যেকোনো পেজে যান, ব্যাকগ্রাউন্ডে টাইম কাউন্টডাউন চলবে।',
      tip: '🔔 টাইমার শেষ হলে সুরেলা বেল চিম এবং কনফেটি সেলিব্রেশন দেখতে পাবেন!',
      nextBtn: 'পরবর্তী ফিচার'
    }
  },
  {
    id: 'search-bar',
    targetSelector: '#tour-search-bar',
    icon: Search,
    gradient: 'from-indigo-600 to-violet-600',
    en: {
      badge: '5 · Instant Search',
      title: 'Real-Time Task & Tag Filter',
      desc: 'A lightning-fast search engine matching task names, hashtags (#dev), and priority levels.',
      howTo: 'Type keywords or tags like "#work" to isolate critical tasks with zero lag.',
      tip: '🔍 Filters results across all columns and lists instantly.',
      nextBtn: 'Next Feature'
    },
    bn: {
      badge: '৫ · দ্রুত সার্চ বার',
      title: 'রিয়েল-টাইম টাস্ক ফিল্টার ও সার্চ',
      desc: 'টাস্কের নাম, হ্যাশট্যাগ (#work, #dev) এবং প্রায়োরিটি দিয়ে মুহূর্তের মধ্যে খোঁজার সুপারফাস্ট সার্চ।',
      howTo: 'টাস্কের নাম বা হ্যাশট্যাগ লিখে সার্চ করুন।',
      tip: '🔍 টাইপ করার সাথে সাথেই লাইভ ফিল্টার হয়।',
      nextBtn: 'পরবর্তী ফিচার'
    }
  },
  {
    id: 'sound-toggle',
    targetSelector: '#tour-sound-toggle',
    icon: Volume2,
    gradient: 'from-amber-500 to-rose-500',
    en: {
      badge: '6 · Tactile Audio FX',
      title: 'Interactive Web Audio Feedback',
      desc: 'Zero-dependency Web Audio FX engine providing satisfying chimes and click sounds.',
      howTo: 'Click this speaker icon anytime to toggle sound effects on or off.',
      tip: '🎵 All sound effects are synthesize-generated locally without external assets.',
      nextBtn: 'Next Feature'
    },
    bn: {
      badge: '৬ · অডিও ও সাউন্ড এফেক্টস',
      title: 'ইন্টারেক্টিভ সাউন্ড ও ফিডব্যাক',
      desc: 'ক্লিক, ড্র্যাগ-অ্যান্ড-ড্রপ এবং টাস্ক সমাপ্তিতে চমৎকার সাউন্ড ফিডব্যাক প্রদান করে।',
      howTo: 'যেকোনো সময় সাউন্ড চালু বা বন্ধ করতে এই স্পিকার আইকনে ক্লিক করুন।',
      tip: '🎵 সাউন্ড সম্পূর্ণ ব্রাউজারে তৈরি হয়, কোনো এক্সটার্নাল ফাইলের প্রয়োজন হয় না।',
      nextBtn: 'পরবর্তী ফিচার'
    }
  },
  {
    id: 'stats-badge',
    targetSelector: '#tour-stats-badge',
    icon: Trophy,
    gradient: 'from-violet-600 to-indigo-600',
    en: {
      badge: '7 · Progress Scoreboard',
      title: 'Live Task Completion & XP Counter',
      desc: 'A live scoreboard showing completed vs total tasks alongside gamified XP points and streaks.',
      howTo: 'Completing tasks automatically rewards +50 XP per task and levels up your Mastery Level.',
      tip: '🏆 Head to Analytics view to inspect your Eisenhower matrix and focus minutes!',
      nextBtn: 'Next Feature'
    },
    bn: {
      badge: '৭ · গেমিফাইড প্রগ্রেস ট্র্যাকার',
      title: 'লাইভ টাস্ক কমপ্লিশন ও এক্সপি কাউন্টার',
      desc: 'মোট টাস্ক ও সম্পন্ন হওয়া টাস্কের অনুপাত এবং XP স্কোর প্রদর্শন করে।',
      howTo: 'যেকোনো টাস্ক সম্পন্ন করলে প্রতি টাস্কে +৫০ XP যুক্ত হয়।',
      tip: '🏆 বিস্তারিত স্ট্যাটস দেখতে Analytics ভিউতে যান!',
      nextBtn: 'পরবর্তী ফিচার'
    }
  },
  {
    id: 'footer-connect',
    targetSelector: '#tour-footer-connect',
    icon: Users,
    gradient: 'from-cyan-600 to-blue-600',
    en: {
      badge: '8 · Connect & Developer Profile',
      title: 'Developer Contacts & Social Links',
      desc: 'Direct connection channels to reach out to the developer (Mahadeb Maity) via LinkedIn, GitHub, Facebook, and Email.',
      howTo: 'Click "Follow developer" or any social badge in the footer to connect directly.',
      tip: '🚀 Built with high-performance modern web technologies.',
      nextBtn: 'Finish & Explore 🚀'
    },
    bn: {
      badge: '৮ · ডেভেলপার যোগাযোগ ও সোশ্যাল লিঙ্ক',
      title: 'ডেভেলপার প্রোফাইল ও সোশ্যাল কানেকশন',
      desc: 'ডেভেলপার (Mahadeb Maity) এর সাথে সরাসরি যোগাযোগের মাধ্যম (LinkedIn, GitHub, Facebook, এবং Email)।',
      howTo: 'ফুটারের সোশ্যাল আইকনগুলোতে ক্লিক করে LinkedIn, GitHub বা ইমেইলে যোগাযোগ করুন।',
      tip: '🚀 সর্বাধুনিক ওয়েব প্রযুক্তির সাহায্যে ডেভেলপ করা হয়েছে।',
      nextBtn: 'সম্পন্ন করুন ও শুরু করুন 🚀'
    }
  }
];

export default function OnboardingTour({ isOpen, onClose }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: null, bottom: null, left: 16, width: 380, maxHeight: 340 });
  
  // Language State: 'en' by default, switchable to 'bn'
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('tour_language') || 'en';
    } catch {
      return 'en';
    }
  });

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    soundFx.playPop();
    try {
      localStorage.setItem('tour_language', newLang);
    } catch (e) {
      console.warn('Storage error', e);
    }
  };

  const currentStep = TOUR_STEPS_I18N[currentStepIdx];
  const stepContent = currentStep ? (currentStep[lang] || currentStep.en) : null;
  const StepIcon = currentStep?.icon || Sparkles;
  const isFirstStep = currentStepIdx === 0;
  const isLastStep = currentStepIdx === TOUR_STEPS_I18N.length - 1;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        soundFx.playPop();
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (isLastStep) {
          soundFx.playCompletionChime();
          onClose();
        } else {
          setCurrentStepIdx((p) => p + 1);
          soundFx.playPop();
        }
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        setCurrentStepIdx((p) => p - 1);
        soundFx.playPop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFirstStep, isLastStep, onClose]);

  // Position calculation and viewport tracking
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    if (!currentStep.targetSelector) {
      setTargetRect(null);
      return;
    }

    const calculatePosition = () => {
      const el = document.querySelector(currentStep.targetSelector);
      if (!el) {
        setTargetRect(null);
        return;
      }

      const isNavbarItem = [
        '#tour-view-switcher',
        '#tour-focus-timer',
        '#tour-search-bar',
        '#tour-sound-toggle',
        '#tour-stats-badge'
      ].includes(currentStep.targetSelector);

      if (isNavbarItem || currentStep.id === 'smart-input') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (currentStep.id === 'footer-connect') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const elRect = el.getBoundingClientRect();
        const absoluteTop = elRect.top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, absoluteTop - 100),
          behavior: 'smooth'
        });
      }
      
      const updateRect = () => {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);

        const popoverWidth = Math.min(380, window.innerWidth - 32);
        const estimatedHeight = 240;

        let top = null;
        let bottom = null;

        // Smart clearance check
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow >= estimatedHeight + 20) {
          top = rect.bottom + 16;
        } else if (spaceAbove >= estimatedHeight + 20) {
          bottom = window.innerHeight - rect.top + 16;
        } else {
          bottom = 20;
        }

        // Horizontal alignment: Center over target, clamped to screen edges
        const targetCenter = rect.left + rect.width / 2;
        let left = targetCenter - popoverWidth / 2;
        left = Math.max(16, Math.min(left, window.innerWidth - popoverWidth - 16));

        // Calculate safe maxHeight
        let maxHeight = 300;
        if (top !== null) {
          maxHeight = Math.max(180, window.innerHeight - top - 16);
        } else if (bottom !== null) {
          maxHeight = Math.max(180, window.innerHeight - bottom - 16);
        }

        setPopoverPos({ top, bottom, left, width: popoverWidth, maxHeight });
      };

      updateRect();
      const t1 = setTimeout(updateRect, 100);
      const t2 = setTimeout(updateRect, 300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };

    const timeout = setTimeout(calculatePosition, 60);
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [isOpen, currentStepIdx, currentStep]);

  if (!isOpen || !stepContent) return null;

  const handleNext = () => {
    if (isLastStep) {
      soundFx.playCompletionChime();
      onClose();
    } else {
      setCurrentStepIdx((prev) => prev + 1);
      soundFx.playPop();
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIdx((prev) => prev - 1);
      soundFx.playPop();
    }
  };

  const handleSkip = () => {
    soundFx.playPop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      
      {/* Dynamic SVG Spotlight Cutout Mask */}
      {targetRect ? (
        <svg className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-300 z-40">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx="16"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(3, 7, 18, 0.82)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      ) : (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-all duration-300 z-40"></div>
      )}

      {/* High-visibility Pulsing Neon Halo Ring (Clean highlight without obstructing text tags) */}
      {targetRect && (
        <div
          className="fixed pointer-events-none rounded-2xl ring-4 ring-violet-400/90 border border-white/80 shadow-[0_0_50px_rgba(139,92,246,0.85)] transition-all duration-300 z-50 animate-pulse"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12
          }}
        />
      )}

      {/* Floating Guided Popover Card (Guaranteed Always-Visible Controls) */}
      <div
        className={`fixed z-50 transition-all duration-300 pointer-events-auto ${
          !targetRect ? 'inset-0 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md' : ''
        }`}
        style={
          targetRect
            ? {
                top: popoverPos.top !== null ? `${popoverPos.top}px` : 'auto',
                bottom: popoverPos.bottom !== null ? `${popoverPos.bottom}px` : 'auto',
                left: `${popoverPos.left}px`,
                width: `${popoverPos.width}px`
              }
            : undefined
        }
      >
        <div 
          className="glass-panel w-full max-w-[420px] rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-4.5 relative flex flex-col animate-scaleIn backdrop-blur-2xl mx-auto"
          style={{ maxHeight: `${popoverPos.maxHeight || 340}px` }}
        >
          
          {/* Top Row: Badge, Language Switcher Toggle & Skip Button (Fixed Header) */}
          <div className="flex items-center justify-between gap-2 shrink-0 pb-2">
            <span className="text-[10px] sm:text-[11px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 truncate">
              {stepContent.badge}
            </span>

            <div className="flex items-center gap-2 shrink-0">
              {/* Language Switcher Toggle (EN | বাংলা) */}
              <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-white/15">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    lang === 'en'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Switch to English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('bn')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    lang === 'bn'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="বাংলায় দেখুন"
                >
                  বাংলা
                </button>
              </div>

              {/* Skip Button */}
              <button
                onClick={handleSkip}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title={lang === 'bn' ? 'ট্যুর বন্ধ করুন' : 'Skip Tour'}
              >
                <span className="text-[11px]">{lang === 'bn' ? 'স্কিপ' : 'Skip'}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hero Banner with Step Icon */}
          <div className={`p-2.5 rounded-2xl bg-gradient-to-r ${currentStep.gradient} text-white shadow-xl flex items-center gap-3 shrink-0 mb-2`}>
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shrink-0">
              <StepIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] text-white/80 font-bold uppercase tracking-widest block">
                {lang === 'bn' ? `ধাপ ${currentStepIdx + 1} / ${TOUR_STEPS_I18N.length}` : `Step ${currentStepIdx + 1} of ${TOUR_STEPS_I18N.length}`}
              </span>
              <h3 className="text-xs sm:text-sm font-black leading-tight text-white drop-shadow-sm truncate">
                {stepContent.title}
              </h3>
            </div>
          </div>

          {/* Streamlined Content Body (No Scrollbars, Guaranteed Compact Height) */}
          <div className="no-scrollbar space-y-1.5 text-xs overflow-y-auto pr-0.5 flex-1 min-h-0 mb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            {/* Description Card */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
              <p className="text-slate-200 text-xs leading-snug">{stepContent.desc}</p>
              {stepContent.howTo && (
                <p className="text-cyan-300 text-[11px] leading-snug font-medium flex items-center gap-1 pt-0.5">
                  <span className="text-cyan-400 font-bold">👉</span>
                  <span>{stepContent.howTo}</span>
                </p>
              )}
            </div>

            {/* Pro Tip */}
            {stepContent.tip && (
              <div className="p-1.5 rounded-xl bg-violet-500/10 border border-violet-500/25 text-violet-200 text-[10.5px] font-medium">
                {stepContent.tip}
              </div>
            )}
          </div>

          {/* Sticky Pinned Footer Navigation Controls (ALWAYS 100% VISIBLE) */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 shrink-0 mt-auto bg-slate-950/40 rounded-b-2xl">
            {/* Step Indicators */}
            <div className="flex items-center gap-1">
              {TOUR_STEPS_I18N.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentStepIdx(idx);
                    soundFx.playPop();
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentStepIdx === idx
                      ? 'w-5 bg-gradient-to-r from-violet-500 to-indigo-500 shadow-md shadow-violet-500/30'
                      : 'w-1.5 bg-slate-800 hover:bg-slate-700'
                  }`}
                  title={`Jump to Step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-1.5">
              {!isFirstStep && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'পূর্ববর্তী' : 'Back'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-1 shadow-lg shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer"
              >
                <span>{stepContent.nextBtn}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
