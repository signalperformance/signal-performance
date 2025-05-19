import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Move, Activity, User, Dumbbell, Club } from "lucide-react";

const AssessmentProcess = () => {
  const [activeAssessment, setActiveAssessment] = useState("mobility");
  
  const assessments = {
    mobility: {
      title: "Joint Function",
      icon: Move,
      description: "We assess the passive and active range of motion of every major joint to identify limitations and their root causes. These insights guide your mobility training and help reduce injury risk, support longevity, and improve movement efficiency.",
      number: 1
    },
    strength: {
      title: "Maximal Strength",
      icon: Dumbbell,
      description: "We test maximal strength using the bench press and deadlift to evaluate how effectively your nervous system recruits muscle fibers. These metrics help us understand your potential to generate force and increase swing speed.",
      number: 2
    },
    metabolic: {
      title: "Endurance",
      icon: Activity,
      description: "A lactate threshold test helps us determine your personalized heart rate zones. This allows us to tailor your conditioning work to improve endurance, accelerate recovery, and avoid overtraining.",
      number: 3
    },
    body: {
      title: "Body Composition",
      icon: User,
      description: "We track muscle mass and body fat percentage to guide body composition goals. Whether building strength or reducing weight, this ensures your progress supports — not hinders — your performance.",
      number: 4
    },
    golf: {
      title: "Golf Skill + Speed",
      icon: Club,
      description: "We measure average and max club speed, ball speed, and your ability to control distance and dispersion with wedges and irons. This helps us identify whether performance challenges are technical, physical, or mental.",
      number: 5
    }
  };
  
  return <section id="assessment" className="section-padding bg-gradient-to-b from-white to-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora">Our Assessment Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Upon joining and every 12 weeks, members complete a comprehensive evaluation across six key areas to establish a precise snapshot of their current physical and performance profile.</p>
        </div>

        {/* Desktop View: Side-by-side Layout */}
        <div className="hidden md:flex md:flex-row md:gap-8 md:items-start">
          {/* Left side: Circular Layout */}
          <div className="w-1/2">
            <div className="relative w-[500px] h-[500px] mx-auto">
              {/* Connecting pentagon line for icons */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500" fill="none">
                <path d="M250,50 L430,200 L350,400 L150,400 L70,200 Z" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
              </svg>
              
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

              {/* Positioned numbered icons */}
              {Object.entries(assessments).map(([key, assessment], index) => {
              // Calculate position on the pentagon
              let angle, x, y;

              // Positions for each numbered node on the pentagon
              switch (index) {
                case 0:
                  // Top (1)
                  x = 250;
                  y = 50;
                  break;
                case 1:
                  // Top right (2)
                  x = 430;
                  y = 200;
                  break;
                case 2:
                  // Bottom right (3)
                  x = 350;
                  y = 400;
                  break;
                case 3:
                  // Bottom left (4)
                  x = 150;
                  y = 400;
                  break;
                case 4:
                  // Top left (5)
                  x = 70;
                  y = 200;
                  break;
                default:
                  x = 250;
                  y = 250;
              }
              return <div key={key} className={cn("absolute w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300", activeAssessment === key ? "scale-110 border-2 border-signal-gold" : "hover:scale-105")} style={{
                left: `${x}px`,
                top: `${y}px`
              }} onClick={() => setActiveAssessment(key)}>
                    <span className={cn("text-2xl font-bold", activeAssessment === key ? "text-signal-gold" : "text-signal-charcoal")}>
                      {assessment.number}
                    </span>
                  </div>;
            })}
            </div>
          </div>
          
          {/* Right side: Description box */}
          <div className="w-1/2">
            <Card className="bg-white shadow-md mt-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-signal-gold flex items-center justify-center text-white font-bold">
                    {assessments[activeAssessment as keyof typeof assessments].number}
                  </div>
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
          <Tabs value={activeAssessment} onValueChange={setActiveAssessment} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              {Object.entries(assessments).map(([key, assessment]) => <TabsTrigger key={key} value={key} className="flex flex-col items-center py-3 px-1 data-[state=active]:border-b-2 data-[state=active]:border-signal-gold">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                    <span className={cn("font-bold", activeAssessment === key ? "text-signal-gold" : "text-signal-charcoal")}>
                      {assessment.number}
                    </span>
                  </div>
                  <span className="text-xs text-center line-clamp-2">{assessment.title.split(' ')[0]}</span>
                </TabsTrigger>)}
            </TabsList>
            
            {Object.entries(assessments).map(([key, assessment]) => <TabsContent key={key} value={key} className="mt-0">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-signal-gold flex items-center justify-center text-white font-bold">
                        {assessment.number}
                      </div>
                      <h3 className="text-xl font-lora font-medium">{assessment.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {assessment.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>)}
          </Tabs>
        </div>
      </div>
    </section>;
};
export default AssessmentProcess;
