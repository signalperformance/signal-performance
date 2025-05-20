
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Move, Activity, User, Dumbbell, Club } from "lucide-react";

const AssessmentProcess = () => {
  const [activeAssessment, setActiveAssessment] = useState("mobility");
  
  const assessments = {
    mobility: {
      title: "Joint Health",
      icon: Move,
      description: "We assess the passive and active range of motion of every major joint to identify movement limitations and their root causes. These insights inform your fitness program to help reduce injury risk and support long-term joint health. We also track changes in range of motion over time to monitor progress and guide ongoing adjustments.",
      number: 1,
      color: "bg-blue-500"
    },
    strength: {
      title: "Maximal Strength",
      icon: Dumbbell,
      description: "We assess maximal strength using compound lifts like the bench press and deadlift to measure how effectively your neuromuscular system produces force. As maximal strength increases, you're able to move lighter loads — like a golf club — more quickly, directly supporting gains in swing speed.",
      number: 2,
      color: "bg-red-500"
    },
    metabolic: {
      title: "Metabolic Testing",
      icon: Activity,
      description: "We assess how efficiently your body produces and uses energy through aerobic and anaerobic testing. This allows us to define your personalized heart rate zones and design a conditioning program that improves endurance, enhances recovery, and supports sustained performance over multiple rounds of competitive golf.",
      number: 3,
      color: "bg-green-500"
    },
    body: {
      title: "Body Composition",
      icon: User,
      description: "We track changes in muscle mass and body fat percentage to evaluate whether your training is producing the right adaptations. This gives us more reliable feedback than body weight alone and helps ensure your progress aligns with performance goals.",
      number: 4,
      color: "bg-purple-500"
    },
    golf: {
      title: "Golf Performance Assessment",
      icon: Club,
      description: "We measure distance and dispersion metrics across every club in the bag to assess your ball-striking and shot control in a controlled environment. We then combine this with an analysis of your strokes gained data from tournament play to better understand the relative contribution of technical, physical, and mental factors to your performance.",
      number: 5,
      color: "bg-signal-gold"
    }
  };

  // Calculate the progress percentage based on active assessment
  const getProgressValue = () => {
    const numbers = Object.values(assessments).map(assessment => assessment.number);
    const max = Math.max(...numbers);
    const current = assessments[activeAssessment as keyof typeof assessments].number;
    return (current / max) * 100;
  };

  return <section id="assessment" className="section-padding bg-gradient-to-b from-white to-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora">Our Assessment Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Every quarter, members complete a full assessment across five essential areas to ensure their training is aligned, effective, and progressing toward their performance goals.</p>
        </div>

        {/* Desktop View: Radial Progress Wheel */}
        <div className="hidden md:flex md:flex-row md:gap-8 md:items-center">
          {/* Left side: Radial Progress Wheel */}
          <div className="w-1/2">
            <div className="relative w-[500px] h-[500px] mx-auto">
              {/* Central circle with active assessment */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white shadow-lg flex items-center justify-center z-10 border-4 border-signal-gold">
                <div className="text-center">
                  <span className="text-4xl font-bold text-signal-gold">
                    {assessments[activeAssessment as keyof typeof assessments].number}
                  </span>
                  <h3 className="font-lora text-lg mt-2">
                    {assessments[activeAssessment as keyof typeof assessments].title}
                  </h3>
                </div>
              </div>
              
              {/* Circular progress track */}
              <div className="absolute top-0 left-0 w-full h-full">
                <svg viewBox="0 0 500 500" className="w-full h-full">
                  {/* Background circle */}
                  <circle cx="250" cy="250" r="200" fill="none" stroke="#e5e7eb" strokeWidth="30" />
                  
                  {/* Progress arcs - will draw in sequence based on active step */}
                  {Object.entries(assessments).map(([key, assessment], index) => {
                    // Calculate the start and end angles for each segment
                    const totalSegments = Object.keys(assessments).length;
                    const segmentAngle = 360 / totalSegments;
                    const startAngle = -90 + (index * segmentAngle); // Start from top (12 o'clock)
                    const endAngle = startAngle + segmentAngle;
                    
                    // Convert to radians for calculations
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    
                    // Calculate points on circle for path
                    const startX = 250 + 200 * Math.cos(startRad);
                    const startY = 250 + 200 * Math.sin(startRad);
                    const endX = 250 + 200 * Math.cos(endRad);
                    const endY = 250 + 200 * Math.sin(endRad);
                    
                    // Flag for large arc (0 for arc <180 degrees, 1 for arc >=180 degrees)
                    const largeArcFlag = segmentAngle <= 180 ? "0" : "1";
                    
                    // Create the SVG arc path
                    const path = `M ${250} ${250} L ${startX} ${startY} A 200 200 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
                    
                    // Determine if this segment should be highlighted
                    const isActive = activeAssessment === key;
                    const shouldHighlight = assessments[activeAssessment as keyof typeof assessments].number >= assessment.number;
                    
                    return (
                      <path
                        key={key}
                        d={path}
                        fill={shouldHighlight ? assessment.color : "#f3f4f6"}
                        stroke="#fff"
                        strokeWidth="2"
                        opacity={isActive ? "1" : "0.7"}
                        className="transition-all duration-300 cursor-pointer hover:opacity-90"
                        onClick={() => setActiveAssessment(key)}
                      />
                    );
                  })}
                  
                  {/* Assessment number points on the wheel */}
                  {Object.entries(assessments).map(([key, assessment]) => {
                    // Calculate position on the circle
                    const angle = -90 + ((assessment.number - 1) * (360 / Object.keys(assessments).length));
                    const rad = (angle * Math.PI) / 180;
                    const x = 250 + 200 * Math.cos(rad);
                    const y = 250 + 200 * Math.sin(rad);
                    
                    // Determine if this point should be highlighted
                    const isActive = activeAssessment === key;
                    
                    return (
                      <g key={key} onClick={() => setActiveAssessment(key)} className="cursor-pointer">
                        <circle 
                          cx={x} 
                          cy={y} 
                          r="24" 
                          fill={isActive ? "white" : "#f9fafb"} 
                          stroke={isActive ? "#c9aa71" : "#e5e7eb"}
                          strokeWidth="2"
                          className="transition-all duration-300"
                        />
                        <text 
                          x={x} 
                          y={y} 
                          textAnchor="middle" 
                          dominantBaseline="central"
                          fill={isActive ? "#c9aa71" : "#6b7280"}
                          fontWeight="bold"
                          fontSize="16"
                        >
                          {assessment.number}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
          
          {/* Right side: Description and Progress */}
          <div className="w-1/2">
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", 
                    assessments[activeAssessment as keyof typeof assessments].color)}>
                    {assessments[activeAssessment as keyof typeof assessments].number}
                  </div>
                  <h3 className="text-2xl font-lora font-medium">
                    {assessments[activeAssessment as keyof typeof assessments].title}
                  </h3>
                </div>
                
                <Progress value={getProgressValue()} className="h-2 mb-6" />
                
                <p className="text-muted-foreground">
                  {assessments[activeAssessment as keyof typeof assessments].description}
                </p>
                
                <div className="flex mt-6 justify-between">
                  {Object.entries(assessments).map(([key, assessment]) => (
                    <button
                      key={key}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-all",
                        activeAssessment === key 
                          ? "bg-signal-gold text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                      onClick={() => setActiveAssessment(key)}
                    >
                      {assessment.title.split(' ')[0]}
                    </button>
                  ))}
                </div>
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
            
            <div className="mb-4">
              <Progress value={getProgressValue()} className="h-2" />
            </div>
            
            {Object.entries(assessments).map(([key, assessment]) => <TabsContent key={key} value={key} className="mt-0">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-bold",
                        assessment.color)}>
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
