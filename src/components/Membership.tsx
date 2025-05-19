
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
          description: "Baseline and 12-week assessments guide your individualized training plan.",
        },
        {
          title: "1-on-2 Fitness Coaching (3x/Week)",
          description: "Personalized programming delivered in a focused, semi-private setting.",
        },
        {
          title: "Self-Guided Training Access",
          description: "Book facility time to complete additional workouts on your own schedule.",
        },
        {
          title: "Custom Training App",
          description: "Access your updated program anytime — at the facility, at home, or while traveling. Most members train 4–5x/week to cover all key areas.",
        }
      ]
    },
    mental: {
      title: "Mental Training",
      items: [
        {
          title: "Monthly 1-on-1 Coaching (60 min)",
          description: "In-person sessions tailored to your goals using sport psychology, mindfulness, and biofeedback.",
        },
        {
          title: "Ongoing Mental Training Plan",
          description: "Receive guided exercises to complete between sessions for consistent mental skill development.",
        },
        {
          title: "App + Biofeedback Tools",
          description: "Includes heart rate monitor and mobile app for regular practice and remote coach tracking.",
        }
      ]
    },
    golf: {
      title: "Golf Training",
      items: [
        {
          title: "GCQuad Simulator Access (5 hrs/month)",
          description: "Book simulator sessions to dial in numbers, shape shots, and track performance.",
        },
        {
          title: "On-Demand Putting Green",
          description: "Use the putting surface anytime for feel, alignment, and distance control work.",
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
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature Categories on the Left */}
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
          
          {/* Feature Details on the Right */}
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
      </div>
    </section>
  );
};

export default Membership;
