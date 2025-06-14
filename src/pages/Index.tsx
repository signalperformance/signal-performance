
import { useEffect } from "react";
import { useLoadingState } from "@/hooks/useLoadingState";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Membership from "@/components/Membership";
import AssessmentProcess from "@/components/AssessmentProcess";
import Philosophy from "@/components/Philosophy";
import WeeklySchedule from "@/components/WeeklySchedule";
import Footer from "@/components/Footer";
import WaitlistDialog from "@/components/WaitlistDialog";
import GettingStarted from "@/components/GettingStarted";

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
      <GettingStarted />
      <Philosophy />
      <AssessmentProcess />
      <Membership />
      <WeeklySchedule />
      <About />
      <WaitlistDialog />
      <Footer />
    </div>
  );
};

export default Index;

