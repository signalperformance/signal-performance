import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Move, Activity, User, Dumbbell, Club } from 'lucide-react';
import QRCode from 'qrcode';

// Force Chinese language context for slideshow
const useChineseTranslations = () => {
  return {
    // Hero
    'hero.headline': '高爾夫好手的整合式訓練空間',
    'hero.subheadline': '體能、心理與技術訓練集中於一個專業空間',
    
    // Philosophy
    'philosophy.title': '我們的理念',
    'philosophy.card1.title': '去除雜訊，聚焦訊號',
    'philosophy.card1.content': '我們的名稱源自「訊號與雜訊比例」的概念，這是資料科學與工程領域中的一項核心原則。所謂「訊號」，是具有意義且可採取行動的資訊；而「雜訊」則是那些分散注意、模糊重點的干擾。我們看待高爾夫表現的方式，就是辨識出真正重要的元素，排除無關雜訊，聚焦提升關鍵表現。',
    'philosophy.card2.title': '依據數據，不靠猜測',
    'philosophy.card2.content': '我們採取以數據為基礎、科學實證支持的訓練方式，不靠猜測，也不盲從數據。數據能提供方向，但不是唯一的決策依據。我們重視專業教練的經驗與判斷，並結合有意義的指標，打造出既有效又具個人化的訓練計畫，協助選手精準提升表現。',
    'philosophy.card3.title': '整合式訓練系統',
    'philosophy.card3.content': '表現從不是單一因素決定的，它是一個由多個面向互動構成的複雜系統。我們的身心彼此連動，技術則建立在兩者之上。因此，我們不將體能、心理與技術分割訓練，而是納入一套整合式的訓練架構中，讓每一部分協同作用，推動整體表現持續進步。',
    
    // Assessment & Membership
    'assessment.title': '我們的評估流程',
    'assessment.price': '10,000元',
    'membership.title': '會員方案',
    'membership.pro.price': '15,000',
    'membership.pro.title': '專業會員',
    'membership.pro.sessions': '每月18堂課',
    'membership.pro.features': [
      '體能訓練 — 每週4次（1對3）',
      '心理訓練 — 每月2次（1對1）',
      '表現報告 — 每月1次',
      '季度評估'
    ],
    
    // Assessment Process
    'assessment.process.title': '5步評估流程',
    'assessment.joint.title': '關節活動度',
    'assessment.strength.title': '最大肌力',
    'assessment.metabolic.title': '心肺耐力',
    'assessment.body.title': '身體組成',
    'assessment.golf.title': '高爾夫技術',
    
    // Schedule
    'schedule.title': '每週訓練課表',
    'schedule.subtitle': '每週最多選4堂課，依時間與目標安排',
    'schedule.classes.mobility': '活動度',
    'schedule.classes.strength': '肌力',
    'schedule.classes.cardio': '心肺',
    'schedule.classes.power': '爆發力',
    
    // Coach
    'coach.title': '您的教練',
    'coach.name': '諾亞薩克斯博士',
    'coach.position': '表現教練',
    'coach.academic': '學術背景',
    'coach.degree': '運動與表現心理學博士',
    'coach.experience': '專業經歷',
    'coach.experience.items': [
      'IMG Academy',
      '美國空軍特種作戰司令部',
      '美國PGA高爾夫學院-觀瀾湖'
    ],
    'coach.certifications': '專業認證',
    
    // QR Code
    'qr.text': '掃描預約評估'
  };
};

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const t = useChineseTranslations();

  // Generate QR code for Calendly booking
  useEffect(() => {
    QRCode.toDataURL('https://calendly.com/signal-performance/assessment', {
      width: 150,
      margin: 2,
      color: {
        dark: '#1f2937',
        light: '#ffffff'
      }
    }).then(setQrCodeUrl);
  }, []);

  // Auto-advance slides every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 6); // 6 total slides
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const slides = [
    // Slide 1: Hero
    () => (
      <div className="min-h-screen bg-gradient-to-br from-signal-charcoal to-signal-charcoal/80 flex items-center justify-center relative overflow-hidden">
        {/* Background geometric shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border-2 border-signal-gold rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-signal-gold/20 rounded-lg transform rotate-45"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto bg-signal-charcoal/90 backdrop-blur-sm rounded-3xl border border-signal-gold/30 p-8 md:p-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 font-lora leading-tight">
              {t['hero.headline']}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-signal-gold font-light leading-relaxed">
              {t['hero.subheadline']}
            </p>
          </div>
        </div>
      </div>
    ),

    // Slide 2: Philosophy (All 3 cards)
    () => (
      <div className="min-h-screen bg-signal-light-gray flex items-center justify-center p-4 md:p-8">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-12 font-lora text-signal-charcoal">
              {t['philosophy.title']}
            </h2>
            
            {/* Chinese signal wave graphic */}
            <div className="w-full mb-8 md:mb-16 flex justify-center">
              <img 
                src="/lovable-uploads/23ce2472-9cbc-4d05-bd80-cd0ac6eb27a8.png"
                alt="Signal wave with red spike (Chinese)" 
                className="w-full max-w-5xl h-auto object-contain"
                loading="eager"
              />
            </div>
          </div>
          
          {/* 3-column grid for all screen sizes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
            {[
              { title: t['philosophy.card1.title'], content: t['philosophy.card1.content'] },
              { title: t['philosophy.card2.title'], content: t['philosophy.card2.content'] },
              { title: t['philosophy.card3.title'], content: t['philosophy.card3.content'] }
            ].map((card, index) => (
              <Card key={index} className="bg-white shadow-xl border-2 border-gray-100 h-full">
                <CardContent className="p-6 md:p-8 h-full flex flex-col">
                  <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-lora font-bold mb-4 md:mb-6 text-signal-charcoal">
                    {card.title}
                  </h3>
                  <p className="text-sm md:text-base lg:text-lg xl:text-xl text-muted-foreground leading-relaxed flex-1">
                    {card.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    ),

    // Slide 3: How to Get Started
    () => (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-lora text-signal-charcoal mb-6">
              如何開始
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              先進行完整評估，包含基礎數據收集與私人訓練，之後開始您的每月訓練課程。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 max-w-6xl mx-auto">
            {/* Step 1: Assessment */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-signal-gold text-signal-charcoal px-6 py-3 rounded-full font-bold text-lg md:text-xl">
                  第1步 · 完成基礎評估
                </div>
              </div>
              <Card className="shadow-2xl border-2 border-signal-gold/30 bg-gradient-to-br from-white to-signal-gold/5">
                <CardContent className="p-6 md:p-10">
                  <div className="text-center mb-8">
                    <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-signal-gold mb-6">
                      NT${t['assessment.price']}
                    </div>
                  </div>
                  <ul className="space-y-4 text-base md:text-lg lg:text-xl xl:text-2xl">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-signal-gold rounded-full mr-4 flex-shrink-0"></span>
                      評估 – 基礎檢測 3小時
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-signal-gold rounded-full mr-4 flex-shrink-0"></span>
                      回顧 – 結果與計劃 1小時
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-signal-gold rounded-full mr-4 flex-shrink-0"></span>
                      訓練 – 私人課程3堂 3小時
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Step 2: Membership */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-signal-charcoal text-white px-6 py-3 rounded-full font-bold text-lg md:text-xl">
                  第2步 · 選擇月方案
                </div>
              </div>
              <Card className="shadow-2xl border-2 border-signal-charcoal/30 bg-gradient-to-br from-signal-charcoal/5 to-white">
                <CardContent className="p-6 md:p-10">
                  <div className="text-center mb-8">
                    <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-signal-charcoal mb-2">
                      NT${t['membership.pro.price']}
                    </div>
                    <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-signal-gold font-semibold">
                      {t['membership.pro.sessions']}
                    </div>
                  </div>
                  <ul className="space-y-4 text-base md:text-lg lg:text-xl xl:text-2xl">
                    {t['membership.pro.features'].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-signal-charcoal rounded-full mr-4 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    ),

    // Slide 4: Assessment Process Video
    () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 flex items-center justify-center p-4 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-lora text-signal-charcoal mb-4 md:mb-6">
              我們的評估流程
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground max-w-3xl mx-auto">
              每季，會員會完成一項由五部分組成的評估，以確保訓練保持一致且有效。
            </p>
          </div>
          
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <iframe 
                src="https://www.youtube.com/embed/9yyIwGOXogM?si=c5pvJY3h9PMiEoJ7&amp;controls=0" 
                className="absolute inset-0 w-full h-full rounded-lg shadow-2xl"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                title="YouTube video player"
              />
            </div>
          </div>
        </div>
      </div>
    ),

    // Slide 5: Weekly Schedule
    () => {
      type Item = {
        hour24: number;
        minute?: number;
        labelKey: 'mobility' | 'strength' | 'cardio' | 'power';
        pro?: boolean;
      };

      // Schedule data matching WeeklySchedule component
      const mwf: Item[] = [
        { hour24: 12, minute: 0, labelKey: 'mobility', pro: true },
        { hour24: 13, minute: 30, labelKey: 'strength', pro: true },
        { hour24: 15, minute: 0, labelKey: 'mobility', pro: true },
        { hour24: 17, minute: 0, labelKey: 'mobility' },
        { hour24: 18, minute: 30, labelKey: 'strength' },
        { hour24: 20, minute: 0, labelKey: 'strength' },
      ];

      const tth: Item[] = [
        { hour24: 12, minute: 0, labelKey: 'power', pro: true },
        { hour24: 13, minute: 30, labelKey: 'cardio', pro: true },
        { hour24: 15, minute: 0, labelKey: 'power', pro: true },
        { hour24: 17, minute: 0, labelKey: 'power' },
        { hour24: 18, minute: 30, labelKey: 'cardio' },
        { hour24: 20, minute: 0, labelKey: 'power' },
      ];

      const weekend: Item[] = [
        { hour24: 9, minute: 0, labelKey: 'mobility' },
        { hour24: 10, minute: 30, labelKey: 'strength' },
        { hour24: 12, minute: 0, labelKey: 'cardio' },
        { hour24: 13, minute: 30, labelKey: 'power' },
        { hour24: 15, minute: 0, labelKey: 'mobility', pro: true },
        { hour24: 16, minute: 30, labelKey: 'power', pro: true },
      ];

      const columns = [
        { title: '週一／週三／週五', items: mwf },
        { title: '週二／週四', items: tth },
        { title: '週末', items: weekend },
      ];

      const formatTime = (hour24: number, minute: number = 0) => {
        return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      };

      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
          <div className="container mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-lora text-signal-charcoal mb-4">
                {t['schedule.title']}
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground">
                {t['schedule.subtitle']}
              </p>
            </div>
            
            {/* Desktop 3-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
              {columns.map((col, idx) => (
                <Card key={idx} className="shadow-xl border-2 border-gray-100 overflow-hidden">
                  <div className="h-2 w-full bg-signal-gold"></div>
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold font-lora text-center mb-4 md:mb-6 text-signal-charcoal">
                      {col.title}
                    </h3>
                    <div className="space-y-2 md:space-y-3">
                      {col.items.map((item, i) => (
                        <div
                          key={i}
                          className={`relative grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md border border-gray-200 px-3 py-2 md:py-3 ${
                            item.pro ? 'bg-signal-gold/10' : 'bg-gray-50'
                          }`}
                        >
                          {item.pro && (
                            <span
                              className="absolute left-0 top-0 h-full w-1 bg-signal-gold"
                              aria-hidden
                            />
                          )}
                          <span className="inline-flex items-center gap-1 text-xs md:text-sm text-gray-600">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(item.hour24, item.minute)}
                          </span>
                          <span className="text-sm md:text-base lg:text-lg font-bold font-lora text-signal-charcoal text-center">
                            {t[`schedule.classes.${item.labelKey}`]}
                          </span>
                          <span className="justify-self-end">
                            {item.pro ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-signal-gold/20 text-signal-charcoal px-2 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-wide ring-1 ring-signal-gold/40">
                                PRO
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-signal-charcoal/15 text-signal-charcoal px-2 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-wide ring-1 ring-signal-charcoal/40">
                                AM
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Legend */}
            <div className="text-center mt-8 md:mt-12">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <span className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-signal-gold/20 text-signal-charcoal px-3 py-1 text-sm font-semibold uppercase">PRO</span>
                  <span className="text-base md:text-lg">=</span>
                  <span className="text-base md:text-lg">僅限職業</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-signal-charcoal/15 text-signal-charcoal px-3 py-1 text-sm font-semibold uppercase">AM</span>
                  <span className="text-base md:text-lg">=</span>
                  <span className="text-base md:text-lg">僅限業餘</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    },

    // Slide 6: Coach Profile & Credentials Combined
    () => (
      <div className="min-h-screen bg-gradient-to-br from-signal-light-gray to-white flex items-center justify-center p-4 md:p-8">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-lora text-signal-charcoal">
              {t['coach.title']}
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 md:gap-16 items-center lg:items-start max-w-7xl mx-auto">
            {/* Coach Profile */}
            <div className="w-full lg:w-1/3">
              <div className="text-center">
                <div className="mb-6 md:mb-8">
                  <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto rounded-lg overflow-hidden bg-signal-gold/20">
                    <img 
                      src="/lovable-uploads/9cd6f4c9-9cfc-435a-8ebb-2bbe20537915.png" 
                      alt="Dr. Noah Sachs" 
                      className="object-contain w-full h-full" 
                    />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-signal-charcoal mb-2">
                  {t['coach.name']}
                </h3>
                <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-signal-gold font-semibold">
                  {t['coach.position']}
                </p>
              </div>
            </div>
            
            {/* Academic & Experience & Certifications */}
            <div className="w-full lg:w-2/3">
              {/* Academic & Experience */}
              <Card className="mb-6 md:mb-8 shadow-xl border-2 border-gray-100">
                <CardContent className="p-6 md:p-10">
                  <div className="mb-6 md:mb-8">
                    <h4 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 text-signal-charcoal">
                      {t['coach.academic']}
                    </h4>
                    <p className="text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed text-signal-charcoal/90">
                      {t['coach.degree']}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 text-signal-charcoal">
                      {t['coach.experience']}
                    </h4>
                    <ul className="text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed text-signal-charcoal/90 space-y-2">
                      {t['coach.experience.items'].map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Certifications */}
              <Card className="shadow-xl border-2 border-gray-100">
                <CardContent className="p-6 md:p-10">
                  <h4 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 md:mb-8 text-signal-charcoal text-center">
                    {t['coach.certifications']}
                  </h4>
                  
                  {/* Certification layout - 3 rows of 3 certifications each */}
                  <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">
                    {/* Row 1 */}
                    <div className="flex justify-between items-center">
                      {[
                        '/lovable-uploads/1d022755-a8e7-481a-91db-13f7db87b26a.png',
                        '/lovable-uploads/1dc02882-2327-403c-9e82-8b8207c618ff.png',
                        '/lovable-uploads/09961efd-a840-417f-a93a-2e2990b91489.png'
                      ].map((cert, index) => (
                        <div key={index} className="w-16 h-16 md:w-20 md:h-20">
                          <img 
                            src={cert}
                            alt={`Certification ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Row 2 */}
                    <div className="flex justify-between items-center">
                      {[
                        '/lovable-uploads/b8e8e7d5-5980-475f-9534-3660f734bccf.png',
                        '/lovable-uploads/80663943-a684-4747-88d6-29d27b58e790.png',
                        '/lovable-uploads/650394e1-2bf5-4354-b912-86a81648eaaa.png'
                      ].map((cert, index) => (
                        <div key={index + 3} className="w-16 h-16 md:w-20 md:h-20">
                          <img 
                            src={cert}
                            alt={`Certification ${index + 4}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Row 3 */}
                    <div className="flex justify-between items-center">
                      {[
                        '/lovable-uploads/05754402-e6c2-4ca2-98e3-9ba6aad7a5ea.png',
                        '/lovable-uploads/ea936717-eb96-4705-98af-8513f4b6c976.png',
                        '/lovable-uploads/385d07dd-80d6-44cb-b2ef-9cbc80e9c887.png'
                      ].map((cert, index) => (
                        <div key={index + 6} className="w-16 h-16 md:w-20 md:h-20">
                          <img 
                            src={cert}
                            alt={`Certification ${index + 7}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  ];

  return (
    <div className="relative">
      {/* Current slide */}
      <div className="transition-opacity duration-500">
        {slides[currentSlide]()}
      </div>
      
      {/* Progress indicator */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
        <Progress 
          value={((currentSlide + 1) / slides.length) * 100} 
          className="w-32 md:w-48 h-2" 
        />
        <div className="text-xs md:text-sm text-center mt-1 font-semibold text-signal-charcoal">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
      
      {/* Persistent QR Code */}
      {qrCodeUrl && (
        <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl p-3 md:p-4 border-2 border-signal-gold/20">
          <div className="text-center">
            <img 
              src={qrCodeUrl} 
              alt="QR Code for booking assessment"
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto mb-2"
            />
            <p className="text-xs md:text-sm lg:text-base font-semibold text-signal-charcoal">
              {t['qr.text']}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slideshow;