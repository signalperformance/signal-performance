import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const StudioLocation = () => {
  const { t } = useLanguage();

  const studioImages = [
    "/lovable-uploads/fee6baaf-924e-4e08-a28d-08570d16ceab.png",
    "/lovable-uploads/3f9f34d1-5282-432d-8d22-864d89331044.png",
    "/lovable-uploads/977dab8a-9542-465d-b44e-50204d8aeee4.png",
    "/lovable-uploads/503a4780-a5cc-43ab-bbcd-93ea3c3bd9e4.png",
    "/lovable-uploads/5684e079-9755-46d7-874d-979d3dd34fd1.png",
    "/lovable-uploads/ebb823c7-6279-445a-aa7e-3b361e6d2d30.png"
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
              Our Studio in Linkou
            </h2>
            <p className="text-lg text-signal-charcoal/80 max-w-3xl mx-auto">
              Experience our state-of-the-art fitness facility featuring premium equipment, 
              dedicated training areas, and professional consultation spaces designed for optimal performance.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Images Carousel/Grid */}
            <div className="order-2 lg:order-1">
              {/* Desktop: 2x2 Grid */}
              <div className="hidden md:grid grid-cols-2 gap-4">
                {studioImages.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <img 
                      src={image} 
                      alt={`Studio view ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* Mobile: Carousel */}
              <div className="md:hidden">
                <Carousel className="w-full">
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
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>

            {/* Location Information */}
            <div className="order-1 lg:order-2">
              <Card className="border-signal-gold/20 shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-6 h-6 text-signal-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold text-signal-charcoal mb-2">
                          Studio Address
                        </h3>
                        <p className="text-signal-charcoal/80 leading-relaxed">
                          {address}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button 
                        asChild
                        className="w-full bg-signal-gold hover:bg-signal-gold/90 text-white font-medium"
                      >
                        <a 
                          href={googleMapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center space-x-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View on Google Maps</span>
                        </a>
                      </Button>
                    </div>

                    <div className="border-t border-signal-gold/20 pt-6">
                      <h4 className="text-lg font-semibold text-signal-charcoal mb-3">
                        What You'll Find
                      </h4>
                      <ul className="space-y-2 text-signal-charcoal/80">
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-signal-gold rounded-full"></div>
                          <span>Premium fitness equipment</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-signal-gold rounded-full"></div>
                          <span>Private consultation rooms</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-signal-gold rounded-full"></div>
                          <span>Specialized training areas</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-signal-gold rounded-full"></div>
                          <span>Modern, spacious environment</span>
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