import { useLanguage } from '@/contexts/LanguageContext';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-signal-black text-white py-12">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-playfair font-bold mb-2">Signal Performance</h3>
            <p className="text-white/70 text-sm max-w-xs">
              Taiwan's premier private club for elite golfers integrating physical, mental, and golf skill training.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-signal-gold">Address</h4>
              <address className="not-italic text-white/70">
                101 Golf Avenue<br />
                Taipei City, Taiwan<br />
                10001
              </address>
            </div>
            
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-signal-gold">Contact</h4>
              <p className="text-white/70">noah@signalperformance.golf</p>
              <p className="text-white/70">+886 2 1234 5678</p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-signal-gold">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-white/70 hover:text-signal-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-signal-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-signal-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-white/70 text-sm">
          <p>© {currentYear} Signal Performance. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;