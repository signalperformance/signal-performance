
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  
  return (
    <section id="about" className="section-padding">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1636919476752-91dd4c75c98e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" 
                alt="Signal Performance facility" 
                className="rounded-lg shadow-lg w-full h-auto object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-signal-gold rounded-full hidden md:block"></div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">{t('about.title')}</h2>
            <p className="text-xl text-muted-foreground mb-8">{t('about.subtitle')}</p>
            
            <div className="space-y-6">
              <p className="text-lg">{t('about.paragraph1')}</p>
              <p className="text-lg">{t('about.paragraph2')}</p>
              <p className="text-lg">{t('about.paragraph3')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
