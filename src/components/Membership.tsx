
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Hexagon } from "lucide-react";

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
      icon: <Hexagon className="w-6 h-6" />,
      color: "bg-blue-500",
      textColor: "text-blue-500",
      borderColor: "border-blue-500",
      items: [
        {
          title: "Quarterly Performance Assessments",
          description: <>Quarterly assessments provide objective data to guide your individualized training plan. <a href="#assessment" className="text-signal-gold hover:underline">Learn more about the assessment process here.</a></>,
        },
        {
          title: "1-on-2 Fitness Coaching (3x/Week)",
          description: "Train in a semi-private setting with a fully personalized program aligned with your goals.",
        },
        {
          title: "Train On Your Own",
          description: "Use the facility outside of coached sessions to complete your personalized program—just book your time and get to work.",
        },
        {
          title: "Mobile Training App",
          description: "Access your program anytime — in the facility, on the road, or at home — so you can train consistently anywhere.",
        }
      ]
    },
    mental: {
      title: "Mental Training",
      icon: <Hexagon className="w-6 h-6" />,
      color: "bg-purple-500",
      textColor: "text-purple-500",
      borderColor: "border-purple-500",
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
      icon: <Hexagon className="w-6 h-6" />,
      color: "bg-green-500",
      textColor: "text-green-500", 
      borderColor: "border-green-500",
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
      title: "Facility Features",
      icon: <Hexagon className="w-6 h-6" />,
      color: "bg-signal-gold",
      textColor: "text-signal-gold",
      borderColor: "border-signal-gold",
      items: [
        {
          title: "Refresh & Recharge",
          description: "Includes modern shower, towel service, and kitchenette with complimentary and member-priced options.",
        },
        {
          title: "Private Club Atmosphere",
          description: "Capped at 20 members for a quiet, focused, and highly accessible training environment.",
        }
      ]
    }
  };

  // Function to get hexagon position classes
  const getHexPosition = (index: number, total: number) => {
    if (total <= 4) {
      // For 4 or fewer hexagons, we arrange them in a single row
      return "transform transition-all duration-300";
    }
    
    // For more hexagons, we'd implement a more complex layout
    return "transform transition-all duration-300";
  };

  return (
    <section id="membership" className="section-padding bg-signal-light-gray" ref={sectionRef}>
      <div className="container mx-auto container-padding">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-1 font-lora">What's Included in Your Membership</h2>
          <p className="text-xl text-muted-foreground font-medium">NT$18,000/month</p>
          <p className="text-sm text-muted-foreground italic mt-1">All-inclusive membership.</p>
        </div>
        
        {/* Hexagonal Grid for Desktop */}
        <div className="hidden md:block">
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
              {Object.entries(categories).map(([key, category], index) => (
                <div 
                  key={key}
                  className={cn(
                    "cursor-pointer transform transition-all duration-300 hover:scale-105",
                    getHexPosition(index, Object.keys(categories).length)
                  )}
                  onClick={() => setActiveCategory(key)}
                >
                  <div className={cn(
                    "hex-container relative flex items-center justify-center h-32 w-36",
                    activeCategory === key ? "scale-110" : ""
                  )}>
                    {/* Hexagon Shape Background with clip-path */}
                    <div className={cn(
                      "absolute inset-0 clip-path-hex",
                      activeCategory === key ? category.color : "bg-white",
                      "transition-colors duration-300"
                    )}></div>
                    
                    {/* Hexagon Border */}
                    <div className={cn(
                      "absolute inset-0 clip-path-hex",
                      activeCategory === key ? "border-2 border-white" : `border-2 ${category.borderColor}`,
                      "bg-transparent transition-colors duration-300"
                    )}></div>
                    
                    {/* Content */}
                    <div className="z-10 text-center p-2">
                      <div className={cn(
                        "flex justify-center mb-1",
                        activeCategory === key ? "text-white" : category.textColor
                      )}>
                        {category.icon}
                      </div>
                      <h3 className={cn(
                        "font-medium text-sm font-lora transition-colors duration-300",
                        activeCategory === key ? "text-white" : "text-signal-charcoal"
                      )}>
                        {category.title}
                      </h3>
                      <p className={cn(
                        "text-xs mt-1 transition-colors duration-300",
                        activeCategory === key ? "text-white/80" : "text-muted-foreground"
                      )}>
                        Click to view
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Details Card for Selected Category - Desktop */}
          <div className="max-w-4xl mx-auto">
            <Card className={cn(
              "bg-white shadow-md border-t-4 transition-colors duration-300",
              categories[activeCategory as keyof typeof categories].borderColor
            )}>
              <CardContent className="p-6 md:p-8">
                <h3 className={cn(
                  "text-xl md:text-2xl font-lora mb-6",
                  categories[activeCategory as keyof typeof categories].textColor
                )}>
                  {categories[activeCategory as keyof typeof categories].title}
                </h3>
                
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
                  "p-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-3",
                  activeCategory === key 
                    ? category.color + " text-white" 
                    : "bg-white/50 hover:bg-white"
                )}
                onClick={() => setActiveCategory(key)}
              >
                <div className={cn(
                  activeCategory === key 
                    ? "text-white" 
                    : category.textColor
                )}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-medium text-lg font-lora">{category.title}</h3>
                  <p className={cn(
                    "text-xs mt-1",
                    activeCategory === key ? "text-white/80" : "text-muted-foreground"
                  )}>
                    Click to view details
                  </p>
                </div>
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
      
      {/* Add the hexagon clip path as a style */}
      <style jsx>{`
        .clip-path-hex {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </section>
  );
};

export default Membership;
