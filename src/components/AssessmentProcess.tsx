
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Move, Activity, User, Dumbbell, Club, Check } from "lucide-react";

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
    const current = assessments[activeAssessment as keyof typeof assessments].number;
    return (current / 5) * 100; // 5 is the total number of steps
  };

  // Get assessment key by number
  const getAssessmentKeyByNumber = (number: number) => {
    const entry = Object.entries(assessments).find(([_, value]) => value.number === number);
    return entry ? entry[0] : "mobility"; // Default to first assessment
  };

  // Go to next assessment
  const goToNextAssessment = () => {
    const currentNumber = assessments[activeAssessment as keyof typeof assessments].number;
    if (currentNumber < 5) {
      setActiveAssessment(getAssessmentKeyByNumber(currentNumber + 1));
    }
  };

  // Go to previous assessment
  const goToPreviousAssessment = () => {
    const currentNumber = assessments[activeAssessment as keyof typeof assessments].number;
    if (currentNumber > 1) {
      setActiveAssessment(getAssessmentKeyByNumber(currentNumber - 1));
    }
  };

  return (
    <section id="assessment" className="section-padding bg-gradient-to-b from-white to-signal-light-gray">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora">Our Assessment Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Every quarter, members complete a full assessment across five essential areas to ensure their training is aligned, effective, and progressing toward their performance goals.</p>
        </div>

        {/* Desktop Timeline View */}
        <div className="hidden md:block">
          {/* Interactive Timeline */}
          <div className="relative mb-10">
            {/* Timeline Track */}
            <div className="absolute h-2 bg-gray-200 rounded-full w-full top-10 transform -translate-y-1/2"></div>
            
            {/* Timeline Progress */}
            <div 
              className="absolute h-2 bg-signal-gold rounded-full top-10 transform -translate-y-1/2 transition-all duration-300 ease-in-out"
              style={{ width: `${getProgressValue()}%` }}
            ></div>
            
            {/* Timeline Points */}
            <div className="flex justify-between relative">
              {Object.entries(assessments).map(([key, assessment]) => (
                <div 
                  key={key} 
                  className="flex flex-col items-center relative cursor-pointer"
                  onClick={() => setActiveAssessment(key)}
                >
                  {/* Circle/Point on Timeline */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-300",
                    activeAssessment === key 
                      ? "border-signal-gold bg-white text-signal-gold scale-110" 
                      : assessment.number <= assessments[activeAssessment as keyof typeof assessments].number
                        ? "border-signal-gold bg-signal-gold text-white"
                        : "border-gray-300 bg-white text-gray-500"
                  )}>
                    {assessment.number < assessments[activeAssessment as keyof typeof assessments].number 
                      ? <Check className="w-5 h-5" /> 
                      : assessment.number}
                  </div>
                  
                  {/* Title */}
                  <span className={cn(
                    "mt-3 font-medium transition-all duration-300",
                    activeAssessment === key 
                      ? "text-signal-gold" 
                      : "text-gray-700"
                  )}>
                    {assessment.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Card */}
          <Card className="bg-white shadow-md transition-all duration-300 transform hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className={cn(
                  "w-16 h-16 rounded-lg flex items-center justify-center shrink-0 text-white",
                  assessments[activeAssessment as keyof typeof assessments].color
                )}>
                  {React.createElement(assessments[activeAssessment as keyof typeof assessments].icon, { 
                    size: 32 
                  })}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-lora">
                      {assessments[activeAssessment as keyof typeof assessments].title}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      Step {assessments[activeAssessment as keyof typeof assessments].number} of 5
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    {assessments[activeAssessment as keyof typeof assessments].description}
                  </p>
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <button 
                      onClick={goToPreviousAssessment}
                      disabled={assessments[activeAssessment as keyof typeof assessments].number === 1}
                      className="px-4 py-2 text-gray-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                      Previous
                    </button>
                    <button 
                      onClick={goToNextAssessment}
                      disabled={assessments[activeAssessment as keyof typeof assessments].number === 5}
                      className="px-4 py-2 bg-signal-gold text-white rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    
                    {/* Mobile Navigation */}
                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                      <button 
                        onClick={goToPreviousAssessment}
                        disabled={assessment.number === 1}
                        className="px-3 py-1 text-sm text-gray-700 flex items-center gap-1 disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                        Prev
                      </button>
                      <button 
                        onClick={goToNextAssessment}
                        disabled={assessment.number === 5}
                        className="px-3 py-1 text-sm bg-signal-gold text-white rounded flex items-center gap-1 disabled:opacity-50"
                      >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>)}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default AssessmentProcess;
