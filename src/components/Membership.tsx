
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
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
          title: "Comprehensive Performance Assessments",
          description: "When you join, and then every 12 weeks, you'll complete a full physical assessment to track progress and guide your individualized program. [Click here to learn more about our assessment process.]",
        },
        {
          title: "1-on-2 Fitness Coaching — 3x/Week",
          description: "Train three times per week in a focused 1-on-2 setting. While you'll share the space with another athlete, your training plan is entirely your own — designed around your assessments, goals, and current point in the golf season to directly support your performance on the course.",
        },
        {
          title: "Train on Your Own Schedule",
          description: "In addition to coached sessions, you can book time to train independently using the same equipment. Your custom program is always available in our training app, and updated regularly by your coach to match your needs.",
        },
        {
          title: "Custom Training App Access",
          description: "Your personalized program lives in an easy-to-use training app, allowing you to train anytime — whether you're at our facility, traveling, or at home. Because not every aspect of your program can be covered in the three coached sessions each week, we provide additional workouts tailored to your needs and schedule. Most members train 4–5 days per week to ensure they're progressing across all key areas of physical development.",
        }
      ]
    },
    mental: {
      title: "Mental Training",
      items: [
        {
          title: "1-on-1 Mental Performance Coaching — 1x/Month",
          description: "Meet in person each month for a 60-minute session focused on enhancing your on-course performance and supporting long-term brain health. The first few sessions are used to establish a baseline and teach foundational concepts. After that, your training becomes fully individualized — incorporating tools like mindfulness and biofeedback training. You'll receive guided mental training exercises to complete regularly at home or in the facility between sessions, allowing you to build consistency and reinforce what you've learned.",
        },
        {
          title: "Mental Training App + Biofeedback Tools",
          description: "All members receive a heart rate monitor and access to a mobile training app, allowing for regular practice both at the facility and on your own. Your coach can monitor your progress remotely, help keep you accountable, and make timely adjustments — supporting consistent practice and measurable growth over time.",
        }
      ]
    },
    golf: {
      title: "Golf Training",
      items: [
        {
          title: "GCQuad Simulator Access",
          description: "Each member receives 5 hours of simulator time per month using our industry-leading GCQuad launch monitor. Book sessions online and use the space to dial in your numbers, train shot shapes, or test equipment with precision.",
        },
        {
          title: "On-Demand Putting Practice",
          description: "Refine your feel and green reading anytime on our in-house putting surface — available for self-guided use throughout the day.",
        }
      ]
    },
    other: {
      title: "Other Benefits",
      items: [
        {
          title: "High-Comfort Amenities",
          description: "Enjoy access to a clean, modern shower space and a kitchenette stocked with a mix of complimentary and member-priced food and beverage options.",
        },
        {
          title: "Private Club Environment",
          description: "With a maximum of 20 members, the space remains quiet, focused, and available — giving you the freedom to train on your schedule without crowding or distractions.",
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
                    "p-6 rounded-lg cursor-pointer transition-all duration-200",
                    activeCategory === key 
                      ? "bg-white shadow-md border-l-4 border-signal-gold" 
                      : "bg-white/50 hover:bg-white"
                  )}
                  onClick={() => setActiveCategory(key)}
                >
                  <h3 className="font-medium text-lg font-lora">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click to view details
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Feature Details on the Right */}
          <div className="md:col-span-2">
            <Card className="bg-white shadow-md h-full">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-2xl font-lora mb-6">{categories[activeCategory as keyof typeof categories].title}</h3>
                
                <div className="space-y-8">
                  {categories[activeCategory as keyof typeof categories].items.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-signal-gold/10 rounded-full p-1.5">
                          <Check className="text-signal-gold h-5 w-5" />
                        </div>
                        <h4 className="font-lora font-medium text-xl">{item.title}</h4>
                      </div>
                      <p className="text-muted-foreground ml-10">
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
