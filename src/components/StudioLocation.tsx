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
    <section id="studio-location" className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-signal-charcoal font-lora">
              {t('studio.title')}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Images Carousel/Grid */}
            <div className="order-1 lg:order-1">
              {/* Carousel for both desktop and mobile */}
              <div className="relative">
                <Carousel className="w-full" opts={{ loop: true }}>
                  <CarouselContent>
                    {studioImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                          <img 
                            src={image} 
                            alt={`Studio view ${index + 1}`}
                            className="w-full h-full object-cover"
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
            <div className="order-2 lg:order-2">
              <Card className="border-signal-gold/20 shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-signal-charcoal mb-2">
                        {t('studio.address.title')}
                      </h3>
                      <div className="text-signal-charcoal/80 leading-relaxed mb-4">
                        <div>新北市林口區</div>
                        <div>南勢里9鄰33-6號2樓</div>
                      </div>
                      <Button 
                        asChild
                        size="sm"
                        className="bg-signal-gold hover:bg-signal-gold/90 text-white px-3 py-2 h-auto"
                      >
                        <a 
                          href={googleMapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{t('studio.address.mapButton')}</span>
                        </a>
                      </Button>
                    </div>

                    <div className="border-t border-signal-gold/20 pt-6">
                      <h4 className="text-lg font-semibold text-signal-charcoal mb-3">
                        {t('studio.features.title')}
                      </h4>
                      <ul className="space-y-2 text-signal-charcoal/80">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-signal-gold rounded-full mt-2"></div>
                          <span>{t('studio.features.equipment')}</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-signal-gold rounded-full mt-2"></div>
                          <span>{t('studio.features.consultation')}</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-signal-gold rounded-full mt-2"></div>
                          <span>{t('studio.features.access')}</span>
                        </li>
                      </ul>
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