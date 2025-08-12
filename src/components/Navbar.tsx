
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';

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
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#home" className="flex items-center justify-start gap-1">
          <div className="w-8 md:w-10 h-8 md:h-10 flex-shrink-0">
            <img alt="Signal Performance Logo" className="h-full w-auto object-contain" src="/lovable-uploads/0959e8f0-e34c-4d16-9e3e-16462b6d8961.png" />
          </div>
          <span className="text-signal-charcoal md:text-2xl font-bold text-lg brand-font">Signal Performance</span>
        </a>

        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${language === 'en' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>EN</span>
          <Switch checked={language === 'zh'} onCheckedChange={toggleLanguage} className="data-[state=checked]:bg-signal-gold data-[state=unchecked]:bg-signal-charcoal" />
          <span className={`text-sm font-medium ${language === 'zh' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>中文</span>
        </div>
      </div>
    </nav>;
};

export default Navbar;
