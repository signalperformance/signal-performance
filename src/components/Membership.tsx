
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LayoutGrid, Activity, Dumbbell, Users, PieChart } from "lucide-react";

const Membership = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("physical");
  const sectionRef = useRef<HTMLElement>(null);
  const pieRef = useRef<HTMLDivElement>(null);
  
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
      icon: <Dumbbell className="w-6 h-6" />,
      color: "bg-blue-500",
      textColor: "text-blue-500",
      borderColor: "border-blue-500",
      angle: 0,
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
      icon: <Activity className="w-6 h-6" />,
      color: "bg-purple-500",
      textColor: "text-purple-500",
      borderColor: "border-purple-500",
      angle: 72,
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
      icon: <PieChart className="w-6 h-6" />,
      color: "bg-green-500",
      textColor: "text-green-500", 
      borderColor: "border-green-500",
      angle: 144,
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
      icon: <Users className="w-6 h-6" />,
      color: "bg-signal-gold",
      textColor: "text-signal-gold",
      borderColor: "border-signal-gold",
      angle: 216,
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
    },
    pricing: {
      title: "Pricing",
      icon: <LayoutGrid className="w-6 h-6" />,
      color: "bg-red-500",
      textColor: "text-red-500",
      borderColor: "border-red-500",
      angle: 288,
      items: [
        {
          title: "All-Inclusive Membership",
          description: "NT$18,000/month inclusive of all physical, mental, and golf training features.",
        },
        {
          title: "Limited Availability",
          description: "Only 20 memberships available to maintain a private club atmosphere and ensure personalized attention.",
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
        
        {/* Desktop View - Radial Pie Menu */}
        <div className="hidden md:block">
          <div className="relative max-w-4xl mx-auto h-[600px]" ref={pieRef}>
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white shadow-lg flex flex-col items-center justify-center z-10 p-4 border-4 border-signal-gold">
              <p className="text-lg font-lora font-bold text-center">Signal Performance</p>
              <p className="text-sm text-muted-foreground text-center">Elite Golf Training</p>
            </div>
            
            {/* Menu Items */}
            {Object.entries(categories).map(([key, category]) => {
              // Calculate position on the circle
              const radius = 220; // Distance from center
              const rad = (category.angle * Math.PI) / 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              
              return (
                <div 
                  key={key}
                  className={cn(
                    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-20",
                    activeCategory === key ? `scale-110 shadow-lg ${category.color}` : "bg-white shadow hover:scale-105"
                  )}
                  style={{ 
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                  onClick={() => setActiveCategory(key)}
                >
                  <div className={cn(
                    "flex items-center justify-center flex-col",
                    activeCategory === key ? "text-white" : category.textColor
                  )}>
                    {category.icon}
                    <p className={cn(
                      "text-xs font-medium text-center mt-1",
                      activeCategory === key ? "text-white" : "text-signal-charcoal"
                    )}>
                      {category.title}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {/* Lines connecting categories to center */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              {Object.entries(categories).map(([key, category]) => {
                const radius = 220;
                const rad = (category.angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius + 300; // Adjust based on container size
                const y = Math.sin(rad) * radius + 300; // Adjust based on container size
                
                // Get color based on active category
                const stroke = key === activeCategory 
                  ? category.color.replace('bg-', '') // Convert Tailwind class to color name
                  : 'gray-300';
                  
                // Convert color names to actual colors
                const getStrokeColor = () => {
                  switch(stroke) {
                    case 'blue-500': return '#3b82f6';
                    case 'purple-500': return '#a855f7';
                    case 'green-500': return '#22c55e';
                    case 'signal-gold': return '#c9aa71';
                    case 'red-500': return '#ef4444';
                    default: return '#d1d5db'; // gray-300
                  }
                };
                
                return (
                  <line 
                    key={key}
                    x1="300" 
                    y1="300" 
                    x2={x} 
                    y2={y} 
                    stroke={getStrokeColor()}
                    strokeWidth={key === activeCategory ? "3" : "1"} 
                    strokeDasharray={key === activeCategory ? "none" : "5,5"}
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Selected Category Details */}
          <div className="mt-10 max-w-3xl mx-auto">
            <Card className={cn(
              "border-2 transition-colors duration-300 overflow-hidden",
              categories[activeCategory as keyof typeof categories].borderColor
            )}>
              <div className={cn(
                "py-4 px-6",
                categories[activeCategory as keyof typeof categories].color,
                "text-white"
              )}>
                <h3 className="text-2xl font-lora font-medium">
                  {categories[activeCategory as keyof typeof categories].title}
                </h3>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {categories[activeCategory as keyof typeof categories].items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className={cn(
                        "font-medium mr-2",
                        categories[activeCategory as keyof typeof categories].textColor
                      )}>•</span>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
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
