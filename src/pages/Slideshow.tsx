import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Move, Activity, User, Dumbbell, Club } from 'lucide-react';
import QRCode from 'qrcode';
import { useImagePreloader } from '@/hooks/useImagePreloader';

// All slideshow images that need preloading
const SLIDESHOW_IMAGES = [
  '/lovable-uploads/23ce2472-9cbc-4d05-bd80-cd0ac6eb27a8.png', // Philosophy wave
  '/lovable-uploads/9cd6f4c9-9cfc-435a-8ebb-2bbe20537915.png', // Coach photo
  '/lovable-uploads/1d022755-a8e7-481a-91db-13f7db87b26a.png', // Cert 1
  '/lovable-uploads/1dc02882-2327-403c-9e82-8b8207c618ff.png', // Cert 2
  '/lovable-uploads/09961efd-a840-417f-a93a-2e2990b91489.png', // Cert 3
  '/lovable-uploads/b8e8e7d5-5980-475f-9534-3660f734bccf.png', // Cert 4
  '/lovable-uploads/80663943-a684-4747-88d6-29d27b58e790.png', // Cert 5
  '/lovable-uploads/650394e1-2bf5-4354-b912-86a81648eaaa.png', // Cert 6
  '/lovable-uploads/05754402-e6c2-4ca2-98e3-9ba6aad7a5ea.png', // Cert 7
  '/lovable-uploads/ea936717-eb96-4705-98af-8513f4b6c976.png', // Cert 8
  '/lovable-uploads/385d07dd-80d6-44cb-b2ef-9cbc80e9c887.png', // Cert 9
];

// YouTube API type declarations
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

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
    'assessment.originalPrice': '12,000',
    'assessment.savings': '2,000',
    'assessment.promotional': '限時優惠！立即預約',
    'assessment.bookingStatus': '2人已預約，8名額剩餘',
    'membership.title': '會員方案',
    'membership.pro.price': '15,000',
    'membership.pro.originalPrice': '18,000',
    'membership.pro.savings': '3,000',
    'membership.pro.title': '專業會員',
    'membership.pro.sessions': '每月18堂課',
    'membership.pro.features': [
      '體能訓練 — 每週4次（1對3）',
      '心理訓練 — 每月2次（1對1）',
      '表現報告 — 每月1次',
      '季度評估'
    ],
    'membership.pro.promotional': '限時優惠！立即預約',
    'membership.pro.bookingStatus': '2人已預約，8名額剩餘',
    
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
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [focusedPrinciple, setFocusedPrinciple] = useState<number | null>(null);
  const [principlePhase, setPrinciplePhase] = useState<'initial' | 'focusing' | 'all-visible'>('initial');
  const [focusedStep, setFocusedStep] = useState<number | null>(null);
  const [pricingPhase, setPricingPhase] = useState<'initial' | 'step1' | 'step2' | 'all-visible'>('initial');
  const playerRef = useRef<any>(null);
  const principleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pricingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const t = useChineseTranslations();
  
  // Preload all slideshow images
  const { isLoading: imagesLoading, loadedCount, totalCount } = useImagePreloader(SLIDESHOW_IMAGES);

  const totalSlides = 6;

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    pauseAutoAdvance();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
    pauseAutoAdvance();
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    pauseAutoAdvance();
  }, [totalSlides]);

  const pauseAutoAdvance = useCallback(() => {
    setIsAutoPaused(true);
    setLastInteractionTime(Date.now());
  }, []);

  const resumeAutoAdvance = useCallback(() => {
    setIsAutoPaused(false);
  }, []);

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

  // YouTube Player API initialization
  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        if (playerRef.current) {
          playerRef.current = new window.YT.Player('youtube-player', {
            events: {
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  setIsVideoPlaying(true);
                } else if (event.data === window.YT.PlayerState.ENDED) {
                  setIsVideoPlaying(false);
                }
              }
            }
          });
        }
      };
    }
  }, []);

  // Philosophy slide principle focusing animation
  useEffect(() => {
    if (currentSlide === 1 && !isAutoPaused) { // Philosophy slide
      // Clear any existing timer
      if (principleTimerRef.current) {
        clearTimeout(principleTimerRef.current);
      }

      // Initial 2-second delay, all principles blurred
      setPrinciplePhase('initial');
      setFocusedPrinciple(null);
      
      // Set up the sequence
      const sequence = [
        { delay: 2000, principle: 0 },    // 2s: focus on principle 1
        { delay: 27000, principle: 1 },   // 27s: focus on principle 2  
        { delay: 52000, principle: 2 },   // 52s: focus on principle 3
      ];

      sequence.forEach(({ delay, principle }) => {
        principleTimerRef.current = setTimeout(() => {
          if (currentSlide === 1 && !isAutoPaused) {
            setPrinciplePhase('focusing');
            setFocusedPrinciple(principle);
          }
        }, delay);
      });
      
      // Add final phase: all principles unblurred at 27s
      principleTimerRef.current = setTimeout(() => {
        if (currentSlide === 1 && !isAutoPaused) {
          setPrinciplePhase('all-visible');
          setFocusedPrinciple(null);
        }
      }, 77000); // Show all principles at 77s
    } else {
      // Reset philosophy state when leaving slide
      if (principleTimerRef.current) {
        clearTimeout(principleTimerRef.current);
        principleTimerRef.current = null;
      }
      setFocusedPrinciple(null);
      setPrinciplePhase('initial');
    }

    return () => {
      if (principleTimerRef.current) {
        clearTimeout(principleTimerRef.current);
        principleTimerRef.current = null;
      }
    };
  }, [currentSlide, isAutoPaused]);

  // Pricing slide step focusing animation
  useEffect(() => {
    if (currentSlide === 2 && !isAutoPaused) { // Pricing slide
      // Clear any existing timer
      if (pricingTimerRef.current) {
        clearTimeout(pricingTimerRef.current);
      }

      // Initial state - both steps blurred
      setPricingPhase('initial');
      setFocusedStep(null);
      
      // Set up the sequence
      const sequence = [
        { delay: 0, step: 0, phase: 'step1' }, // 0s: show step 1
        { delay: 10000, step: 1, phase: 'step2' }, // 10s: show step 2
        { delay: 20000, step: null, phase: 'all-visible' }, // 20s: show both
      ];

      sequence.forEach(({ delay, step, phase }) => {
        pricingTimerRef.current = setTimeout(() => {
          if (currentSlide === 2 && !isAutoPaused) {
            setPricingPhase(phase as 'step1' | 'step2' | 'all-visible');
            setFocusedStep(step);
          }
        }, delay);
      });
    } else {
      // Reset pricing state when leaving slide
      if (pricingTimerRef.current) {
        clearTimeout(pricingTimerRef.current);
        pricingTimerRef.current = null;
      }
      setFocusedStep(null);
      setPricingPhase('initial');
    }

    return () => {
      if (pricingTimerRef.current) {
        clearTimeout(pricingTimerRef.current);
        pricingTimerRef.current = null;
      }
    };
  }, [currentSlide, isAutoPaused]);

  // Auto-advance slides with pause/resume logic (only after images load)
  useEffect(() => {
    if (imagesLoading) return; // Don't start slideshow until images are loaded
    
    // Use custom timeout for pricing slide (30 seconds), philosophy slide (85 seconds), video slide (33 seconds), 5th slide (15 seconds), normal timeout for others (8 seconds)
    const slideTimeout = currentSlide === 1 ? 85000 : currentSlide === 2 ? 30000 : currentSlide === 3 ? 33000 : currentSlide === 4 ? 15000 : 8000;
    
    const timer = setInterval(() => {
      if (!isAutoPaused) {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      } else {
        // Resume auto-advance after 10 seconds of no interaction
        if (Date.now() - lastInteractionTime > 10000) {
          resumeAutoAdvance();
        }
      }
    }, slideTimeout);

    return () => clearInterval(timer);
  }, [isAutoPaused, lastInteractionTime, totalSlides, resumeAutoAdvance, imagesLoading, currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (isAutoPaused) {
            resumeAutoAdvance();
          } else {
            pauseAutoAdvance();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          e.preventDefault();
          const slideIndex = parseInt(e.key) - 1;
          if (slideIndex >= 0 && slideIndex < totalSlides) {
            goToSlide(slideIndex);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [goToSlide, nextSlide, prevSlide, isAutoPaused, pauseAutoAdvance, resumeAutoAdvance, totalSlides]);

  const slides = [
    // Slide 1: Hero
    () => (
      <div className="min-h-screen bg-gradient-to-br from-signal-charcoal via-signal-charcoal/90 to-signal-charcoal/70 flex items-center justify-center relative overflow-hidden">
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto bg-signal-charcoal/95 backdrop-blur-md rounded-3xl border border-signal-gold/40 p-8 md:p-16 animate-scale-in shadow-2xl shadow-signal-gold/10 hover:shadow-signal-gold/20 transition-all duration-700">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 font-lora leading-tight opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              {t['hero.headline']}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-signal-gold font-light leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
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
              <div 
                className="w-full max-w-5xl h-32 md:h-48 lg:h-64 bg-center bg-no-repeat bg-contain opacity-0 animate-fade-in"
                style={{
                  backgroundImage: 'url(/lovable-uploads/23ce2472-9cbc-4d05-bd80-cd0ac6eb27a8.png)',
                  animationDelay: '0.1s',
                  animationFillMode: 'forwards'
                }}
                role="img"
                aria-label="Signal wave with red spike (Chinese)"
              />
            </div>
          </div>
          
          {/* 3-column grid for all screen sizes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
            {[
              { title: t['philosophy.card1.title'], content: t['philosophy.card1.content'] },
              { title: t['philosophy.card2.title'], content: t['philosophy.card2.content'] },
              { title: t['philosophy.card3.title'], content: t['philosophy.card3.content'] }
            ].map((card, index) => {
              const isFocused = focusedPrinciple === index && principlePhase === 'focusing';
              const isBlurred = principlePhase === 'focusing' && focusedPrinciple !== index;
              const isAllVisible = principlePhase === 'all-visible';
              
              return (
                <Card 
                  key={index} 
                  className={`bg-white shadow-xl border-2 h-full transition-all duration-500 ease-in-out ${
                    isFocused 
                      ? 'border-signal-gold/60 shadow-2xl transform scale-105 bg-gradient-to-br from-white to-signal-gold/5' 
                      : isBlurred 
                        ? 'border-gray-100 opacity-40 blur-sm transform scale-95' 
                        : isAllVisible
                          ? 'border-gray-100 opacity-100 blur-none transform scale-100'
                          : 'border-gray-100'
                  }`}
                >
                  <CardContent className="p-6 md:p-8 h-full flex flex-col">
                    <h3 className={`text-lg md:text-xl lg:text-2xl xl:text-3xl font-lora font-bold mb-4 md:mb-6 transition-colors duration-500 ${
                      isFocused ? 'text-signal-charcoal' : 'text-signal-charcoal'
                    }`}>
                      {card.title}
                    </h3>
                    <p className={`text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed flex-1 transition-colors duration-500 ${
                      isFocused ? 'text-signal-charcoal/90' : 'text-muted-foreground'
                    }`}>
                      {card.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 max-w-6xl mx-auto">
            {/* Step 1: Assessment */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-signal-gold text-signal-charcoal px-6 py-3 rounded-full font-bold text-lg md:text-xl">
                  第1步 · 完成基礎評估
                </div>
              </div>
               <Card className={`shadow-2xl border-2 border-signal-gold/30 bg-gradient-to-br from-white to-signal-gold/5 overflow-hidden transition-all duration-500 ease-in-out ${
                 pricingPhase === 'step1' && focusedStep === 0
                   ? 'border-signal-gold/80 shadow-2xl transform scale-105 bg-gradient-to-br from-white to-signal-gold/10'
                   : (pricingPhase === 'step1' || pricingPhase === 'step2') && focusedStep !== 0
                     ? 'opacity-40 blur-sm transform scale-95'
                     : pricingPhase === 'all-visible'
                       ? 'opacity-100 blur-none transform scale-100'
                       : ''
               }`}>
                {/* Promotional Banner */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 px-6">
                  <div className="font-bold text-sm md:text-base lg:text-lg">
                    {t['assessment.promotional']}
                  </div>
                </div>
                
                <CardContent className="p-6 md:p-10">
                  <div className="text-center mb-8">
                    {/* Original Price (Crossed Out) */}
                    <div className="text-lg md:text-xl lg:text-2xl text-gray-500 line-through mb-2">
                      NT${t['assessment.originalPrice']}
                    </div>
                    
                    {/* Discounted Price */}
                    <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-signal-gold mb-2">
                      10,000元
                    </div>
                    
                    {/* Savings Amount */}
                    <div className="text-sm md:text-base lg:text-lg text-green-600 font-semibold mb-4">
                      省 NT${t['assessment.savings']}
                    </div>
                    
                    {/* Booking Status Tracker */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="text-sm md:text-base text-gray-600 mb-2">
                        {t['assessment.bookingStatus']}
                      </div>
                      <div className="flex justify-center space-x-1">
                        {[...Array(10)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-3 h-3 rounded-full ${i < 2 ? 'bg-orange-500' : 'bg-gray-300'}`}
                          />
                        ))}
                      </div>
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
               <Card className={`shadow-2xl border-2 border-signal-charcoal/30 bg-gradient-to-br from-signal-charcoal/5 to-white overflow-hidden transition-all duration-500 ease-in-out ${
                 pricingPhase === 'step2' && focusedStep === 1
                   ? 'border-signal-charcoal/80 shadow-2xl transform scale-105 bg-gradient-to-br from-signal-charcoal/10 to-white'
                   : (pricingPhase === 'step1' || pricingPhase === 'step2') && focusedStep !== 1
                     ? 'opacity-40 blur-sm transform scale-95'
                     : pricingPhase === 'all-visible'
                       ? 'opacity-100 blur-none transform scale-100'
                       : ''
               }`}>
                {/* Promotional Banner */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 px-6">
                  <div className="font-bold text-sm md:text-base lg:text-lg">
                    {t['membership.pro.promotional']}
                  </div>
                </div>
                
                <CardContent className="p-6 md:p-10">
                  <div className="text-center mb-8">
                    {/* Original Price (Crossed Out) */}
                    <div className="text-lg md:text-xl lg:text-2xl text-gray-500 line-through mb-2">
                      NT${t['membership.pro.originalPrice']}
                    </div>
                    
                    {/* Discounted Price */}
                    <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-signal-charcoal mb-2">
                      15,000元<span className="text-lg md:text-xl lg:text-2xl xl:text-3xl">／月</span>
                    </div>
                    
                    {/* Savings Amount */}
                    <div className="text-sm md:text-base lg:text-lg text-green-600 font-semibold mb-4">
                      省 NT${t['membership.pro.savings']}
                    </div>
                    
                    
                    {/* Booking Status Tracker */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="text-sm md:text-base text-gray-600 mb-2">
                        {t['membership.pro.bookingStatus']}
                      </div>
                      <div className="flex justify-center space-x-1">
                        {[...Array(10)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-3 h-3 rounded-full ${i < 2 ? 'bg-orange-500' : 'bg-gray-300'}`}
                          />
                        ))}
                      </div>
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
          </div>
          
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <iframe 
                id="youtube-player"
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/9yyIwGOXogM?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&enablejsapi=1" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="autoplay; encrypted-media" 
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-lg shadow-2xl"
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
        { title: '週六/週日', items: weekend },
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
                  <div className="w-64 h-80 md:w-72 md:h-96 lg:w-80 lg:h-[26rem] mx-auto rounded-lg overflow-hidden bg-signal-gold/20">
                    <img 
                      src="/lovable-uploads/9cd6f4c9-9cfc-435a-8ebb-2bbe20537915.png" 
                      alt="Dr. Noah Sachs"
                      className="object-cover w-full h-full object-top" 
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
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
                             loading="eager"
                             decoding="async"
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
                             loading="eager"
                             decoding="async"
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
                             loading="eager"
                             decoding="async"
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

  // Show loading screen while images are preloading
  if (imagesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <div className="text-lg font-medium">載入中...</div>
          <div className="text-sm text-muted-foreground">
            {loadedCount} / {totalCount} 張圖片已載入
          </div>
          <Progress value={(loadedCount / totalCount) * 100} className="w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Current slide */}
      <div className="transition-opacity duration-500">
        {slides[currentSlide]()}
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