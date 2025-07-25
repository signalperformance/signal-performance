
import { useEffect } from "react";
import { useLoadingState } from "@/hooks/useLoadingState";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import GettingStarted from "@/components/GettingStarted";
import Philosophy from "@/components/Philosophy";
import Footer from "@/components/Footer";
import FloatingAssessmentButton from "@/components/FloatingAssessmentButton";
import {
  AssessmentProcessWithSuspense,
  MembershipWithSuspense,
  WeeklyScheduleWithSuspense,
  WhoItsForWithSuspense,
  StudioLocationWithSuspense,
} from "@/components/LazyComponents";

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
      <AssessmentProcessWithSuspense />
      <MembershipWithSuspense />
      <WeeklyScheduleWithSuspense />
      <WhoItsForWithSuspense />
      <StudioLocationWithSuspense />
      <GettingStarted />
      <About />
      <Footer />
      <FloatingAssessmentButton />
    </div>
  );
};

export default Index;
