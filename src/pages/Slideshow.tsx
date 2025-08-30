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
      <div className="absolute top-10 left-10 w-32 h-32 bg-signal-gold/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-48 h-48 bg-signal-charcoal/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-signal-gold/15 rounded-full blur-lg animate-pulse delay-500"></div>
      
      <div className="relative z-10 container mx-auto px-8 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="bg-signal-charcoal/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-signal-charcoal/60 p-16">
            <h1 className="font-bold mb-8 text-white leading-tight text-6xl xl:text-8xl transition-all duration-300">
              {t('hero.headline')}
            </h1>
            <p className="text-white mb-12 text-3xl xl:text-4xl transition-all duration-300">
              體能、心理與技術訓練集中於一個專業空間
            </p>
            <div className="text-signal-gold text-4xl font-bold">
              歡迎來到信號表現訓練中心
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PhilosophySlide = () => {
  const { t } = useLanguage();
  
  const cards = [
    { key: "card1", title: t('philosophy.card1.title'), content: t('philosophy.card1.content') },
    { key: "card2", title: t('philosophy.card2.title'), content: t('philosophy.card2.content') },
    { key: "card3", title: t('philosophy.card3.title'), content: t('philosophy.card3.content') },
  ];

  return (
    <div className="min-h-screen bg-signal-light-gray flex items-center justify-center py-16">
      <div className="container mx-auto px-8">
        <h2 className="text-6xl font-bold mb-16 text-center font-lora text-signal-charcoal">
          {t('philosophy.title')}
        </h2>
        
        {/* Signal wave graphic */}
        <div className="w-full mb-16 flex items-center justify-center">
          <img 
            alt="Signal wave with red spike (Chinese)" 
            className="w-full max-w-6xl h-auto object-contain" 
            src="/lovable-uploads/23ce2472-9cbc-4d05-bd80-cd0ac6eb27a8.png"
            loading="eager"
          />
        </div>
        
        {/* Philosophy cards grid */}
        <div className="grid grid-cols-3 gap-12">
          {cards.map((c) => (
            <Card key={c.key} className="text-left shadow-2xl bg-white border-4 border-gray-100 animate-scale-in">
              <CardContent className="p-12">
                <h3 className="text-3xl font-lora mb-6 text-signal-charcoal font-bold">
                  {c.title}
                </h3>
                <p className="text-muted-foreground text-xl leading-relaxed">
                  {c.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const MembershipFlowSlide = () => {
  const { t } = useLanguage();
  
  const assessmentFeatures = [
    t("gettingstarted.assessmentPackage.bullets.assess"), 
    t("gettingstarted.assessmentPackage.bullets.review"), 
    t("gettingstarted.assessmentPackage.bullets.train")
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16">
      <div className="container mx-auto px-8">
        <h2 className="text-6xl font-bold mb-16 text-center font-lora text-signal-charcoal">
          {t("pricing.title")}
        </h2>
        
        <div className="grid grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Step 1: Assessment Card */}
          <Card className="rounded-3xl shadow-2xl border-4 border-primary/20">
            <CardContent className="p-12">
              <Badge variant="outline" className="rounded-full border-2 border-primary bg-primary/10 text-foreground px-6 py-3 text-lg font-bold mb-8">
                {t("flow.step1")}
              </Badge>

              {/* Assessment Promo Banner */}
              <div className="mb-8 bg-gradient-to-r from-red-500/90 to-orange-500/90 text-white rounded-2xl p-6">
                <div className="text-center">
                  <h4 className="font-bold text-xl mb-4">{t("promo.limitedOffer")}</h4>
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center gap-3 min-w-[200px]">
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div className="bg-white rounded-full h-3 w-1/5 transition-all duration-500" />
                      </div>
                      <div className="text-base font-medium">
                        <span className="font-bold">2</span> {t("promo.spotsTaken")} • <span className="font-bold">8</span> {t("promo.remaining")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-2xl line-through text-muted-foreground">NT$12,000</span>
                  <span className="text-6xl font-bold text-green-600">{t("gettingstarted.assessmentPackage.price")}</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-lg px-4 py-2">
                  {t("promo.save")} NT$2,000
                </Badge>
                <p className="mt-4 text-lg text-muted-foreground">
                  {t("assessment.description")}
                </p>
              </div>

              <ul className="space-y-6">
                {assessmentFeatures.map(name => (
                  <li key={name} className="flex gap-4 items-center">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-foreground">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div className="text-xl font-medium">{name}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Step 2: Membership Card */}
          <Card className="rounded-3xl shadow-2xl border-4 border-secondary/50 bg-secondary">
            <CardContent className="p-12">
              <Badge variant="outline" className="rounded-full border-2 border-primary bg-primary/10 text-foreground px-6 py-3 text-lg font-bold mb-8">
                {t("flow.step2")}
              </Badge>

              <div className="mb-8 bg-gradient-to-r from-red-500/90 to-orange-500/90 text-white rounded-2xl p-6">
                <div className="text-center">
                  <h4 className="font-bold text-xl mb-4">{t("promo.limitedOffer")}</h4>
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center gap-3 min-w-[200px]">
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div className="bg-white rounded-full h-3 w-1/5 transition-all duration-500" />
                      </div>
                      <div className="text-base font-medium">
                        <span className="font-bold">2</span> {t("promo.spotsTaken")} • <span className="font-bold">8</span> {t("promo.remaining")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-2xl line-through text-muted-foreground">NT$8,000</span>
                  <span className="text-6xl font-bold text-green-600">NT$6,400</span>
                  <span className="text-xl text-muted-foreground">{t("pricing.perMonth")}</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-lg px-4 py-2">
                  {t("promo.save")} NT$1,600
                </Badge>
                <p className="mt-4 text-lg text-muted-foreground">
                  專業會員計畫包含完整的訓練服務
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-signal-gold mb-4">
                  選擇適合您的會員計畫
                </div>
                <p className="text-xl text-muted-foreground">
                  專業級或基礎級訓練方案
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AssessmentProcessSlide = () => {
  const { t } = useLanguage();
  
  const assessments = {
    mobility: { title: t('assessment.joint.title'), icon: Move, description: t('assessment.joint.description'), number: 1, color: "bg-blue-500" },
    strength: { title: t('assessment.strength.title'), icon: Dumbbell, description: t('assessment.strength.description'), number: 2, color: "bg-red-500" },
    metabolic: { title: t('assessment.metabolic.title'), icon: Activity, description: t('assessment.metabolic.description'), number: 3, color: "bg-green-500" },
    body: { title: t('assessment.body.title'), icon: User, description: t('assessment.body.description'), number: 4, color: "bg-purple-500" },
    golf: { title: t('assessment.golf.title'), icon: Club, description: t('assessment.golf.description'), number: 5, color: "bg-signal-gold" }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-8 font-lora text-signal-charcoal">{t('assessment.title')}</h2>
          <p className="max-w-5xl mx-auto text-2xl text-muted-foreground leading-relaxed">
            {t('assessment.processDescription')}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-8 max-w-7xl mx-auto">
          {Object.entries(assessments).map(([key, assessment]) => (
            <Card key={key} className="shadow-2xl border-4 border-gray-100 text-center">
              <CardContent className="p-8">
                <div className={`w-20 h-20 rounded-full ${assessment.color} flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6`}>
                  {assessment.number}
                </div>
                <h3 className="text-2xl font-lora font-bold mb-4 text-signal-charcoal">
                  {assessment.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {assessment.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="text-4xl font-bold text-signal-gold">
            完整的五步驟評估流程
          </div>
        </div>
      </div>
    </div>
  );
};

const WeeklyScheduleSlide = () => {
  const { t } = useLanguage();
  
  type Item = {
    hour24: number;
    minute?: number;
    labelKey: 'mobility' | 'strength' | 'cardio' | 'power';
    pro?: boolean;
  };

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
    { title: t('schedule.columns.mwf'), items: mwf },
    { title: t('schedule.columns.tth'), items: tth },
    { title: t('schedule.columns.weekend'), items: weekend },
  ];

  const formatTime = (hour24: number, minute: number = 0) => {
    return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16">
      <div className="container mx-auto px-8">
        <header className="mb-16 text-center">
          <h2 className="text-6xl font-bold font-lora text-signal-charcoal mb-8">
            {t('schedule.title')}
          </h2>
          <p className="text-2xl text-muted-foreground font-montserrat max-w-4xl mx-auto">
            每週選擇四堂課程，我們為專業選手和業餘愛好者提供不同的課程安排
          </p>
        </header>

        <div className="grid grid-cols-3 gap-12 max-w-7xl mx-auto">
          {columns.map((col, idx) => (
            <Card key={idx} className="overflow-hidden border-4 border-border/70 shadow-2xl">
              <div className="h-2 w-full bg-signal-gold" />
              <div className="p-8">
                <h3 className="text-center text-2xl font-bold text-foreground mb-8">
                  {col.title}
                </h3>
                <ul className="space-y-4">
                  {col.items.map((it, i) => (
                    <li
                      key={i}
                      className={`relative grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg border-2 border-border/60 px-4 py-3 ${
                        it.pro ? 'bg-signal-gold/10' : 'bg-card/50'
                      }`}
                    >
                      {it.pro && (
                        <span className="absolute left-0 top-0 h-full w-2 bg-signal-gold rounded-l-lg" />
                      )}
                      <span className="inline-flex items-center gap-2 text-base text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        {formatTime(it.hour24, it.minute)}
                      </span>
                      <span className="text-xl font-extrabold font-lora text-foreground text-center">
                        {t(`schedule.classes.${it.labelKey}`)}
                      </span>
                      <span>
                        {it.pro ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-signal-gold/20 text-signal-charcoal px-3 py-1 text-sm font-bold uppercase tracking-wide ring-2 ring-signal-gold/40">
                            {t('schedule.badge.pro')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-signal-charcoal/15 text-signal-charcoal px-3 py-1 text-sm font-bold uppercase tracking-wide ring-2 ring-signal-charcoal/40">
                            {t('schedule.badge.am')}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="flex justify-center gap-12 text-xl">
            <span className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-signal-gold/20 text-signal-charcoal px-4 py-2 text-base font-bold uppercase tracking-wide ring-2 ring-signal-gold/40">
                {t('schedule.badge.pro')}
              </span>
              <span>=</span>
              <span>{t('schedule.legend.pros')}</span>
            </span>
            <span className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-signal-charcoal/15 text-signal-charcoal px-4 py-2 text-base font-bold uppercase tracking-wide ring-2 ring-signal-charcoal/40">
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

const AboutSlide = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16">
      <div className="container mx-auto px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold mb-8 text-signal-charcoal">{t('about.coach.title')}</h2>
          </div>
          
          <div className="flex gap-16 items-center">
            {/* Profile Section */}
            <div className="w-1/3">
              <div className="mb-8">
                <div className="rounded-2xl overflow-hidden bg-signal-gold/20 relative">
                  <img src="/lovable-uploads/9cd6f4c9-9cfc-435a-8ebb-2bbe20537915.png" alt="Dr. Noah Sachs" className="object-cover w-full h-full" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-signal-charcoal mb-2">{t('about.coach.name')}</h3>
                <p className="text-signal-gold text-2xl font-semibold">{t('about.coach.position')}</p>
              </div>
            </div>
            
            {/* Bio & Certification Section */}
            <div className="w-2/3">
              {/* Academic & Experience Card */}
              <Card className="mb-8 shadow-2xl border-4 border-gray-100">
                <CardContent className="p-12">
                  <div className="mb-8">
                    <h4 className="text-3xl font-bold mb-6 text-signal-charcoal">{t('about.coach.academic')}</h4>
                    <p className="text-xl leading-relaxed text-signal-charcoal/90">
                      {t('about.coach.academic.degree')}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-3xl font-bold mb-6 text-signal-charcoal">{t('about.coach.experience')}</h4>
                    <ul className="text-xl leading-relaxed text-signal-charcoal/90 space-y-3">
                      <li>{t('about.coach.experience.img')}</li>
                      <li>{t('about.coach.experience.usaf')}</li>
                      <li>{t('about.coach.experience.pga')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Certifications Card */}
              <Card className="shadow-2xl border-4 border-gray-100">
                <CardContent className="p-12">
                  <h4 className="text-3xl font-bold mb-8 text-signal-charcoal">{t('about.coach.certifications')}</h4>
                  
                  <div className="grid grid-cols-6 gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24">
                        <img src="/lovable-uploads/1d022755-a8e7-481a-91db-13f7db87b26a.png" alt="PGA of America Member" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24">
                        <img src="/lovable-uploads/1dc02882-2327-403c-9e82-8b8207c618ff.png" alt="CSCS Certification" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24">
                        <img src="/lovable-uploads/09961efd-a840-417f-a93a-2e2990b91489.png" alt="CMPC Certification" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-24 h-24">
                        <img alt="BCIA Biofeedback Certification" className="w-full h-full object-contain" src="/lovable-uploads/b8e8e7d5-5980-475f-9534-3660f734bccf.png" />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-24 h-24">
                        <img alt="TPI Certified Fitness 3" className="w-full h-full object-contain" src="/lovable-uploads/80663943-a684-4747-88d6-29d27b58e790.png" />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-24 h-24">
                        <img alt="BCIA Neurofeedback Certification" className="w-full h-full object-contain" src="/lovable-uploads/650394e1-2bf5-4354-b912-86a81648eaaa.png" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
    { id: 'philosophy', component: PhilosophySlide, title: '理念' },
    { id: 'membership-flow', component: MembershipFlowSlide, title: '會員方案' },
    { id: 'assessment-process', component: AssessmentProcessSlide, title: '評估流程' },
    { id: 'schedule', component: WeeklyScheduleSlide, title: '課程時間表' },
    { id: 'about', component: AboutSlide, title: '關於教練' },
  ], []);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // 8 seconds per slide

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