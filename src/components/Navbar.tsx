
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
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload the logo image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.src = "/lovable-uploads/cfdb7d55-6112-4f0a-ab39-6a01df835f6b.png";
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#home" className={`flex items-center justify-start gap-1 transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-8 md:w-10 h-8 md:h-10 flex-shrink-0">
            <img 
              src="/lovable-uploads/cfdb7d55-6112-4f0a-ab39-6a01df835f6b.png" 
              alt="Signal Performance Logo" 
              className="h-full w-auto object-contain"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <span className="text-signal-charcoal text-xl md:text-2xl font-playfair font-bold">Signal Performance</span>
        </a>

        <div className={`flex items-center space-x-2 transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className={`text-sm font-medium ${language === 'en' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>EN</span>
          <Switch 
            checked={language === 'zh'}
            onCheckedChange={toggleLanguage}
            className="data-[state=checked]:bg-signal-gold data-[state=unchecked]:bg-signal-charcoal"
          />
          <span className={`text-sm font-medium ${language === 'zh' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>中文</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
