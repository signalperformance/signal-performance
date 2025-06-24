
import { useLanguage } from '@/contexts/LanguageContext';

export const useDynamicFont = () => {
  const { language } = useLanguage();
  
  const getBodyFontClass = () => {
    return language === 'zh' ? 'font-ibm-plex-sans-jp' : 'font-montserrat';
  };
  
  const getHeadingFontClass = () => {
    return language === 'zh' ? 'font-ibm-plex-sans-jp' : 'font-lora';
  };
  
  return {
    bodyFont: getBodyFontClass(),
    headingFont: getHeadingFontClass(),
  };
};
