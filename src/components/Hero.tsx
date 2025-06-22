
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

const Hero = () => {
  const { t, language } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  // Get headline and subtitle text
  const headlineText = t('hero.headline');
  const subtitleText = language === 'zh' 
    ? '體能、心理與技術訓練集中於一個專業空間'
    : 'Physical, mental, and skill training — all in one place';

  // Create mobile-friendly headline for English
  const getMobileHeadline = () => {
    if (language === 'zh' || !isMobile) {
      return headlineText;
    }
    // For English on mobile, split after "Space"
    return headlineText.replace('Space', 'Space\n');
  };

  const displayHeadline = getMobileHeadline();

  // Check for mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Custom assessment button text
  const getAssessmentButtonText = () => {
    return language === 'zh' ? '預約評估' : 'Book Assessment';
  };

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden flex items-center justify-center">
      {/* Modern Background with CSS-only animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-gray-100">
        {/* Animated geometric shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-signal-gold/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-signal-charcoal/5 rounded-full blur-2xl animate-gentle-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-signal-gold/15 rounded-full blur-lg animate-pulse delay-1000"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(66, 85, 99, 0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>
      
      {/* Content Card */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-0">
        <div className="max-w-4xl mx-auto text-center">
          {/* Modern card container with gradient background like WhoItsFor section */}
          <div className="bg-gradient-to-br from-signal-charcoal via-signal-charcoal/95 to-signal-black backdrop-blur-sm rounded-2xl shadow-xl border border-signal-charcoal/60 p-8 md:p-12 lg:p-16 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-signal-charcoal/30 to-signal-black/20 pointer-events-none rounded-2xl"></div>
            
            <div className="relative z-10">
              <h1 className={`font-bold mb-4 text-white leading-tight ${
                isMobile 
                  ? 'text-3xl sm:text-4xl' 
                  : 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
              }`}
              style={{ 
                whiteSpace: isMobile && language === 'en' ? 'pre-line' : 'normal'
              }}>
                {displayHeadline}
              </h1>
              
              <p className={`text-white/90 mb-8 sm:mb-12 ${
                isMobile 
                  ? 'text-lg sm:text-xl' 
                  : 'text-xl md:text-2xl lg:text-3xl'
              }`}>
                {subtitleText}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                {/* Philosophy button */}
                <Button 
                  size="lg" 
                  onClick={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="text-signal-charcoal font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg flex items-center gap-2 bg-white hover:bg-white/90 active:bg-white focus:bg-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  {t('hero.cta.membership')}
                </Button>
                
                {/* Assessment button - links to LINE */}
                <Button 
                  size="lg" 
                  asChild
                  className="font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg text-signal-charcoal bg-signal-gold hover:bg-signal-gold/90 active:bg-signal-gold focus:bg-signal-gold transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <a 
                    href="https://lin.ee/CaWvRmo" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {getAssessmentButtonText()}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
