
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return <nav id="site-nav" className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'}`}>
      <div className="container mx-auto px-2 md:px-4 flex justify-between items-center">
        <a href="/" className="flex items-center justify-start gap-0.5 md:gap-1">
          <div className="w-6 md:w-10 h-6 md:h-10 flex-shrink-0">
            <img alt="Signal Performance Logo" className="h-full w-auto object-contain" src="/lovable-uploads/0959e8f0-e34c-4d16-9e3e-16462b6d8961.png" />
          </div>
          <span className="text-signal-charcoal md:text-2xl font-bold text-sm whitespace-nowrap brand-font">Signal Performance</span>
        </a>

        <div className="flex items-center space-x-2 md:space-x-4">
          <a href="https://signalperformance.lovable.app/auth">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs md:text-sm font-medium border-signal-gold text-signal-gold hover:bg-signal-gold hover:text-white transition-colors"
            >
              {t('nav.login')}
            </Button>
          </a>
          
          <div className="flex items-center space-x-1 md:space-x-2">
            <span className={`text-xs md:text-sm font-medium ${language === 'en' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>EN</span>
            <Switch checked={language === 'zh'} onCheckedChange={toggleLanguage} className="data-[state=checked]:bg-signal-gold data-[state=unchecked]:bg-signal-charcoal" />
            <span className={`text-xs md:text-sm font-medium ${language === 'zh' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>中文</span>
          </div>
        </div>
      </div>
    </nav>;
};

export default Navbar;
