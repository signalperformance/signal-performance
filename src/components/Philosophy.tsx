
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useLanguage } from '@/contexts/LanguageContext';

const Philosophy = () => {
  const { t, language } = useLanguage();

  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off?.("select", onSelect);
    };
  }, [api]);

  const cards = [
    { key: "card1", title: t('philosophy.card1.title'), content: t('philosophy.card1.content') },
    { key: "card2", title: t('philosophy.card2.title'), content: t('philosophy.card2.content') },
    { key: "card3", title: t('philosophy.card3.title'), content: t('philosophy.card3.content') },
  ];

  return (
    <section className="section-padding bg-signal-light-gray">
      <div className="container mx-auto container-padding">
        <h2 data-scroll-anchor className="text-3xl lg:text-4xl font-bold mb-0 lg:mb-12 text-center font-lora">{t('philosophy.title')}</h2>
        
        {/* Signal wave graphic - responsive images for different screen sizes and languages */}
        <div className="w-full mb-6 lg:mb-12 relative h-36 lg:h-32 flex items-center justify-center">
          {/* Mobile images based on language */}
          {language === 'zh' ? (
            <img 
              alt="Signal wave with red spike (Chinese)" 
              className="w-full max-w-5xl h-auto object-contain lg:hidden" 
              src="/lovable-uploads/4bdd82f1-a74e-471c-ad2d-72a158c7e24e.png"
              loading="eager"
            />
          ) : (
            <img 
              alt="Signal wave with red spike" 
              className="w-full max-w-5xl h-auto object-contain lg:hidden" 
              src="/lovable-uploads/bad88ef0-fed5-4d79-90c4-5fbeed980400.png"
              loading="eager"
            />
          )}
          
          {/* Desktop images based on language */}
          {language === 'zh' ? (
            <img 
              alt="Signal wave with red spike (Chinese)" 
              className="w-full max-w-5xl h-auto object-contain hidden lg:block" 
              src="/lovable-uploads/23ce2472-9cbc-4d05-bd80-cd0ac6eb27a8.png"
              loading="eager"
            />
          ) : (
            <img 
              alt="Signal wave with red spike" 
              className="w-full max-w-5xl h-auto object-contain hidden lg:block" 
              src="/lovable-uploads/2277bfb2-f510-4e78-bf50-410d94a0f83b.png"
              loading="eager"
            />
          )}
        </div>
        
        {/* Philosophy cards - mobile carousel and desktop grid */}
        {/* Mobile: show one card at a time to save space */}
        <div className="lg:hidden">
          <Carousel setApi={setApi} opts={{ align: "start", loop: false }}>
            <CarouselContent>
              {cards.map((c) => (
                <CarouselItem key={c.key} className="basis-full">
                  <Card className="text-left shadow-xl bg-white lg:hover:shadow-2xl transition-all duration-500 lg:hover:scale-105 h-full border-2 border-gray-100 group animate-scale-in">
                    <CardContent className="p-8">
                      <CardTitle className="text-xl font-lora mb-4 text-signal-charcoal transition-colors duration-300">
                        {c.title}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {c.content}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dots indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                aria-label={`Show card ${i + 1}`}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors",
                  current === i ? "bg-primary" : "bg-muted-foreground/25"
                )}
              />
            ))}
          </div>
        </div>

        {/* Desktop: keep three-card layout */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {cards.map((c) => (
            <Card key={c.key} className="text-left shadow-xl bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105 h-full border-2 border-gray-100 group animate-scale-in">
              <CardContent className="p-8 lg:p-10">
                <CardTitle className="text-xl lg:text-2xl font-lora mb-4 text-signal-charcoal transition-colors duration-300">
                  {c.title}
                </CardTitle>
                <p className="text-muted-foreground group-hover:translate-x-2 transition-transform duration-300">
                  {c.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
