
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Move, Activity, User, Dumbbell, GolfClub } from "lucide-react";

const AssessmentProcess = () => {
  const [activeAssessment, setActiveAssessment] = useState("mobility");

  const assessments = {
    mobility: {
      title: "Mobility and Joint Function",
      icon: Move,
      description: "A comprehensive evaluation of your range of motion, joint stability, and functional movement patterns. Our assessment identifies mobility restrictions that may limit your golf performance or increase injury risk. We examine key areas including hip rotation, thoracic spine mobility, shoulder function, and ankle stability.",
    },
    strength: {
      title: "Maximal Strength",
      icon: Dumbbell,
      description: "Measurement of your foundational strength capabilities in key movement patterns relevant to golf. Tests include lower body power, core strength and stability, rotational force production, and grip strength. Results establish baseline power metrics and identify any strength imbalances that could affect your swing mechanics.",
    },
    metabolic: {
      title: "Metabolic Testing",
      icon: Activity,
      description: "Scientific assessment of your cardiovascular fitness and energy systems. We evaluate aerobic capacity, heart rate zones, and recovery rates to develop personalized conditioning protocols. This data helps optimize your on-course endurance and between-round recovery strategies.",
    },
    body: {
      title: "Body Composition",
      icon: User,
      description: "Analysis of your body composition including muscle mass, fat percentage, and distribution. Beyond simple weight measurements, we evaluate how your body composition affects your golf mechanics and athletic potential. This provides a foundation for nutrition planning and physical development goals.",
    },
    golf: {
      title: "Golf Skill",
      icon: GolfClub,
      description: "Detailed evaluation of your current golf performance metrics including ball speed, clubhead speed, smash factor, launch conditions, and shot dispersion patterns. We collect baseline data on your full swing, short game, and putting performance to establish clear benchmarks for improvement.",
    }
  };

  return (
    <section id="assessment" className="section-padding bg-gradient-to-b from-white to-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora">Our Assessment Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each member begins with a comprehensive assessment across five key performance areas. 
            These assessments guide your individualized training plan and provide benchmarks to track your progress.
          </p>
        </div>

        {/* Desktop View: Circular Layout */}
        <div className="hidden md:block relative">
          <div className="flex justify-center items-center mb-8">
            {/* Circle with icons around it */}
            <div className="relative w-[500px] h-[500px]">
              {/* Center circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-white shadow-lg flex items-center justify-center p-6 border-2 border-signal-gold">
                  <Card className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                    <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                      <h3 className="font-lora text-lg font-medium">
                        {assessments[activeAssessment as keyof typeof assessments].title}
                      </h3>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Positioned icons */}
              {Object.entries(assessments).map(([key, assessment], index) => {
                // Calculate position on the circle
                const angle = (index * (2 * Math.PI / Object.keys(assessments).length)) - Math.PI/2;
                const x = Math.cos(angle) * 200 + 250; 
                const y = Math.sin(angle) * 200 + 250;
                
                return (
                  <div 
                    key={key}
                    className={cn(
                      "absolute w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300",
                      activeAssessment === key 
                        ? "scale-110 border-2 border-signal-gold" 
                        : "hover:scale-105"
                    )}
                    style={{ 
                      left: `${x}px`, 
                      top: `${y}px`,
                    }}
                    onClick={() => setActiveAssessment(key)}
                  >
                    <assessment.icon size={32} className={activeAssessment === key ? "text-signal-gold" : "text-signal-charcoal"} />
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Description box below */}
          <div className="mt-8">
            <Card className="bg-white shadow-md mx-auto max-w-3xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {React.createElement(assessments[activeAssessment as keyof typeof assessments].icon, { 
                    size: 28, 
                    className: "text-signal-gold" 
                  })}
                  <h3 className="text-2xl font-lora font-medium">
                    {assessments[activeAssessment as keyof typeof assessments].title}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {assessments[activeAssessment as keyof typeof assessments].description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Mobile View: Tabs Layout */}
        <div className="md:hidden">
          <Tabs 
            value={activeAssessment} 
            onValueChange={setActiveAssessment}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-8">
              {Object.entries(assessments).map(([key, assessment]) => (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="flex flex-col items-center py-3 px-1 data-[state=active]:border-b-2 data-[state=active]:border-signal-gold"
                >
                  <assessment.icon size={20} className="mb-1" />
                  <span className="text-xs text-center line-clamp-2">{assessment.title.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(assessments).map(([key, assessment]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <assessment.icon size={24} className="text-signal-gold" />
                      <h3 className="text-xl font-lora font-medium">{assessment.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {assessment.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default AssessmentProcess;
