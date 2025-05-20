
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Membership = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("physical");
  const sectionRef = useRef<HTMLElement>(null);
  
  // Handle intersection observer for auto-selecting Physical tab when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveCategory("physical");
        }
      },
      { threshold: 0.5 }
    );
    
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
      items: [
        {
          title: "Quarterly Performance Assessments",
          description: "Quarterly assessments provide objective data to guide your individualized training plan. Learn more about the assessment process here.",
        },
        {
          title: "1-on-2 Fitness Coaching (3x/Week)",
          description: "Train in a semi-private setting with a fully personalized program aligned with your goals.",
        },
        {
          title: "Train On Your Own",
          description: "Use the facility outside of coached sessions to complete your personalized program—just book your time and get to work",
        },
        {
          title: "Mobile Training App",
          description: "Access your program anytime — in the facility, on the road, or at home — so you can train consistently anywhere.",
        }
      ]
    },
    mental: {
      title: "Mental Training",
      items: [
        {
          title: "1-on-1 Mental Coaching (1x/Month)",
          description: "Meet with a certified mental performance consultant for personalized sessions to enhance performance on and off the course.",
        },
        {
          title: "Structured Mental Training Plan",
          description: "Follow a personalized plan with targeted exercises to build mental skills between sessions.",
        },
        {
          title: "Home Practice Toolkit",
          description: "Receive a heart rate monitor and mobile app to practice skills learned in coaching sessions and track progress between sessions.",
        }
      ]
    },
    golf: {
      title: "Golf Training",
      items: [
        {
          title: "Simulator Access (5 hrs/month)",
          description: "Train with state-of-the-art technology — anytime that fits your schedule.",
        },
        {
          title: "Putting Green Access (2 hrs/month)",
          description: "Refine your mechanics and alignment with cutting-edge tools — on your own schedule.",
        },
        {
          title: "On-Course Performance Tracking",
          description: "All members receive access to golf stat tracking software, allowing us to monitor your competitive performance and adjust your training focus accordingly.",
        }
      ]
    },
    other: {
      title: "Other Benefits",
      items: [
        {
          title: "High-Comfort Amenities",
          description: "Includes modern shower, towel service, and kitchenette with complimentary and member-priced options.",
        },
        {
          title: "Private Club Atmosphere",
          description: "Capped at 20 members for a quiet, focused, and highly accessible training environment.",
        }
      ]
    }
  };

  return (
    <section id="membership" className="section-padding bg-signal-light-gray" ref={sectionRef}>
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora">What's Included in Your Membership</h2>
        </div>
        
        {/* Grid layout with different structure for mobile vs desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {/* Feature Categories on the Left - Desktop Only */}
          <div className="md:col-span-1">
            <div className="space-y-3">
              {Object.entries(categories).map(([key, category]) => (
                <div
                  key={key}
                  className={cn(
                    "p-4 md:p-6 rounded-lg cursor-pointer transition-all duration-200 flex items-center",
                    activeCategory === key 
                      ? "bg-white shadow-md border-l-4 border-signal-gold" 
                      : "bg-white/50 hover:bg-white"
                  )}
                  onClick={() => setActiveCategory(key)}
                >
                  <div>
                    <h3 className="font-medium text-base md:text-lg font-lora">{category.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Click to view details
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Feature Details on the Right - Desktop Only */}
          <div className="md:col-span-2">
            <Card className="bg-white shadow-md h-full">
              <CardContent className="p-4 md:p-8">
                <h3 className="text-xl md:text-2xl font-lora mb-6">{categories[activeCategory as keyof typeof categories].title}</h3>
                
                <div className="space-y-6">
                  {categories[activeCategory as keyof typeof categories].items.map((item, index) => (
                    <div key={index} className="space-y-1 md:space-y-2">
                      <div className="flex items-start gap-3">
                        <h4 className="font-lora font-medium text-lg md:text-xl">{item.title}</h4>
                      </div>
                      <p className="text-muted-foreground text-sm md:text-base">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile View - Accordion-like layout */}
        <div className="md:hidden space-y-4">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className="rounded-lg overflow-hidden">
              <div
                className={cn(
                  "p-4 rounded-lg cursor-pointer transition-all duration-200",
                  activeCategory === key 
                    ? "bg-white shadow-md border-l-4 border-signal-gold" 
                    : "bg-white/50 hover:bg-white"
                )}
                onClick={() => setActiveCategory(key)}
              >
                <h3 className="font-medium text-lg font-lora">{category.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to view details
                </p>
              </div>
              
              {/* Show content immediately below the clicked category */}
              {activeCategory === key && (
                <Card className="bg-white shadow-md mt-2 mb-4">
                  <CardContent className="p-4">
                    <div className="space-y-6">
                      {category.items.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-start gap-3">
                            <h4 className="font-lora font-medium text-lg">{item.title}</h4>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Membership;
