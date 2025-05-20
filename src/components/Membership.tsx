
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Membership = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("physical");
  const sectionRef = useRef<HTMLElement>(null);

  // Handle intersection observer for auto-selecting Physical tab when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActiveCategory("physical");
      }
    }, {
      threshold: 0.5
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const categories = {
    physical: {
      title: "Physical Training",
      items: [{
        title: "Quarterly Performance Assessments",
        description: <>Quarterly assessments provide objective data to guide your individualized training plan. </>
      }, {
        title: "1-on-2 Fitness Coaching (3x/Week)",
        description: "Train in a semi-private setting with a fully personalized program aligned with your goals."
      }, {
        title: "Train On Your Own",
        description: "Use the facility outside of coached sessions to complete your personalized program—just book your time and get to work."
      }, {
        title: "Mobile Training App",
        description: "Access your program anytime — in the facility, on the road, or at home — so you can train consistently anywhere."
      }]
    },
    mental: {
      title: "Mental Training",
      items: [{
        title: "1-on-1 Mental Coaching (1x/Month)",
        description: "Meet with a certified mental performance consultant for personalized sessions to enhance performance on and off the course."
      }, {
        title: "Structured Mental Training Plan",
        description: "Follow a personalized plan with targeted exercises to build mental skills between sessions."
      }, {
        title: "Home Practice Toolkit",
        description: "Receive a heart rate monitor and mobile app to practice skills learned in coaching sessions and track progress between sessions."
      }]
    },
    golf: {
      title: "Golf Training",
      items: [{
        title: "Simulator Access (5 hrs/month)",
        description: "Train with state-of-the-art technology — anytime that fits your schedule."
      }, {
        title: "Putting Green Access (2 hrs/month)",
        description: "Refine your mechanics and alignment with cutting-edge tools — on your own schedule."
      }, {
        title: "On-Course Performance Tracking",
        description: "All members receive access to golf stat tracking software, allowing us to monitor your competitive performance and adjust your training focus accordingly."
      }]
    },
    other: {
      title: "Facility Features",
      items: [{
        title: "Refresh & Recharge",
        description: "Includes modern shower, towel service, and kitchenette with complimentary and member-priced options."
      }, {
        title: "Private Club Atmosphere",
        description: "Capped at 20 members for a quiet, focused, and highly accessible training environment."
      }]
    }
  };

  return (
    <section id="membership" className="section-padding bg-signal-light-gray overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-1 font-lora">What's Included in Your Membership</h2>
          <p className="text-xl text-muted-foreground font-medium">NT$18,000/month</p>
          <p className="text-sm text-muted-foreground italic mt-1">All-inclusive membership.</p>
        </div>
        
        {/* Category Selector */}
        <div className="flex justify-center mb-8 gap-2 md:gap-4">
          {Object.entries(categories).map(([key, category]) => (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "outline"}
              onClick={() => setActiveCategory(key)}
              className={cn(
                "rounded-full px-4 py-2 transition-all duration-300",
                activeCategory === key ? "bg-signal-gold text-white shadow-md" : "hover:bg-signal-gold/10"
              )}
            >
              {category.title}
            </Button>
          ))}
        </div>

        {/* Desktop 3D Carousel */}
        <div className="hidden md:block relative px-12">
          <Carousel opts={{ loop: true, align: "center" }} className="w-full">
            <CarouselContent className="-ml-4">
              {categories[activeCategory as keyof typeof categories].items.map((item, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="membership-card-wrapper p-1">
                    <Card className="membership-card border-2 border-signal-gold/20 hover:border-signal-gold transition-all duration-300 backdrop-blur-sm bg-white/90 h-[300px] rounded-xl overflow-hidden shadow-lg transform perspective-1000 hover:rotate-y-5 hover:scale-105">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="card-header mb-4 pb-4 border-b border-signal-gold/20">
                          <h3 className="text-xl font-bold text-signal-charcoal font-lora">{item.title}</h3>
                        </div>
                        <div className="flex-grow">
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="mt-4 pt-2 flex justify-end">
                          <Button variant="ghost" size="sm" className="text-signal-gold hover:text-signal-gold/80 p-0">
                            Learn more <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 border-signal-gold text-signal-gold hover:bg-signal-gold hover:text-white" />
            <CarouselNext className="right-0 border-signal-gold text-signal-gold hover:bg-signal-gold hover:text-white" />
          </Carousel>
        </div>

        {/* Mobile Accordion View */}
        <div className="md:hidden space-y-4">
          {categories[activeCategory as keyof typeof categories].items.map((item, index) => (
            <Card key={index} className="border-l-4 border-signal-gold bg-white shadow-md overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h4 className="font-lora font-medium text-lg">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CSS for 3D effects */}
      <style jsx>{`
        .membership-card {
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
        }
        .membership-card:hover {
          transform: translateY(-10px) rotateX(5deg);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-5:hover {
          transform: rotateY(5deg);
        }
      `}</style>
    </section>
  );
};

export default Membership;
