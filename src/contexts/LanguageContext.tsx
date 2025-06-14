import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh';

type LanguageContextType = {
  language: Language;
  t: (key: string) => string;
  toggleLanguage: () => void;
};

const translations = {
  en: {
    hero: {
      title: "Unlock Your Athletic Potential",
      description: "Elevate your performance with our integrated approach to training, recovery, and wellness.",
      button: "Explore Our Programs",
    },
    navbar: {
      home: "Home",
      about: "About",
      services: "Services",
      contact: "Contact",
      membership: "Membership",
      assessment: "Assessment",
      schedule: "Schedule",
    },
    about: {
      title: "About Signal Performance",
      description: "We are dedicated to helping athletes of all levels achieve their peak performance through personalized training and cutting-edge techniques.",
      valuesTitle: "Our Core Values",
      value1: "Excellence",
      value2: "Innovation",
      value3: "Community",
    },
    services: {
      title: "Our Services",
      service1: "Personalized Training Programs",
      service2: "Sports Rehabilitation",
      service3: "Performance Analysis",
    },
    contact: {
      title: "Contact Us",
      description: "Get in touch to learn more about our programs and how we can help you reach your goals.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message",
    },
    membership: {
      title: "Membership Options",
      description: "Choose the membership that best fits your needs and start your journey to peak performance today.",
      option1: "Basic",
      option2: "Pro",
      option3: "Elite",
    },
    assessment: {
      title: "Unlock Your Potential with Comprehensive Assessment",
      description: "Our detailed assessment process provides a clear understanding of your current condition and performance capabilities. We identify key areas for improvement, paving the way for a targeted and effective training strategy.",
      joint: {
        title: "Joint Mobility Assessment",
        description: "Evaluate joint range of motion and identify any restrictions that may impact movement efficiency and increase injury risk."
      },
      strength: {
        title: "Strength & Power Assessment",
        description: "Measure muscle strength, power output, and imbalances to optimize training programs for maximum performance gains."
      },
      metabolic: {
        title: "Metabolic Conditioning Assessment",
        description: "Assess cardiovascular fitness, endurance, and metabolic efficiency to improve energy systems and overall stamina."
      },
      body: {
        title: "Body Composition Analysis",
        description: "Analyze body fat percentage, muscle mass, and hydration levels to fine-tune nutrition and training strategies for optimal results."
      },
      golf: {
        title: "Golf Performance Assessment",
        description: "Evaluate golf-specific skills, swing mechanics, and physical conditioning to enhance performance on the course."
      }
    },
    philosophy: {
      title: "Our Training Philosophy",
      description: "At Signal Performance, we believe in a holistic approach to athletic development. Our philosophy is built on the principles of personalized training, scientific rigor, and continuous improvement.",
      principle1: "Personalized Training",
      principle2: "Scientific Rigor",
      principle3: "Continuous Improvement",
    },
    weeklySchedule: {
      title: "Weekly Group Schedule",
      description: "Our weekly schedule is designed to accommodate a variety of needs and skill levels. All sessions are led by our expert coaches.",
      legend: "Legend:",
      legendPro: "PR: Pro-only",
      legendOpen: "OP: Open to all members",
    },
    gettingStarted: {
      title: "Your Journey to Peak Performance",
      description: "Follow our structured process to unlock your full potential. The initial phase costs 12,000 NTD and sets the foundation for your ongoing success.",
      step1: {
        title: "Baseline Assessment",
        description: "A comprehensive evaluation of your body and skills to identify your unique needs. Details are in the section above."
      },
      step2: {
        title: "1-on-1 Coaching",
        description: "Three personalized coaching sessions to address key areas for improvement found in your assessment."
      },
      step3: {
        title: "Comprehensive Report",
        description: "Receive a detailed report with insights from your assessment and coaching, and a clear path forward."
      },
      step4: {
        title: "Join the Monthly Program",
        description: "Seamlessly transition into our ongoing membership to continue your progress with consistent support."
      },
    },
  },
  zh: {
    hero: {
      title: "釋放您的運動潛能",
      description: "通過我們整合的訓練、恢復和健康方法，提升您的表現。",
      button: "探索我們的項目",
    },
    navbar: {
      home: "首頁",
      about: "關於",
      services: "服務",
      contact: "聯繫方式",
      membership: "會員",
      assessment: "評估",
      schedule: "時間表",
    },
    about: {
      title: "關於 Signal Performance",
      description: "我們致力於幫助各個級別的運動員通過個性化訓練和尖端技術實現他們的最佳表現。",
      valuesTitle: "我們的核心價值",
      value1: "卓越",
      value2: "創新",
      value3: "社區",
    },
    services: {
      title: "我們的服務",
      service1: "個性化訓練計劃",
      service2: "運動康復",
      service3: "性能分析",
    },
    contact: {
      title: "聯繫我們",
      description: "請聯繫我們，詳細了解我們的計劃以及我們如何幫助您實現目標。",
      name: "姓名",
      email: "電子郵件",
      message: "信息",
      send: "發送消息",
    },
    membership: {
      title: "會員選項",
      description: "選擇最適合您需求的會員資格，立即開始您的巔峰表現之旅。",
      option1: "基本",
      option2: "專業",
      option3: "精英",
    },
    assessment: {
      title: "通過綜合評估釋放您的潛力",
      description: "我們詳細的評估過程可以清楚地了解您當前的狀況和表現能力。 我們確定需要改進的關鍵領域，為有針對性的有效訓練策略鋪平道路。",
      joint: {
        title: "關節活動度評估",
        description: "評估關節活動範圍，並確定可能影響運動效率並增加受傷風險的任何限制。"
      },
      strength: {
        title: "力量與爆發力評估",
        description: "測量肌肉力量、爆發力輸出和不平衡，以優化訓練計劃，從而最大限度地提高運動表現。"
      },
      metabolic: {
        title: "代謝調節評估",
        description: "評估心血管健康、耐力和代謝效率，以改善能量系統和整體耐力。"
      },
      body: {
        title: "身體成分分析",
        description: "分析體脂百分比、肌肉質量和水合水平，以微調營養和訓練策略，以獲得最佳效果。"
      },
      golf: {
        title: "高爾夫球性能評估",
        description: "評估高爾夫球的特定技能、揮桿機制和身體狀況，以提高球場上的表現。"
      }
    },
    philosophy: {
      title: "我們的訓練理念",
      description: "在 Signal Performance，我們相信運動發展的整體方法。 我們的理念建立在個性化訓練、科學嚴謹和持續改進的原則之上。",
      principle1: "個性化訓練",
      principle2: "科學嚴謹",
      principle3: "持續改進",
    },
    weeklySchedule: {
      title: "每週團體課表",
      description: "我們的週度計畫旨在滿足各種需求和技能水平。所有課程均由我們的專業教練指導。",
      legend: "圖例說明：",
      legendPro: "PR：僅限職業選手",
      legendOpen: "OP：所有會員皆可參加",
    },
    gettingStarted: {
      title: "您通往巔峰表現的旅程",
      description: "遵循我們結構化的流程，釋放您的全部潛力。初始階段費用為新台幣 12,000 元，為您持續的成功奠定基礎。",
      step1: {
        title: "基準評估",
        description: "對您的身體和技能進行全面評估，以確定您的獨特需求。詳情請見上方章節。"
      },
      step2: {
        title: "一對一指導",
        description: "三堂個人化指導課程，針對您評估中發現的關鍵改進領域。"
      },
      step3: {
        title: "綜合報告",
        description: "收到一份詳細報告，其中包含您評估和指導的見解，以及明確的前進道路。"
      },
      step4: {
        title: "加入月度計畫",
        description: "無縫過渡到我們的持續會員資格，以在持續的支持下繼續您的進步。"
      },
    },
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null;
  } catch (error) {
    return false;
  }
};

// Helper function to get saved language from localStorage
const getSavedLanguage = (): Language => {
  if (!isLocalStorageAvailable()) {
    return 'en';
  }
  
  try {
    const saved = localStorage.getItem('signal-performance-language');
    if (saved === 'en' || saved === 'zh') {
      return saved;
    }
  } catch (error) {
    // Fails silently
  }
  return 'en'; // Default to English for first-time visitors
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language from localStorage after component mounts
  useEffect(() => {
    const savedLanguage = getSavedLanguage();
    setLanguage(savedLanguage);
    setIsInitialized(true);
  }, []);

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return; 
    
    if (!isLocalStorageAvailable()) return;

    try {
      localStorage.setItem('signal-performance-language', language);
    } catch (error) {
      // Fails silently
    }
  }, [language, isInitialized]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
    }
    return result || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'zh' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
