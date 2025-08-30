import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Move, Activity, User, Dumbbell, Club } from 'lucide-react';
import QRCode from 'qrcode';

// Individual slide components
const HeroSlide = () => {
  const { t } = useLanguage();
  
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-100">
      {/* Animated geometric shapes */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-signal-gold/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-96 h-96 bg-signal-charcoal/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-signal-gold/15 rounded-full blur-lg animate-pulse delay-500"></div>
      
      <div className="relative z-10 container mx-auto px-16 text-center">
        <div className="max-w-8xl mx-auto">
          <div className="bg-signal-charcoal/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-signal-charcoal/60 p-24">
            <h1 className="font-bold mb-16 text-white leading-tight text-8xl xl:text-9xl transition-all duration-300">
              {t('hero.headline')}
            </h1>
            <p className="text-white mb-16 text-5xl xl:text-6xl transition-all duration-300 leading-relaxed">
              體能、心理與技術訓練集中於一個專業空間
            </p>
            <div className="text-signal-gold text-6xl xl:text-7xl font-bold">
              歡迎來到信號表現訓練中心
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PhilosophyIntroSlide = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-signal-light-gray flex items-center justify-center py-24">
      <div className="container mx-auto px-16 text-center">
        <h2 className="text-8xl xl:text-9xl font-bold mb-24 font-lora text-signal-charcoal">
          {t('philosophy.title')}
        </h2>
        
        {/* Signal wave graphic - larger */}
        <div className="w-full mb-16 flex items-center justify-center">
          <img 
            alt="Signal wave with red spike (Chinese)" 
            className="w-full max-w-8xl h-auto object-contain" 
            src="/lovable-uploads/23ce2472-9cbc-4d05-bd80-cd0ac6eb27a8.png"
            loading="eager"
          />
        </div>
        
        <div className="text-6xl text-signal-charcoal font-medium leading-relaxed max-w-6xl mx-auto">
          我們的訓練哲學建立在三個核心支柱上
        </div>
      </div>
    </div>
  );
};

const PhilosophyCard1Slide = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-24">
      <div className="container mx-auto px-16">
        <div className="max-w-6xl mx-auto text-center">
          <Card className="shadow-2xl bg-white border-8 border-gray-100 animate-scale-in">
            <CardContent className="p-24">
              <div className="text-8xl font-bold mb-16 text-signal-gold">1</div>
              <h3 className="text-7xl font-lora mb-16 text-signal-charcoal font-bold">
                {t('philosophy.card1.title')}
              </h3>
              <p className="text-4xl text-muted-foreground leading-relaxed">
                {t('philosophy.card1.content')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const PhilosophyCard2Slide = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-signal-light-gray flex items-center justify-center py-24">
      <div className="container mx-auto px-16">
        <div className="max-w-6xl mx-auto text-center">
          <Card className="shadow-2xl bg-white border-8 border-gray-100 animate-scale-in">
            <CardContent className="p-24">
              <div className="text-8xl font-bold mb-16 text-signal-gold">2</div>
              <h3 className="text-7xl font-lora mb-16 text-signal-charcoal font-bold">
                {t('philosophy.card2.title')}
              </h3>
              <p className="text-4xl text-muted-foreground leading-relaxed">
                {t('philosophy.card2.content')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const PhilosophyCard3Slide = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-24">
      <div className="container mx-auto px-16">
        <div className="max-w-6xl mx-auto text-center">
          <Card className="shadow-2xl bg-white border-8 border-gray-100 animate-scale-in">
            <CardContent className="p-24">
              <div className="text-8xl font-bold mb-16 text-signal-gold">3</div>
              <h3 className="text-7xl font-lora mb-16 text-signal-charcoal font-bold">
                {t('philosophy.card3.title')}
              </h3>
              <p className="text-4xl text-muted-foreground leading-relaxed">
                {t('philosophy.card3.content')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AssessmentIntroSlide = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-signal-light-gray flex items-center justify-center py-24">
      <div className="container mx-auto px-16 text-center">
        <h2 className="text-8xl xl:text-9xl font-bold mb-24 font-lora text-signal-charcoal">
          {t('assessment.title')}
        </h2>
        <p className="text-5xl text-muted-foreground leading-relaxed max-w-6xl mx-auto mb-16">
          {t('assessment.processDescription')}
        </p>
        <div className="text-6xl font-bold text-signal-gold">
          完整的五步驟評估流程
        </div>
      </div>
    </div>
  );
};

const AssessmentOverviewSlide = () => {
  const { t } = useLanguage();
  
  const assessments = [
    { title: t('assessment.joint.title'), number: 1, color: "bg-blue-500" },
    { title: t('assessment.strength.title'), number: 2, color: "bg-red-500" },
    { title: t('assessment.metabolic.title'), number: 3, color: "bg-green-500" },
    { title: t('assessment.body.title'), number: 4, color: "bg-purple-500" },
    { title: t('assessment.golf.title'), number: 5, color: "bg-signal-gold" }
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-24">
      <div className="container mx-auto px-16">
        <div className="text-center mb-24">
          <h2 className="text-7xl font-bold mb-16 font-lora text-signal-charcoal">評估項目</h2>
        </div>

        <div className="grid grid-cols-5 gap-8 max-w-7xl mx-auto">
          {assessments.map((assessment, idx) => (
            <div key={idx} className="text-center">
              <div className={`w-32 h-32 rounded-full ${assessment.color} flex items-center justify-center text-white font-bold text-4xl mx-auto mb-8`}>
                {assessment.number}
              </div>
              <h3 className="text-3xl font-lora font-bold text-signal-charcoal">
                {assessment.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MembershipIntroSlide = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-signal-light-gray flex items-center justify-center py-24">
      <div className="container mx-auto px-16 text-center">
        <h2 className="text-8xl xl:text-9xl font-bold mb-24 font-lora text-signal-charcoal">
          {t("pricing.title")}
        </h2>
        <div className="text-6xl text-signal-charcoal font-medium leading-relaxed max-w-6xl mx-auto">
          開始您的健身之旅
        </div>
      </div>
    </div>
  );
};

const AssessmentPackageSlide = () => {
  const { t } = useLanguage();
  
  const assessmentFeatures = [
    t("gettingstarted.assessmentPackage.bullets.assess"), 
    t("gettingstarted.assessmentPackage.bullets.review"), 
    t("gettingstarted.assessmentPackage.bullets.train")
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-24">
      <div className="container mx-auto px-16">
        <div className="max-w-5xl mx-auto">
          <Card className="rounded-3xl shadow-2xl border-8 border-primary/20">
            <CardContent className="p-24 text-center">
              <Badge variant="outline" className="rounded-full border-4 border-primary bg-primary/10 text-foreground px-8 py-4 text-2xl font-bold mb-16">
                {t("flow.step1")}
              </Badge>

              <div className="mb-16">
                <div className="flex items-baseline justify-center gap-8 mb-8">
                  <span className="text-4xl line-through text-muted-foreground">NT$12,000</span>
                  <span className="text-8xl font-bold text-green-600">{t("gettingstarted.assessmentPackage.price")}</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-3xl px-8 py-4">
                  {t("promo.save")} NT$2,000
                </Badge>
              </div>

              <ul className="space-y-8 text-left max-w-3xl mx-auto">
                {assessmentFeatures.map(name => (
                  <li key={name} className="flex gap-6 items-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-4 border-primary text-foreground">
                      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div className="text-3xl font-medium">{name}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const MembershipPlansSlide = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-signal-light-gray flex items-center justify-center py-24">
      <div className="container mx-auto px-16">
        <div className="max-w-5xl mx-auto">
          <Card className="rounded-3xl shadow-2xl border-8 border-secondary/50 bg-secondary">
            <CardContent className="p-24 text-center">
              <Badge variant="outline" className="rounded-full border-4 border-primary bg-primary/10 text-foreground px-8 py-4 text-2xl font-bold mb-16">
                {t("flow.step2")}
              </Badge>

              <div className="mb-16">
                <div className="flex items-baseline justify-center gap-8 mb-8">
                  <span className="text-4xl line-through text-muted-foreground">NT$8,000</span>
                  <span className="text-8xl font-bold text-green-600">NT$6,400</span>
                  <span className="text-3xl text-muted-foreground">{t("pricing.perMonth")}</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-3xl px-8 py-4">
                  {t("promo.save")} NT$1,600
                </Badge>
              </div>

              <div className="text-6xl font-bold text-signal-gold mb-8">
                選擇適合您的會員計畫
              </div>
              <p className="text-4xl text-muted-foreground">
                專業級或基礎級訓練方案
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ScheduleIntroSlide = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-signal-light-gray flex items-center justify-center py-24">
      <div className="container mx-auto px-16 text-center">
        <h2 className="text-8xl xl:text-9xl font-bold mb-24 font-lora text-signal-charcoal">
          {t('schedule.title')}
        </h2>
        <div className="text-5xl text-signal-charcoal font-medium leading-relaxed max-w-6xl mx-auto">
          每週選擇四堂課程，我們為專業選手和業餘愛好者提供不同的課程安排
        </div>
      </div>
    </div>
  );
};

const ClassTypesSlide = () => {
  const { t } = useLanguage();
  
  const classTypes = [
    { name: t('schedule.classes.mobility'), color: "bg-blue-500", description: "關節活動度與柔軟度訓練" },
    { name: t('schedule.classes.strength'), color: "bg-red-500", description: "肌力與肌耐力強化" },
    { name: t('schedule.classes.cardio'), color: "bg-green-500", description: "心肺功能提升訓練" },
    { name: t('schedule.classes.power'), color: "bg-purple-500", description: "爆發力與運動表現" },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-24">
      <div className="container mx-auto px-16">
        <div className="text-center mb-24">
          <h2 className="text-7xl font-bold mb-16 font-lora text-signal-charcoal">課程類型</h2>
        </div>

        <div className="grid grid-cols-2 gap-16 max-w-6xl mx-auto">
          {classTypes.map((classType, idx) => (
            <Card key={idx} className="shadow-2xl border-8 border-gray-100 text-center">
              <CardContent className="p-16">
                <div className={`w-24 h-24 rounded-full ${classType.color} flex items-center justify-center mx-auto mb-12`}>
                  <div className="text-white font-bold text-3xl">{idx + 1}</div>
                </div>
                <h3 className="text-5xl font-lora font-bold mb-8 text-signal-charcoal">
                  {classType.name}
                </h3>
                <p className="text-3xl text-muted-foreground leading-relaxed">
                  {classType.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-24 text-center">
          <div className="flex justify-center gap-16 text-2xl">
            <span className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-signal-gold/20 text-signal-charcoal px-6 py-3 text-xl font-bold uppercase tracking-wide ring-4 ring-signal-gold/40">
                {t('schedule.badge.pro')}
              </span>
              <span>=</span>
              <span>{t('schedule.legend.pros')}</span>
            </span>
            <span className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-signal-charcoal/15 text-signal-charcoal px-6 py-3 text-xl font-bold uppercase tracking-wide ring-4 ring-signal-charcoal/40">
                {t('schedule.badge.am')}
              </span>
              <span>=</span>
              <span>{t('schedule.legend.amateurs')}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutIntroSlide = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-signal-light-gray flex items-center justify-center py-24">
      <div className="container mx-auto px-16 text-center">
        <h2 className="text-8xl xl:text-9xl font-bold mb-24 text-signal-charcoal">
          {t('about.coach.title')}
        </h2>
        <div className="text-6xl text-signal-charcoal font-medium leading-relaxed max-w-6xl mx-auto">
          認識我們的專業教練
        </div>
      </div>
    </div>
  );
};

const CoachProfileSlide = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-24">
      <div className="container mx-auto px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-20 items-center">
            {/* Profile Section */}
            <div className="w-1/2">
              <div className="relative">
                <div className="absolute inset-0 border-4 border-signal-gold rounded-2xl transform translate-x-6 translate-y-6"></div>
                <img 
                  src="/lovable-uploads/9cd6f4c9-9cfc-435a-8ebb-2bbe20537915.png" 
                  alt="Dr. Noah Sachs" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover relative z-10 aspect-[3/4]"
                />
              </div>
            </div>
            
            <div className="w-1/2">
              <h3 className="text-6xl font-bold mb-6 text-signal-charcoal">{t('about.coach.name')}</h3>
              <p className="text-4xl text-signal-gold font-semibold mb-16">{t('about.coach.position')}</p>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-4xl font-bold mb-6 text-signal-charcoal">{t('about.coach.academic')}</h4>
                  <p className="text-3xl leading-relaxed text-signal-charcoal/90">
                    {t('about.coach.academic.degree')}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-4xl font-bold mb-6 text-signal-charcoal">{t('about.coach.experience')}</h4>
                  <ul className="text-3xl leading-relaxed text-signal-charcoal/90 space-y-4">
                    <li>{t('about.coach.experience.img')}</li>
                    <li>{t('about.coach.experience.usaf')}</li>
                    <li>{t('about.coach.experience.pga')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-24">
            <h4 className="text-5xl font-bold mb-16 text-center text-signal-charcoal">{t('about.coach.certifications')}</h4>
            
            <div className="grid grid-cols-6 gap-12 max-w-6xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32">
                  <img src="/lovable-uploads/1d022755-a8e7-481a-91db-13f7db87b26a.png" alt="PGA of America Member" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32">
                  <img src="/lovable-uploads/1dc02882-2327-403c-9e82-8b8207c618ff.png" alt="CSCS Certification" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32">
                  <img src="/lovable-uploads/09961efd-a840-417f-a93a-2e2990b91489.png" alt="CMPC Certification" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-32 h-32">
                  <img alt="BCIA Biofeedback Certification" className="w-full h-full object-contain" src="/lovable-uploads/b8e8e7d5-5980-475f-9534-3660f734bccf.png" />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-32 h-32">
                  <img alt="TPI Certified Fitness 3" className="w-full h-full object-contain" src="/lovable-uploads/80663943-a684-4747-88d6-29d27b58e790.png" />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-32 h-32">
                  <img alt="BCIA Neurofeedback Certification" className="w-full h-full object-contain" src="/lovable-uploads/650394e1-2bf5-4354-b912-86a81648eaaa.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QRCodeComponent = () => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = 'https://calendly.com/noah-signalperformance/assessment';
        const dataURL = await QRCode.toDataURL(url, {
          width: 200,
          margin: 2,
          color: {
            dark: '#425563', // signal-charcoal
            light: '#FFFFFF'
          }
        });
        setQrCodeDataURL(dataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-signal-gold p-6">
      <div className="text-center">
        {qrCodeDataURL && (
          <img src={qrCodeDataURL} alt="QR Code for Assessment Booking" className="w-48 h-48 mx-auto mb-4" />
        )}
        <p className="text-signal-charcoal font-bold text-xl mb-2">掃描預約評估</p>
        <p className="text-signal-charcoal/70 text-lg">Scan to Book Assessment</p>
      </div>
    </div>
  );
};

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = useMemo(() => [
    { id: 'hero', component: HeroSlide, title: '歡迎' },
    { id: 'philosophy-intro', component: PhilosophyIntroSlide, title: '訓練理念' },
    { id: 'philosophy-1', component: PhilosophyCard1Slide, title: '體能訓練' },
    { id: 'philosophy-2', component: PhilosophyCard2Slide, title: '心理訓練' },
    { id: 'philosophy-3', component: PhilosophyCard3Slide, title: '技術訓練' },
    { id: 'assessment-intro', component: AssessmentIntroSlide, title: '評估介紹' },
    { id: 'assessment-overview', component: AssessmentOverviewSlide, title: '評估項目' },
    { id: 'membership-intro', component: MembershipIntroSlide, title: '會員方案' },
    { id: 'assessment-package', component: AssessmentPackageSlide, title: '評估套餐' },
    { id: 'membership-plans', component: MembershipPlansSlide, title: '會員計畫' },
    { id: 'schedule-intro', component: ScheduleIntroSlide, title: '課程時間表' },
    { id: 'class-types', component: ClassTypesSlide, title: '課程類型' },
    { id: 'about-intro', component: AboutIntroSlide, title: '關於教練' },
    { id: 'coach-profile', component: CoachProfileSlide, title: '教練簡介' },
  ], []);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // 10 seconds per slide

    return () => clearInterval(interval);
  }, [slides.length, isAutoPlay]);

  // Pause auto-play when window loses focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsAutoPlay(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Main slide content */}
      <div className="transition-opacity duration-1000 ease-in-out">
        <CurrentSlideComponent />
      </div>

      {/* Progress indicator */}
      <div className="fixed top-8 left-8 right-8 z-40">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-signal-charcoal font-bold text-lg">
              {slides[currentSlide].title}
            </span>
            <span className="text-signal-charcoal/70 text-lg">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
          <Progress 
            value={((currentSlide + 1) / slides.length) * 100} 
            className="h-2" 
          />
        </div>
      </div>

      {/* Slide indicators */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex gap-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlay(false);
                setTimeout(() => setIsAutoPlay(true), 5000); // Resume after 5s
              }}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-signal-gold scale-125' 
                  : 'bg-signal-charcoal/30 hover:bg-signal-charcoal/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* QR Code - Always visible */}
      <QRCodeComponent />
    </div>
  );
};

export default Slideshow;