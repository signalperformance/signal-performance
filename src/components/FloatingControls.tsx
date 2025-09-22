import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Globe } from 'lucide-react';

const FloatingControls = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
      {/* Member Login Button */}
      <Link to="/client/login">
        <Button
          size="sm"
          className="bg-white/95 backdrop-blur-sm hover:bg-signal-gold hover:text-white text-signal-charcoal border border-signal-gold/20 shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{t('nav.login')}</span>
        </Button>
      </Link>

      {/* Language Toggle */}
      <div className="bg-white/95 backdrop-blur-sm border border-signal-gold/20 rounded-md px-3 py-2 shadow-lg flex items-center gap-2">
        <Globe className="w-4 h-4 text-signal-charcoal" />
        <div className="flex items-center gap-1">
          <span className={`text-xs font-medium transition-colors ${language === 'en' ? 'text-signal-gold' : 'text-signal-charcoal/60'}`}>
            EN
          </span>
          <Switch 
            checked={language === 'zh'} 
            onCheckedChange={toggleLanguage} 
            className="data-[state=checked]:bg-signal-gold data-[state=unchecked]:bg-signal-charcoal/30 scale-75"
          />
          <span className={`text-xs font-medium transition-colors ${language === 'zh' ? 'text-signal-gold' : 'text-signal-charcoal/60'}`}>
            中文
          </span>
        </div>
      </div>
    </div>
  );
};

export default FloatingControls;