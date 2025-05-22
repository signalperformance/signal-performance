
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Membership from "@/components/Membership";
import AssessmentProcess from "@/components/AssessmentProcess";
import WhySignalPerformance from "@/components/WhySignalPerformance";
import Footer from "@/components/Footer";
import WaitlistDialog from "@/components/WaitlistDialog";

const Index = () => {
  useEffect(() => {
    document.title = "Signal Performance";
  }, []);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Membership />
      <AssessmentProcess />
      <About />
      <WhySignalPerformance />
      <WaitlistDialog />
      <Footer />
    </div>
  );
};

export default Index;
