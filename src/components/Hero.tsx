
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
  const { t, language } = useLanguage();

  // Get headline and subtitle text - synchronous to prevent delays
  const headlineText = t('hero.headline');
  const subtitleText = language === 'zh' 
    ? '體能、心理與技術訓練集中於一個專業空間'
    : 'Physical, mental, and skill training — all in one place';

  // Custom assessment button text
  const getAssessmentButtonText = () => {
    return language === 'zh' ? '預約評估' : 'Book Assessment';
  };

  const handleBookAssessment = () => {
    window.location.href = 'https://calendly.com/noah-signalperformance/assessment';
  };

  const handleScrollToPhilosophy = () => {
    const section = document.getElementById('philosophy');
    if (!section) return;

    const nav = document.getElementById("site-nav");
    const offset = (nav?.offsetHeight ?? 0) + 12; // extra space so previous section color isn't visible

    const anchor = section.querySelector("[data-scroll-anchor], h1, h2, h3") as HTMLElement | null;
    const target = anchor ?? section;

    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden flex items-center justify-center">
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
        <div className="max-w-6xl mx-auto text-center">
          {/* Modern card container with signal-charcoal background */}
          <div className="bg-signal-charcoal/95 backdrop-blur-sm rounded-2xl shadow-xl border border-signal-charcoal/60 p-8 md:p-12 lg:p-16">
            <h1 data-scroll-anchor className="font-bold mb-4 text-white leading-tight text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl transition-all duration-300">
              {headlineText}
            </h1>
            
            <p className="text-white mb-8 sm:mb-12 text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl transition-all duration-300">
              {subtitleText}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              {/* Philosophy button */}
              <Button 
                size="lg" 
                onClick={handleScrollToPhilosophy} 
                className="text-signal-charcoal font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg flex items-center gap-2 bg-white hover:bg-white/90 active:bg-white focus:bg-white transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                {t('hero.cta.membership')}
              </Button>
              
              {/* Assessment button - now navigates directly to Calendly */}
              <Button 
                size="lg" 
                onClick={handleBookAssessment}
                className="font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg text-white bg-signal-gold hover:bg-signal-gold/90 active:bg-signal-gold focus:bg-signal-gold transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                {getAssessmentButtonText()}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
