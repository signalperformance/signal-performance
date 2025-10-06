import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="https://signalperformance.lovable.app/auth">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs md:text-sm font-medium border-signal-gold text-signal-gold hover:bg-signal-gold hover:text-white transition-colors"
              >
                {t('nav.login')}
              </Button>
            </a>
            
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${language === 'en' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>EN</span>
              <Switch checked={language === 'zh'} onCheckedChange={toggleLanguage} className="data-[state=checked]:bg-signal-gold data-[state=unchecked]:bg-signal-charcoal" />
              <span className={`text-sm font-medium ${language === 'zh' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>中文</span>
            </div>
          </div>

          {/* Mobile hamburger menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5 text-signal-charcoal" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-6 mt-8">
                <a href="https://signalperformance.lovable.app/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full border-signal-gold text-signal-gold hover:bg-signal-gold hover:text-white transition-colors"
                  >
                    {t('nav.login')}
                  </Button>
                </a>
                
                <div className="flex items-center justify-center space-x-2 pt-4 border-t">
                  <span className={`text-sm font-medium ${language === 'en' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>EN</span>
                  <Switch checked={language === 'zh'} onCheckedChange={toggleLanguage} className="data-[state=checked]:bg-signal-gold data-[state=unchecked]:bg-signal-charcoal" />
                  <span className={`text-sm font-medium ${language === 'zh' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>中文</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>;
};

export default Navbar;
