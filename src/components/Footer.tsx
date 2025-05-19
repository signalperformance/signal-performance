
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-signal-black text-white py-6">
      <div className="container mx-auto container-padding">
        <div className="text-center text-white/70 text-sm">
          <p>© {currentYear} Signal Performance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
