
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

const Philosophy = () => {
  const {
    t,
    language
  } = useLanguage();
  return <section id="philosophy" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-12 text-center font-lora">{t('philosophy.title')}</h2>
        
        {/* Signal wave graphic - responsive images for different screen sizes and languages */}
        <div className="w-full mb-12 md:mb-12 mb-6 relative h-36 md:h-32 flex items-center justify-center">
          {/* Mobile images based on language */}
          {language === 'zh' ? <img alt="Signal wave with red spike (Chinese)" className="w-full max-w-5xl h-auto object-contain md:hidden" src="/lovable-uploads/4bdd82f1-a74e-471c-ad2d-72a158c7e24e.png" /> : <img alt="Signal wave with red spike" className="w-full max-w-5xl h-auto object-contain md:hidden" src="/lovable-uploads/bad88ef0-fed5-4d79-90c4-5fbeed980400.png" />}
          
          {/* Desktop images based on language */}
          {language === 'zh' ? <img alt="Signal wave with red spike (Chinese)" className="w-full max-w-5xl h-auto object-contain hidden md:block" src="/lovable-uploads/23ce2472-9cbc-4d05-bd80-cd0ac6eb27a8.png" /> : <img alt="Signal wave with red spike" className="w-full max-w-5xl h-auto object-contain hidden md:block" src="/lovable-uploads/2277bfb2-f510-4e78-bf50-410d94a0f83b.png" />}
        </div>
        
        {/* Philosophy cards - horizontal layout on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border rounded-lg p-6">
            <CardTitle className="text-xl md:text-2xl font-lora mb-4 text-signal-charcoal">{t('philosophy.card1.title')}</CardTitle>
            <p className="text-muted-foreground">{t('philosophy.card1.content')}</p>
          </Card>
          
          <Card className="border rounded-lg p-6">
            <CardTitle className="text-xl md:text-2xl font-lora mb-4 text-signal-charcoal">{t('philosophy.card2.title')}</CardTitle>
            <p className="text-muted-foreground">{t('philosophy.card2.content')}</p>
          </Card>
          
          <Card className="border rounded-lg p-6">
            <CardTitle className="text-xl md:text-2xl font-lora mb-4 text-signal-charcoal">{t('philosophy.card3.title')}</CardTitle>
            <p className="text-muted-foreground">{t('philosophy.card3.content')}</p>
          </Card>
        </div>
      </div>
    </section>;
};
export default Philosophy;
