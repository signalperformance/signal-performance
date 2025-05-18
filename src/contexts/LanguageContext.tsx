
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.membership': 'Membership',
    'nav.about': 'About',
    'nav.founder': 'Founder',
    'nav.contact': 'Contact',
    'nav.login': 'Member Login',
    
    // Hero
    'hero.headline': 'Elevate Your Golf Game',
    'hero.subheadline': 'Taiwan\'s premier private club for elite golfers',
    'hero.cta': 'Join Waitlist',
    
    // Membership
    'membership.title': 'Exclusive Membership',
    'membership.subtitle': 'Experience a holistic approach to golf excellence',
    'membership.fitness.title': 'Semi-Private Fitness',
    'membership.fitness.description': '3 sessions per week of specialized golf fitness training',
    'membership.mental.title': 'Mental Coaching',
    'membership.mental.description': 'Monthly one-on-one sessions with our mental performance coach',
    'membership.simulator.title': 'Golf Simulator',
    'membership.simulator.description': '5 hours monthly access to state-of-the-art golf simulators',
    'membership.training.title': 'Independent Training',
    'membership.training.description': 'Unlimited access to our facilities for self-directed practice',
    
    // About
    'about.title': 'About Signal Performance',
    'about.subtitle': 'Redefining golf training through integration',
    'about.paragraph1': 'Signal Performance brings together physical conditioning, mental resilience, and technical skill development in one seamless experience.',
    'about.paragraph2': 'Our integrated approach recognizes that excellence in golf requires harmony between body, mind, and technique.',
    'about.paragraph3': 'We provide a sanctuary where elite golfers can focus on all aspects of their game without distraction.',
    
    // Founder
    'founder.title': 'Our Founder',
    'founder.name': 'Samuel Chen',
    'founder.credentials': 'PGA Certified Professional • Performance Coach • Former Asian Tour Player',
    'founder.bio': 'With over 15 years of experience in professional golf across Asia and North America, Samuel founded Signal Performance to bring a holistic training methodology to elite Taiwanese golfers. His approach combines Eastern discipline with Western sports science to create a uniquely effective training environment.',
    
    // Waitlist
    'waitlist.title': 'Join Our Waitlist',
    'waitlist.subtitle': 'Membership is limited and by application only',
    'waitlist.name': 'Full Name',
    'waitlist.email': 'Email Address',
    'waitlist.phone': 'Phone Number',
    'waitlist.handicap': 'Current Handicap',
    'waitlist.goals': 'Your Golf Goals',
    'waitlist.submit': 'Submit Application',
    'waitlist.success': 'Thank you for your interest! We will contact you soon.',
  },
  zh: {
    // Navigation
    'nav.home': '首頁',
    'nav.membership': '會員資格',
    'nav.about': '關於我們',
    'nav.founder': '創辦人',
    'nav.contact': '聯絡我們',
    'nav.login': '會員登入',
    
    // Hero
    'hero.headline': '提升您的高爾夫表現',
    'hero.subheadline': '台灣頂尖高爾夫球員的私人俱樂部',
    'hero.cta': '加入候補名單',
    
    // Membership
    'membership.title': '尊榮會員資格',
    'membership.subtitle': '體驗全方位的高爾夫卓越訓練',
    'membership.fitness.title': '半私人體能訓練',
    'membership.fitness.description': '每週三次專業高爾夫體能訓練',
    'membership.mental.title': '心理教練',
    'membership.mental.description': '每月一次一對一心理表現教練課程',
    'membership.simulator.title': '高爾夫模擬器',
    'membership.simulator.description': '每月五小時使用最先進的高爾夫模擬器',
    'membership.training.title': '獨立訓練',
    'membership.training.description': '無限制使用我們的設施進行自主練習',
    
    // About
    'about.title': '關於 Signal Performance',
    'about.subtitle': '透過整合重新定義高爾夫訓練',
    'about.paragraph1': 'Signal Performance 將身體鍛鍊、心理韌性和技術技能發展融合為一體，提供無縫體驗。',
    'about.paragraph2': '我們的整合方法認識到，高爾夫卓越需要身體、心靈和技術之間的和諧。',
    'about.paragraph3': '我們提供一個聖所，讓精英高爾夫球手能夠專注於他們的比賽各個方面，不受干擾。',
    
    // Founder
    'founder.title': '我們的創辦人',
    'founder.name': '陳志明',
    'founder.credentials': 'PGA認證專業人士 • 表現教練 • 前亞巡賽球員',
    'founder.bio': '擁有超過15年橫跨亞洲和北美的專業高爾夫經驗，志明創立了Signal Performance，為台灣精英高爾夫球手帶來全面的訓練方法。他的方法將東方的紀律與西方的運動科學相結合，創造了一個獨特而有效的訓練環境。',
    
    // Waitlist
    'waitlist.title': '加入我們的候補名單',
    'waitlist.subtitle': '會員名額有限，僅接受申請',
    'waitlist.name': '全名',
    'waitlist.email': '電子郵件',
    'waitlist.phone': '電話號碼',
    'waitlist.handicap': '目前差點',
    'waitlist.goals': '您的高爾夫目標',
    'waitlist.submit': '提交申請',
    'waitlist.success': '感謝您的興趣！我們將盡快與您聯繫。',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
