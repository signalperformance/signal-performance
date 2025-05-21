
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { useWaitlistDialog } from '@/hooks/useWaitlistDialog';

const Hero = () => {
  const {
    t,
    language
  } = useLanguage();
  const {
    openWaitlist
  } = useWaitlistDialog();
  
  // Function to render headline with line break for Chinese
  const renderHeadline = () => {
    if (language === 'zh') {
      // Split the Chinese title after "的"
      const headlineText = t('hero.headline');
      const parts = headlineText.split('的');
      if (parts.length > 1) {
        return (
          <>
            {parts[0]}的<br className="md:hidden" />{parts[1]}
          </>
        );
      }
      return headlineText;
    }
    return t('hero.headline');
  };
  
  return <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background - using a clean white background */}
      <div className="absolute inset-0 z-0 bg-white"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-signal-charcoal max-w-5xl mx-auto leading-tight">
          {renderHeadline()}
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-signal-charcoal/80">{t('hero.subheadline')}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Button className="bg-signal-charcoal hover:bg-signal-charcoal/90 text-white font-medium px-8 py-6 text-lg flex items-center gap-2" size="lg" onClick={openWaitlist}>
            {t('hero.cta.waitlist')} <ArrowRight size={18} />
          </Button>
          <Button className="bg-white hover:bg-gray-100 text-signal-charcoal font-medium border border-gray-200 px-8 py-6 text-lg" variant="outline" size="lg" onClick={() => document.getElementById('membership')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            {t('hero.cta.membership')}
          </Button>
        </div>
      </div>
    </section>;
};
export default Hero;
