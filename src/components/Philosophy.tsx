
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

const Philosophy = () => {
  const {
    t,
    language
  } = useLanguage();

  return <section id="philosophy" className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-lora">{t('philosophy.title')}</h2>
        
        {/* Signal wave graphic - responsive images for different screen sizes and languages */}
        <div className="w-full mb-12 relative h-36 md:h-32 flex items-center justify-center">
          {/* Mobile images based on language */}
          {language === 'zh' ? (
            <img alt="Signal wave with red spike (Chinese)" className="w-full max-w-5xl h-auto object-contain md:hidden" src="/lovable-uploads/02648a92-ba42-467d-b308-7d76e55376a2.png" />
          ) : (
            <img alt="Signal wave with red spike" className="w-full max-w-5xl h-auto object-contain md:hidden" src="/lovable-uploads/614bffe2-0ec7-4876-9688-d9dd206fc83e.png" />
          )}
          
          {/* Desktop images based on language */}
          {language === 'zh' ? (
            <img alt="Signal wave with red spike (Chinese)" className="w-full max-w-5xl h-auto object-contain hidden md:block" src="/lovable-uploads/02648a92-ba42-467d-b308-7d76e55376a2.png" />
          ) : (
            <img alt="Signal wave with red spike" className="w-full max-w-5xl h-auto object-contain hidden md:block" src="/lovable-uploads/06356803-be6d-4dce-b006-b5944a61d7f8.png" />
          )}
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
