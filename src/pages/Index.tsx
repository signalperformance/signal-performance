
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Membership from "@/components/Membership";
import AssessmentProcess from "@/components/AssessmentProcess";
import Philosophy from "@/components/Philosophy";
import Footer from "@/components/Footer";
import WaitlistDialog from "@/components/WaitlistDialog";

const Index = () => {
  useEffect(() => {
    document.title = "Signal Performance";
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Membership />
      <AssessmentProcess />
      <Philosophy />
      <About />
      <WaitlistDialog />
      <Footer />
    </div>
  );
};

export default Index;
