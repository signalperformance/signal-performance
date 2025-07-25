
import { useEffect } from "react";
import { useLoadingState } from "@/hooks/useLoadingState";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Membership from "@/components/Membership";
import AssessmentProcess from "@/components/AssessmentProcess";
import GettingStarted from "@/components/GettingStarted";
import Philosophy from "@/components/Philosophy";
import WhoItsFor from "@/components/WhoItsFor";
import WeeklySchedule from "@/components/WeeklySchedule";
import StudioLocation from "@/components/StudioLocation";
import Footer from "@/components/Footer";
import FloatingAssessmentButton from "@/components/FloatingAssessmentButton";

const Index = () => {
  const { isLoading, completeLoading } = useLoadingState();

  useEffect(() => {
    document.title = "Signal Performance";
  }, []);
  
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={completeLoading} />;
  }
  
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Navbar />
      <Hero />
      <Philosophy />
      <AssessmentProcess />
      <Membership />
      <WeeklySchedule />
      <WhoItsFor />
      <StudioLocation />
      <GettingStarted />
      <About />
      <Footer />
      <FloatingAssessmentButton />
    </div>
  );
};

export default Index;
