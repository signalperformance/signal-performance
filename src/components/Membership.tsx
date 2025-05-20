
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
      color: "bg-signal-gold",
      items: [{
        title: "Quarterly Performance Assessments",
        description: "Quarterly assessments provide objective data to guide your individualized training plan."
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
      color: "bg-sky-500",
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
      color: "bg-green-500",
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
      color: "bg-gray-400",
      items: [{
        title: "Refresh & Recharge",
        description: "Includes modern shower, towel service, and kitchenette with complimentary and member-priced options."
      }, {
        title: "Private Club Atmosphere",
        description: "Capped at 20 members for a quiet, focused, and highly accessible training environment."
      }]
    }
  };

  // Generate the current category content
  const currentCategory = categories[activeCategory as keyof typeof categories];

  return (
    <section id="membership" className="section-padding bg-signal-light-gray overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-1 font-lora">What's Included in Your Membership</h2>
          <p className="text-xl text-muted-foreground font-medium">NT$18,000/month</p>
          <p className="text-sm text-muted-foreground italic mt-1">All-inclusive membership.</p>
        </div>
        
        {/* Category Selector */}
        <div className="flex justify-center mb-12 gap-2 md:gap-4">
          {Object.entries(categories).map(([key, category]) => (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "outline"}
              onClick={() => setActiveCategory(key)}
              className={cn(
                "rounded-full px-4 py-2 transition-all duration-300",
                activeCategory === key ? category.color + " text-white shadow-md" : "hover:bg-signal-gold/10"
              )}
            >
              {category.title}
            </Button>
          ))}
        </div>

        {/* Desktop Timeline Flow */}
        <div className="hidden md:block relative">
          {/* Timeline Line */}
          <div className={`absolute left-0 right-0 h-1 top-1/2 transform -translate-y-1/2 ${currentCategory.color} opacity-30`}></div>
          
          {/* Timeline Items */}
          <div className="relative z-10 grid grid-cols-4 gap-4">
            {currentCategory.items.map((item, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 0 ? 'timeline-top' : 'timeline-bottom'}`}>
                {/* Connection Line */}
                <div className={`connection-line ${index % 2 === 0 ? 'connection-top' : 'connection-bottom'} ${currentCategory.color}`}></div>
                
                {/* Node Point */}
                <div className={`node-point ${currentCategory.color}`}></div>
                
                {/* Content Card */}
                <Card className={`timeline-card transition-all duration-500 hover:shadow-lg ${index % 2 === 0 ? 'mb-16' : 'mt-16'}`}>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2 font-lora">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Accordion View */}
        <div className="md:hidden space-y-4">
          {currentCategory.items.map((item, index) => (
            <div key={index} className="relative">
              {/* Vertical timeline line */}
              {index < currentCategory.items.length - 1 && (
                <div className={`absolute top-[2.5rem] bottom-0 left-[0.65rem] w-0.5 ${currentCategory.color} opacity-30`}></div>
              )}
              
              <div className="flex items-start gap-4">
                {/* Timeline node */}
                <div className={`relative top-2 h-5 w-5 rounded-full ${currentCategory.color} shadow-lg flex-shrink-0`}></div>
                
                {/* Content */}
                <Card className="flex-1 border-l-4 border-l-signal-gold shadow-md mb-4">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          /* Timeline Styling */
          .timeline-item {
            position: relative;
            padding: 20px 0;
          }
          
          .timeline-top .timeline-card {
            margin-bottom: 40px;
          }
          
          .timeline-bottom .timeline-card {
            margin-top: 40px;
          }
          
          .connection-line {
            position: absolute;
            width: 2px;
            left: 50%;
            transform: translateX(-50%);
          }
          
          .connection-top {
            bottom: 30px;
            height: 40px;
          }
          
          .connection-bottom {
            top: 30px;
            height: 40px;
          }
          
          .node-point {
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 20;
          }
          
          /* Animation */
          .timeline-card {
            transition: all 0.4s ease;
          }
          
          .timeline-card:hover {
            transform: translateY(-5px);
          }
        `}
      </style>
    </section>
  );
};

export default Membership;
