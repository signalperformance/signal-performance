import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const navItems = [{
    label: t('nav.membership'),
    href: '#membership'
  }, {
    label: t('nav.contact'),
    href: '#waitlist'
  }];
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };
  return <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-2">
          <span className="text-signal-charcoal text-xl font-playfair font-bold">Signal Performance</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          

          <div className="flex items-center ml-8 space-x-4">
            <button onClick={toggleLanguage} className="text-signal-charcoal hover:text-signal-gold transition-colors text-sm font-medium">
              {language === 'en' ? 'EN / 中文' : '中文 / EN'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Only Language Toggle */}
        <div className="md:hidden">
          <button onClick={toggleLanguage} className="text-signal-charcoal hover:text-signal-gold transition-colors text-sm font-medium">
            {language === 'en' ? 'EN / 中文' : '中文 / EN'}
          </button>
        </div>
      </div>
    </nav>;
};
export default Navbar;