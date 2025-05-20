
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";

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
      icon: <LayoutGrid className="w-6 h-6" />,
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
      icon: <LayoutGrid className="w-6 h-6" />,
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
      icon: <LayoutGrid className="w-6 h-6" />,
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
      icon: <LayoutGrid className="w-6 h-6" />,
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

  return (
    <section id="membership" className="section-padding bg-signal-light-gray" ref={sectionRef}>
      <div className="container mx-auto container-padding">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-1 font-lora">What's Included in Your Membership</h2>
          <p className="text-xl text-muted-foreground font-medium">NT$18,000/month</p>
          <p className="text-sm text-muted-foreground italic mt-1">All-inclusive membership.</p>
        </div>
        
        {/* Quadrant-based Grid Layout - Desktop */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto mb-0">
            {Object.entries(categories).map(([key, category], index) => (
              <div 
                key={key}
                className={cn(
                  "cursor-pointer relative overflow-hidden transition-all duration-300 rounded-xl",
                  activeCategory === key 
                    ? "shadow-lg scale-105 z-10" 
                    : "shadow hover:shadow-md hover:scale-102",
                )}
                onClick={() => setActiveCategory(key)}
              >
                <div className={cn(
                  "absolute inset-0 opacity-100 transition-opacity duration-300",
                  activeCategory === key ? "opacity-100" : "opacity-0",
                  category.color
                )}></div>
                
                <Card className={cn(
                  "border-2 h-full bg-white bg-opacity-95 transition-all duration-300 overflow-hidden",
                  activeCategory === key 
                    ? `${category.borderColor} border-opacity-100` 
                    : "border-gray-200 hover:border-opacity-75",
                  activeCategory === key && "bg-opacity-10"
                )}>
                  <CardContent className="p-5 relative z-10 h-full">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={cn(
                        "rounded-lg p-2 transition-colors",
                        activeCategory === key 
                          ? "bg-white text-signal-charcoal" 
                          : `${category.color} bg-opacity-10 ${category.textColor}`
                      )}>
                        {category.icon}
                      </div>
                      <h3 className={cn(
                        "font-lora font-medium text-xl transition-colors",
                        activeCategory === key ? "text-white" : "text-signal-charcoal"
                      )}>
                        {category.title}
                      </h3>
                    </div>
                    
                    {activeCategory === key ? (
                      <ul className="mt-4 space-y-3">
                        {category.items.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-white font-medium me-2">•</span>
                            <div>
                              <h4 className="text-white font-medium">{item.title}</h4>
                              <p className="text-white text-opacity-80 text-sm">
                                {item.description}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={cn(
                        "text-sm mt-2 transition-colors line-clamp-2",
                        activeCategory === key ? "text-white" : "text-muted-foreground"
                      )}>
                        Click to see {category.items.length} features included in {category.title.toLowerCase()}.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile View - Accordion Cards */}
        <div className="md:hidden space-y-4">
          {Object.entries(categories).map(([key, category]) => (
            <div 
              key={key} 
              className={cn(
                "relative overflow-hidden rounded-lg transition-all duration-300",
                activeCategory === key 
                  ? `shadow-md ${category.color}` 
                  : "bg-white shadow"
              )}
              onClick={() => setActiveCategory(key)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    activeCategory === key 
                      ? "bg-white text-signal-charcoal" 
                      : `${category.color} bg-opacity-10 ${category.textColor}`
                  )}>
                    {category.icon}
                  </div>
                  <h3 className={cn(
                    "font-lora font-medium",
                    activeCategory === key ? "text-white" : "text-signal-charcoal"
                  )}>
                    {category.title}
                  </h3>
                </div>
              </div>
              
              {activeCategory === key && (
                <div className="p-4 pt-0">
                  <ul className="space-y-3">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-white font-medium me-2">•</span>
                        <div>
                          <h4 className="text-white font-medium">{item.title}</h4>
                          <p className="text-white text-opacity-80 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Membership;
