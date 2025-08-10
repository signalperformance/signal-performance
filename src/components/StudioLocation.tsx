import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const StudioLocation = () => {
  const { t } = useLanguage();

  const studioImages = [
    "/lovable-uploads/6723a627-2af6-4437-b182-0827e5f5607a.png",
    "/lovable-uploads/3f9f34d1-5282-432d-8d22-864d89331044.png",
    "/lovable-uploads/977dab8a-9542-465d-b44e-50204d8aeee4.png",
    "/lovable-uploads/fee6baaf-924e-4e08-a28d-08570d16ceab.png"
  ];

  const address = "2樓, 南勢里9鄰33-6號, Linkou District, New Taipei City, 244";
  const googleMapsLink = "https://www.google.com/maps/place/Signal+Performance/@25.0624007,121.3655983,15z/data=!4m6!3m5!1s0x3442a181e6db2efb:0xa10dc5b0275a90b9!8m2!3d25.0699173!4d121.351446!16s%2Fg%2F11xn5z_b3t?entry=ttu&g_ep=EgoyMDI1MDcyMC4wIKXMDSoASAFQAw%3D%3D";

  return (
    <section id="studio-location" className="section-padding">
      <div className="container mx-auto container-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-signal-charcoal font-lora">
              {t('studio.title')}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Images Carousel/Grid */}
            <div className="order-1 lg:order-1 animate-fade-in">
              {/* Carousel for both desktop and mobile */}
              <div className="relative">
                <Carousel className="w-full" opts={{ loop: true }}>
                  <CarouselContent>
                    {studioImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                          <img 
                            src={image} 
                            alt={`Studio view ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            </div>

            {/* Location Information */}
            <div className="order-2 lg:order-2 h-full animate-fade-in">
              <Card className="border-signal-gold/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-gray-100 h-full">
                <CardContent className="p-8 md:p-10 h-full flex flex-col justify-center">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-signal-charcoal mb-6 font-lora">
                        {t('studio.features.title')}
                      </h3>
                      <ul className="space-y-4 text-signal-charcoal/90 text-base md:text-lg">
                        <li className="flex space-x-3 items-start hover:text-signal-charcoal transition-colors duration-200">
                          <div className="w-3 h-3 bg-signal-gold rounded-full flex-shrink-0 mt-[0.6rem]"></div>
                          <span className="flex-1 leading-relaxed">{t('studio.features.equipment')}</span>
                        </li>
                        <li className="flex space-x-3 items-start hover:text-signal-charcoal transition-colors duration-200">
                          <div className="w-3 h-3 bg-signal-gold rounded-full flex-shrink-0 mt-[0.6rem]"></div>
                          <span className="flex-1 leading-relaxed">{t('studio.features.consultation')}</span>
                        </li>
                        <li className="flex space-x-3 items-start hover:text-signal-charcoal transition-colors duration-200">
                          <div className="w-3 h-3 bg-signal-gold rounded-full flex-shrink-0 mt-[0.6rem]"></div>
                          <span className="flex-1 leading-relaxed">{t('studio.features.access')}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        asChild
                        size="lg"
                        className="bg-signal-gold hover:bg-signal-gold/90 text-white w-full text-lg py-6 font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <a 
                          href={googleMapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-3"
                        >
                          <MapPin className="w-5 h-5" />
                          <span>{t('studio.address.mapButton')}</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioLocation;