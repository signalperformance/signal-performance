import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

    // Slide 3: Assessment + Membership Combined
    () => (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 max-w-6xl mx-auto">
            {/* Assessment Package */}
            <Card className="shadow-2xl border-2 border-signal-gold/30 bg-gradient-to-br from-white to-signal-gold/5">
              <CardContent className="p-6 md:p-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-lora text-signal-charcoal mb-4">
                    {t['assessment.title']}
                  </h3>
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

            {/* Pro Membership */}
            <Card className="shadow-2xl border-2 border-signal-charcoal/30 bg-gradient-to-br from-signal-charcoal/5 to-white">
              <CardContent className="p-6 md:p-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-lora text-signal-charcoal mb-4">
                    {t['membership.pro.title']}
                  </h3>
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
    ),

    // Slide 4: Assessment Process Details
    () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 flex items-center justify-center p-4 md:p-8">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-lora text-signal-charcoal mb-6">
              {t['assessment.process.title']}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 max-w-7xl mx-auto">
            {[
              { icon: Move, title: t['assessment.joint.title'], color: 'text-blue-500', bg: 'bg-blue-500' },
              { icon: Dumbbell, title: t['assessment.strength.title'], color: 'text-red-500', bg: 'bg-red-500' },
              { icon: Activity, title: t['assessment.metabolic.title'], color: 'text-green-500', bg: 'bg-green-500' },
              { icon: User, title: t['assessment.body.title'], color: 'text-purple-500', bg: 'bg-purple-500' },
              { icon: Club, title: t['assessment.golf.title'], color: 'text-signal-gold', bg: 'bg-signal-gold' }
            ].map((assessment, index) => {
              const IconComponent = assessment.icon;
              return (
                <Card key={index} className="shadow-xl border-2 border-gray-100 text-center">
                  <CardContent className="p-6 md:p-8">
                    <div className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full ${assessment.bg} flex items-center justify-center mx-auto mb-4 md:mb-6`}>
                      <IconComponent className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                    </div>
                    <div className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold ${assessment.bg} rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white mx-auto mb-4`}>
                      {index + 1}
                    </div>
                    <h3 className={`text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold font-lora ${assessment.color}`}>
                      {assessment.title}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    ),

    // Slide 5: Weekly Schedule
    () => (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-lora text-signal-charcoal mb-4">
              {t['schedule.title']}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground">
              {t['schedule.subtitle']}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {[
              { name: t['schedule.classes.mobility'], color: 'bg-blue-500', times: ['12:00', '15:00', '17:00'] },
              { name: t['schedule.classes.strength'], color: 'bg-red-500', times: ['13:30', '18:30', '20:00'] },
              { name: t['schedule.classes.cardio'], color: 'bg-green-500', times: ['13:30', '18:30', '12:00'] },
              { name: t['schedule.classes.power'], color: 'bg-purple-500', times: ['12:00', '15:00', '17:00'] }
            ].map((classType, index) => (
              <Card key={index} className="shadow-xl border-2 border-gray-100">
                <div className={`h-2 ${classType.color}`}></div>
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold font-lora text-center mb-6 md:mb-8 text-signal-charcoal">
                    {classType.name}
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {classType.times.map((time, timeIndex) => (
                      <div key={timeIndex} className="bg-signal-light-gray rounded-lg p-3 md:p-4 text-center">
                        <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-signal-charcoal">
                          {time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Legend */}
          <div className="text-center mt-8 md:mt-16 space-y-2">
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
    ),

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
                      className="object-cover w-full h-full" 
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
                  
                  {/* Certification grid - responsive */}
                  <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-2xl mx-auto">
                    {[
                      '/lovable-uploads/1d022755-a8e7-481a-91db-13f7db87b26a.png',
                      '/lovable-uploads/1dc02882-2327-403c-9e82-8b8207c618ff.png',
                      '/lovable-uploads/09961efd-a840-417f-a93a-2e2990b91489.png',
                      '/lovable-uploads/b8e8e7d5-5980-475f-9534-3660f734bccf.png',
                      '/lovable-uploads/80663943-a684-4747-88d6-29d27b58e790.png',
                      '/lovable-uploads/650394e1-2bf5-4354-b912-86a81648eaaa.png',
                      '/lovable-uploads/05754402-e6c2-4ca2-98e3-9ba6aad7a5ea.png',
                      '/lovable-uploads/ea936717-eb96-4705-98af-8513f4b6c976.png',
                      '/lovable-uploads/385d07dd-80d6-44cb-b2ef-9cbc80e9c887.png'
                    ].map((cert, index) => (
                      <div key={index} className="flex justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                          <img 
                            src={cert}
                            alt={`Certification ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ))}
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