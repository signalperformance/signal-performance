import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram } from 'lucide-react';
const Footer = () => {
  const {
    language
  } = useLanguage();
  const currentYear = new Date().getFullYear();
  const copyrightText = language === 'zh' ? `© ${currentYear} Signal Performance。版權所有，保留一切權利。` : `© ${currentYear} Signal Performance. All rights reserved.`;
  return <footer id="contact" className="bg-signal-black text-white py-6 scroll-mt-24 lg:scroll-mt-32">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-4">
          <a 
            href="https://www.instagram.com/signalperformance/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-slate-50 hover:text-signal-gold transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
        </div>
        <div className="text-center text-muted-foreground text-sm">
          <p className="text-slate-50 text-xs">{copyrightText}</p>
        </div>
      </div>
    </footer>;
};
export default Footer;