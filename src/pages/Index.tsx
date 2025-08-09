
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
import { PricingSection } from "@/components/ui/pricing-section";
import { Trophy, Dumbbell } from "lucide-react";

const Index = () => {
  const { isLoading, completeLoading } = useLoadingState();

  useEffect(() => {
    document.title = "Signal Performance";
  }, []);

  const membershipTiers = [
    {
      name: "Complete Performance (Flagship)",
      currency: "NT$",
      price: { monthly: 18000, yearly: 18000 * 12 },
      description: "~19 sessions/month",
      highlight: true,
      badge: "Best Value",
      icon: <Trophy className="w-7 h-7" />,
      features: [
        { name: "4×/week Physical Training (1-on-3 semi-private)", included: true },
        { name: "2×/month Mental Training (1-on-1)", included: true },
        { name: "Monthly Progress Tracking Review", included: true },
      ],
    },
    {
      name: "Golf Fitness Membership",
      currency: "NT$",
      price: { monthly: 12000, yearly: 12000 * 12 },
      description: "~13 sessions/month",
      icon: <Dumbbell className="w-7 h-7" />,
      features: [
        { name: "3×/week Physical Training (1-on-3 semi-private)", included: true },
        { name: "Monthly Progress Tracking Review", included: true },
        { name: "Mental training available as an add-on", included: false },
      ],
    },
  ];

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
      <PricingSection
        title="Step 2 – Membership Options (Month 2 Onward)"
        tiers={membershipTiers}
      />
      <About />
      <Footer />
      <FloatingAssessmentButton />
    </div>
  );
};

export default Index;
