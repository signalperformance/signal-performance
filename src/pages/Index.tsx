
import { useEffect, Suspense, lazy } from "react";
import { useLoadingState } from "@/hooks/useLoadingState";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

// Lazy-loaded components
const About = lazy(() => import("@/components/About"));
const Membership = lazy(() => import("@/components/Membership"));
const AssessmentProcess = lazy(() => import("@/components/AssessmentProcess"));
const GettingStarted = lazy(() => import("@/components/GettingStarted"));
const Philosophy = lazy(() => import("@/components/Philosophy"));
const WhoItsFor = lazy(() => import("@/components/WhoItsFor"));
const WeeklySchedule = lazy(() => import("@/components/WeeklySchedule"));
const Footer = lazy(() => import("@/components/Footer"));
const WaitlistDialog = lazy(() => import("@/components/WaitlistDialog"));

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
      <Suspense fallback={null}>
        <Philosophy />
        <WhoItsFor />
        <AssessmentProcess />
        <Membership />
        <WeeklySchedule />
        <GettingStarted />
        <About />
        <WaitlistDialog />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
