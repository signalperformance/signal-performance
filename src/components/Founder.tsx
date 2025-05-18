
import { useLanguage } from '@/contexts/LanguageContext';

const Founder = () => {
  const { t } = useLanguage();
  
  return (
    <section id="founder" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">{t('founder.title')}</h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <div className="absolute inset-0 border-2 border-signal-gold rounded-lg transform translate-x-4 translate-y-4"></div>
                <img 
                  src="https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80" 
                  alt="Signal Performance Founder" 
                  className="rounded-lg shadow-lg w-full h-auto object-cover relative z-10 aspect-[3/4]"
                />
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <h3 className="text-2xl font-bold mb-2 font-playfair">{t('founder.name')}</h3>
              <p className="text-sm text-signal-gold font-medium mb-6">{t('founder.credentials')}</p>
              <p className="text-lg leading-relaxed">{t('founder.bio')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
