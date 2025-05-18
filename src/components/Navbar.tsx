
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('nav.membership'), href: '#membership' },
    { label: t('nav.contact'), href: '#waitlist' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-2">
          <span className="text-signal-charcoal text-xl font-playfair font-bold">Signal Performance</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-signal-charcoal hover:text-signal-gold transition-colors text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center ml-8 space-x-4">
            <button
              onClick={toggleLanguage}
              className="text-signal-charcoal hover:text-signal-gold transition-colors text-sm font-medium"
            >
              {language === 'en' ? 'EN / 中文' : '中文 / EN'}
            </button>
            <Button 
              variant="outline" 
              className="bg-signal-charcoal text-white hover:bg-signal-charcoal/90 border-none"
            >
              {t('nav.login')}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="text-signal-charcoal hover:text-signal-gold transition-colors text-sm font-medium"
          >
            {language === 'en' ? 'EN / 中文' : '中文 / EN'}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-signal-charcoal"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-signal-charcoal hover:text-signal-gold transition-colors py-2 text-center font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button 
              variant="outline" 
              className="bg-signal-charcoal text-white hover:bg-signal-charcoal/90 border-none"
            >
              {t('nav.login')}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
