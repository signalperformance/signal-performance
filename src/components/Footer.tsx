import { useLanguage } from '@/contexts/LanguageContext';
const Footer = () => {
  const {
    language
  } = useLanguage();
  const currentYear = new Date().getFullYear();
  const copyrightText = language === 'zh' ? `© ${currentYear} Signal Performance。版權所有，保留一切權利。` : `© ${currentYear} Signal Performance. All rights reserved.`;
  return <footer className="bg-signal-black text-white py-6">
      <div className="container mx-auto container-padding">
        <div className="text-center text-muted-foreground text-sm">
          <p className="text-slate-50">{copyrightText}</p>
        </div>
      </div>
    </footer>;
};
export default Footer;