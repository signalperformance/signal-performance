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
    'nav.contact': 'Join Waitlist',
    'nav.login': 'Member Login',
    
    // Hero
    'hero.headline': 'Where Pro Golfers Train to Perform',
    'hero.subheadline': 'Integrated physical, mental, and skill training in one private facility.',
    'hero.cta.waitlist': 'Join the Waitlist',
    'hero.cta.membership': 'Explore Membership',
    
    // Membership
    'membership.title': 'What\'s Included in Your Membership',
    'membership.price': 'NT$18,000/month',
    'membership.subtitle': 'All-inclusive membership.',
    'membership.physical.title': 'Physical Training',
    'membership.physical.assessment': 'Quarterly Performance Assessments',
    'membership.physical.assessment.description': 'Quarterly assessments provide objective data to guide your individualized training plan.',
    'membership.physical.coaching': '1-on-2 Fitness Coaching (3x/Week)',
    'membership.physical.coaching.description': 'Train in a semi-private setting with a fully personalized program aligned with your goals.',
    'membership.physical.train': 'Train On Your Own',
    'membership.physical.train.description': 'Use the facility outside of coached sessions to complete your personalized program—just book your time and get to work.',
    'membership.physical.app': 'Mobile Training App',
    'membership.physical.app.description': 'Access your program anytime — in the facility, on the road, or at home — so you can train consistently anywhere.',
    
    'membership.mental.title': 'Mental Training',
    'membership.mental.coaching': '1-on-1 Mental Coaching (1x/Month)',
    'membership.mental.coaching.description': 'Meet with a certified mental performance consultant for personalized sessions to enhance performance on and off the course.',
    'membership.mental.plan': 'Structured Mental Training Plan',
    'membership.mental.plan.description': 'Follow a personalized plan with targeted exercises to build mental skills between sessions.',
    'membership.mental.toolkit': 'Home Practice Toolkit',
    'membership.mental.toolkit.description': 'Receive a heart rate monitor and mobile app to practice skills learned in coaching sessions and track progress between sessions.',
    
    'membership.golf.title': 'Golf Training',
    'membership.golf.simulator': 'Simulator Access (5 hrs/month)',
    'membership.golf.simulator.description': 'Train with state-of-the-art technology — anytime that fits your schedule.',
    'membership.golf.putting': 'Putting Green Access (2 hrs/month)',
    'membership.golf.putting.description': 'Refine your mechanics and alignment with cutting-edge tools — on your own schedule.',
    'membership.golf.tracking': 'On-Course Performance Tracking',
    'membership.golf.tracking.description': 'All members receive access to golf stat tracking software, allowing us to monitor your competitive performance and adjust your training focus accordingly.',
    
    'membership.facility.title': 'Facility Features',
    'membership.facility.refresh': 'Refresh & Recharge',
    'membership.facility.refresh.description': 'Includes modern shower and kitchenette with complimentary and member-priced options.',
    'membership.facility.atmosphere': 'Private Training Environment',
    'membership.facility.atmosphere.description': 'Capped at 20 members for a quiet, focused, and highly accessible training environment.',
    
    // Assessment Process
    'assessment.title': 'Our Assessment Process',
    'assessment.description': 'Every quarter, members complete a full assessment across five essential areas to ensure their training is aligned, effective, and progressing toward their performance goals.',
    
    'assessment.joint.title': 'Joint Health',
    'assessment.joint.description': 'We assess the passive and active range of motion of every major joint to identify movement limitations and their root causes. These insights inform your fitness program to help reduce injury risk and support long-term joint health. We also track changes in range of motion over time to monitor progress and guide ongoing adjustments.',
    
    'assessment.strength.title': 'Maximal Strength',
    'assessment.strength.description': 'We assess maximal strength using compound lifts like the bench press and deadlift to measure how effectively your neuromuscular system produces force. As maximal strength increases, you\'re able to move lighter loads — like a golf club — more quickly, directly supporting gains in swing speed.',
    
    'assessment.metabolic.title': 'Metabolic Testing',
    'assessment.metabolic.description': 'We assess how efficiently your body produces and uses energy through aerobic and anaerobic testing. This allows us to define your personalized heart rate zones and design a conditioning program that improves endurance, enhances recovery, and supports sustained performance over multiple rounds of competitive golf.',
    
    'assessment.body.title': 'Body Composition',
    'assessment.body.description': 'We track changes in muscle mass and body fat percentage to evaluate whether your training is producing the right adaptations. This gives us more reliable feedback than body weight alone and helps ensure your progress aligns with performance goals.',
    
    'assessment.golf.title': 'Golf Performance Assessment',
    'assessment.golf.description': 'We measure distance and dispersion metrics across every club in the bag to assess your ball-striking and shot control in a controlled environment. We then combine this with an analysis of your strokes gained data from tournament play to better understand the relative contribution of technical, physical, and mental factors to your performance.',
    
    // About
    'about.title': 'About Signal Performance',
    'about.subtitle': 'Redefining golf training through integration',
    'about.paragraph1': 'Signal Performance brings together physical conditioning, mental resilience, and technical skill development in one seamless experience.',
    'about.paragraph2': 'Our integrated approach recognizes that excellence in golf requires harmony between body, mind, and technique.',
    'about.paragraph3': 'We provide a sanctuary where elite golfers can focus on all aspects of their game without distraction.',
    
    // Coach
    'about.coach.title': 'Your Coach',
    'about.coach.name': 'Dr. Noah Sachs',
    'about.coach.position': 'Performance Coach',
    'about.coach.academic': 'Academic Background',
    'about.coach.academic.degree': 'Doctorate in Sport & Performance Psychology',
    'about.coach.experience': 'Professional Experience',
    'about.coach.experience.img': 'IMG Academy',
    'about.coach.experience.usaf': 'U.S. Air Force Special Operations Command',
    'about.coach.experience.pga': 'PGA of America Golf Academy at Mission Hills',
    'about.coach.certifications': 'Certifications',
    
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
    'nav.contact': '加入候補名單',
    'nav.login': '會員登入',
    
    // Hero
    'hero.headline': '高爾夫選手的訓練基地',
    'hero.subheadline': '在同一個訓練空間中整合體能、心理與技術訓練',
    'hero.cta.waitlist': '加入候補名單',
    'hero.cta.membership': '了解會員方案',
    
    // Membership
    'membership.title': '會員專屬內容',
    'membership.price': '每月 NT$18,000',
    'membership.subtitle': '全方位訓練課程皆包含在內',
    'membership.physical.title': '體能訓練',
    'membership.physical.assessment': '每季表現評估',
    'membership.physical.assessment.description': '每季評估提供客觀數據，指導您的個人化訓練計劃。',
    'membership.physical.coaching': '每週三次 1 對 2 體能訓練課程',
    'membership.physical.coaching.description': '在半私人環境中進行完全符合您目標的訓練計畫。',
    'membership.physical.train': '自主訓練空間使用',
    'membership.physical.train.description': '在教練課程之外使用場館完成您的個人化訓練計畫：只需預約時間，開始訓練。',
    'membership.physical.app': '專屬訓練 APP，隨時隨地跟進課表',
    'membership.physical.app.description': '隨時隨地查看您的訓練計劃—在場館、出差或在家—讓您在任何地方都能保持一致的訓練。',
    
    'membership.mental.title': '心理訓練',
    'membership.mental.coaching': '每月一次的 1 對 1 心理教練諮詢',
    'membership.mental.coaching.description': '與認證心理績效顧問會面，進行針對場上場下表現提升的個人化課程。',
    'membership.mental.plan': '系統化心理訓練計畫',
    'membership.mental.plan.description': '依循個人化計劃，透過有針對性的練習在課程間隔建立心理技能。',
    'membership.mental.toolkit': '居家練習工具包（含心率監測器與訓練 APP）',
    'membership.mental.toolkit.description': '獲得心率監測器與專屬訓練 APP，練習課程中學到的技能，並在課程之間追蹤進度。',
    
    'membership.golf.title': '高爾夫訓練',
    'membership.golf.simulator': '模擬器使用時數：每月 5 小時',
    'membership.golf.simulator.description': '使用最先進的技術進行訓練，依您的時間表彈性安排。',
    'membership.golf.putting': '推桿果嶺使用時間：每月 2 小時',
    'membership.golf.putting.description': '使用尖端工具提升技術與對準，自主安排練習時間。',
    'membership.golf.tracking': '比賽數據分析',
    'membership.golf.tracking.description': '所有會員皆可使用數據分析軟體，使我們能夠深入了解您的比賽表現，並依此調整訓練重點。',
    
    'membership.facility.title': '空間特色',
    'membership.facility.refresh': '放鬆與補給空間',
    'membership.facility.refresh.description': '包括現代化淋浴和附有免費與會員專屬價格選項的小廚房。',
    'membership.facility.atmosphere': '私人化訓練環境',
    'membership.facility.atmosphere.description': '會員人數上限 20 人，確保場館安靜、專注且可穩定使用。',
    
    // Assessment Process
    'assessment.title': '我們的評估流程',
    'assessment.description': '每季進行一次完整評估，涵蓋五大核心面向，確保訓練方向正確、有效，並持續朝表現目標邁進。',
    
    'assessment.joint.title': '關節健康',
    'assessment.joint.description': '評估每個主要關節的主動與被動活動範圍，找出動作受限的根本原因。這些資料將用來調整訓練計畫，降低受傷風險並維持長期關節健康。所有變化都會被紀錄與追蹤，持續優化訓練方向。',
    
    'assessment.strength.title': '最大肌力',
    'assessment.strength.description': '透過臥推、硬舉等複合動作測量最大肌力，了解神經肌肉系統的出力效率。隨著最大肌力提升，你將能更快地揮動像高爾夫球桿這類較輕的器具，進而提升揮桿速度。',
    
    'assessment.metabolic.title': '新陳代謝測試',
    'assessment.metabolic.description': '透過有氧與無氧測試，評估你在不同運動強度下的能量供應效率。我們據此設定個人化心率區間，並設計能提升耐力、加速恢復、讓你多回合比賽中保持穩定表現的體能訓練計畫。',
    
    'assessment.body.title': '身體組成',
    'assessment.body.description': '我們追踪肌肉量和體脂百分比的變化，評估您的訓練是否產生正確的適應。這比單純體重提供更可靠的反饋，並幫助確保您的進步與表現目標一致。',
    
    'assessment.golf.title': '高爾夫表現評估',
    'assessment.golf.description': '我們測量每個球桿的距離和分散指標，在受控環境中評估您的擊球與球路控制。然後結合比賽中的 Strokes Gained 數據分析，更深入了解技術、體能與心理因素對您表現的相對影響。',
    
    // About
    'about.title': '關於 Signal Performance',
    'about.subtitle': '透過整合重新定義高爾夫訓練',
    'about.paragraph1': 'Signal Performance 將身體鍛鍊、心理韌性和技術技能發展融合為一體，提供無縫體驗。',
    'about.paragraph2': '我們的整合方法認識到，高爾夫卓越需要身體、心靈和技術之間的和諧。',
    'about.paragraph3': '我們提供一個聖所，讓精英高爾夫球手能夠專注於他們的比賽各個方面，不受干擾。',
    
    // Coach
    'about.coach.title': '您的教練',
    'about.coach.name': 'Dr. Noah Sachs',
    'about.coach.position': '表現教練',
    'about.coach.academic': '學術背景',
    'about.coach.academic.degree': '運動與表現心理學博士',
    'about.coach.experience': '專業經歷',
    'about.coach.experience.img': 'IMG Academy',
    'about.coach.experience.usaf': '美國空軍特種作戰司令部',
    'about.coach.experience.pga': '美國高爾夫協會 Mission Hills 訓練中心',
    'about.coach.certifications': '專業認證',
    
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
