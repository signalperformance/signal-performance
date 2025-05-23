
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Move, Activity, User, Dumbbell, Club } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const AssessmentProcess = () => {
  const {
    t,
    language
  } = useLanguage();
  const [activeAssessment, setActiveAssessment] = useState("mobility");
  const [autoProgressEnabled, setAutoProgressEnabled] = useState(true);
  const [isInViewport, setIsInViewport] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const assessments = {
    mobility: {
      title: t('assessment.joint.title'),
      icon: Move,
      description: t('assessment.joint.description'),
      number: 1,
      color: "bg-blue-500"
    },
    strength: {
      title: t('assessment.strength.title'),
      icon: Dumbbell,
      description: t('assessment.strength.description'),
      number: 2,
      color: "bg-red-500"
    },
    metabolic: {
      title: t('assessment.metabolic.title'),
      icon: Activity,
      description: t('assessment.metabolic.description'),
      number: 3,
      color: "bg-green-500"
    },
    body: {
      title: t('assessment.body.title'),
      icon: User,
      description: t('assessment.body.description'),
      number: 4,
      color: "bg-purple-500"
    },
    golf: {
      title: "Skill Assessment",
      icon: Club,
      description: t('assessment.golf.description'),
      number: 5,
      color: "bg-signal-gold"
    }
  };

  // Function to advance to the next tab
  const advanceToNextTab = () => {
    const keys = Object.keys(assessments);
    const currentIndex = keys.indexOf(activeAssessment);
    const nextIndex = (currentIndex + 1) % keys.length;
    setActiveAssessment(keys[nextIndex]);
  };

  // Set up intersection observer to detect when the section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3, // When 30% of the element is visible
      }
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

  // Set up auto-progression timer only when in viewport
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Only set a new timer if auto-progress is enabled AND component is in viewport
    if (autoProgressEnabled && isInViewport) {
      timerRef.current = setTimeout(() => {
        advanceToNextTab();
      }, 8000); // Changed from 5000 to 8000 (8 seconds)
    }
    
    // Cleanup timer on unmount or when active assessment or viewport status changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [activeAssessment, autoProgressEnabled, isInViewport]);

  // Handle tab click - stop auto progression
  const handleTabClick = (key: string) => {
    setActiveAssessment(key);
    setAutoProgressEnabled(false);
  };

  // Calculate the progress percentage based on active assessment
  const getProgressValue = () => {
    const numbers = Object.values(assessments).map(assessment => assessment.number);
    const max = Math.max(...numbers);
    const current = assessments[activeAssessment as keyof typeof assessments].number;
    return current / max * 100;
  };

  // Function to get the text color class based on assessment key
  const getTextColorClass = (key: string) => {
    switch (key) {
      case 'mobility':
        return 'text-blue-500';
      case 'strength':
        return 'text-red-500';
      case 'metabolic':
        return 'text-green-500';
      case 'body':
        return 'text-purple-500';
      case 'golf':
        return 'text-signal-gold';
      default:
        return 'text-gray-500';
    }
  };

  // Function to get circle color for the number points based on assessment key
  const getCircleColor = (key: string) => {
    switch (key) {
      case 'mobility':
        return '#3b82f6';
      // blue-500
      case 'strength':
        return '#ef4444';
      // red-500
      case 'metabolic':
        return '#22c55e';
      // green-500
      case 'body':
        return '#a855f7';
      // purple-500
      case 'golf':
        return '#c9aa71';
      // signal-gold
      default:
        return '#6b7280';
      // gray-500
    }
  };
  
  return <section id="assessment" className="section-padding bg-white" ref={sectionRef}>
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-lora">{t('assessment.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('assessment.description')}</p>
        </div>

        {/* Desktop View: Radial Progress Wheel */}
        <div className="hidden md:flex md:flex-row md:gap-8 md:items-center">
          {/* Left side: Radial Progress Wheel */}
          <div className="w-1/2">
            <div className="relative w-[500px] h-[500px] mx-auto">
              {/* Central circle - now remains blank */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white shadow-lg flex items-center justify-center z-10 border-4 border-signal-gold">
                {/* Intentionally left blank */}
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
                    const startAngle = -90 + index * segmentAngle; // Start from top (12 o'clock)
                    const endAngle = startAngle + segmentAngle;

                    // Convert to radians for calculations
                    const startRad = startAngle * Math.PI / 180;
                    const endRad = endAngle * Math.PI / 180;

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

                    // Get the color matching the current segment's number
                    const segmentColor = getCircleColor(key);
                    return <path 
                      key={key} 
                      d={path} 
                      fill={shouldHighlight ? segmentColor : "#f3f4f6"} 
                      stroke="#fff" 
                      strokeWidth="2" 
                      opacity={isActive ? "1" : "0.7"} 
                      className="transition-all duration-300 cursor-pointer hover:opacity-90" 
                      onClick={() => handleTabClick(key)} 
                    />;
                  })}
                  
                  {/* Assessment number points on the wheel */}
                  {Object.entries(assessments).map(([key, assessment]) => {
                    // Calculate position on the circle
                    const angle = -90 + (assessment.number - 1) * (360 / Object.keys(assessments).length);
                    const rad = angle * Math.PI / 180;
                    const x = 250 + 200 * Math.cos(rad);
                    const y = 250 + 200 * Math.sin(rad);

                    // Determine if this point should be highlighted
                    const isActive = activeAssessment === key;
                    // Get proper color for the circle based on assessment key
                    const circleColor = getCircleColor(key);
                    return <g 
                      key={key} 
                      onClick={() => handleTabClick(key)} 
                      className="cursor-pointer">
                          <circle 
                            cx={x} 
                            cy={y} 
                            r="24" 
                            fill={isActive ? "white" : "#f9fafb"} 
                            stroke={isActive ? circleColor : "#e5e7eb"} 
                            strokeWidth="2" 
                            className="transition-all duration-300" 
                          />
                          <text 
                            x={x} 
                            y={y} 
                            textAnchor="middle" 
                            dominantBaseline="central" 
                            fill={circleColor} 
                            fontWeight="bold" 
                            fontSize="16"
                          >
                            {assessment.number}
                          </text>
                        </g>;
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
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", assessments[activeAssessment as keyof typeof assessments].color)}>
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
                
                
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Mobile View: Improved Tabs Layout */}
        <div className="md:hidden">
          <Tabs value={activeAssessment} onValueChange={(value) => handleTabClick(value)} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6 rounded-xl p-1 bg-muted/20 shadow-sm">
              {Object.entries(assessments).map(([key, assessment]) => {
              const textColorClass = getTextColorClass(key);
              const isActive = activeAssessment === key;
              const circleColor = getCircleColor(key);
              return <TabsTrigger 
                key={key} 
                value={key} 
                className={cn("flex justify-center py-3 rounded-lg transition-all", isActive ? "shadow-sm" : "hover:bg-muted/40")}
              >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isActive ? "bg-white shadow-md" : "bg-gray-50")} style={{
                  border: isActive ? `2px solid ${circleColor}` : '1px solid #e5e7eb'
                }}>
                      <span className={cn("font-bold", textColorClass)}>
                        {assessment.number}
                      </span>
                    </div>
                  </TabsTrigger>;
            })}
            </TabsList>
            
            <div className="mb-4">
              <Progress value={getProgressValue()} className="h-2" style={{
              backgroundColor: '#e5e7eb',
              '--progress-background': getCircleColor(activeAssessment as keyof typeof assessments)
            } as React.CSSProperties} />
            </div>
            
            {Object.entries(assessments).map(([key, assessment]) => <TabsContent key={key} value={key} className="mt-0">
                <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", assessment.color)}>
                        {assessment.number}
                      </div>
                      <h3 className="text-xl font-lora font-medium">{assessment.title}</h3>
                    </div>
                    <p className="text-muted-foreground">
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
