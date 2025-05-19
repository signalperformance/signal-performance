
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Founder from "@/components/Founder";
import Membership from "@/components/Membership";
import AssessmentProcess from "@/components/AssessmentProcess";
import Footer from "@/components/Footer";
import WaitlistDialog from "@/components/WaitlistDialog";

const Index = () => {
  useEffect(() => {
    document.title = "Signal Performance - Elite Golf Training";
  }, []);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Membership />
      <AssessmentProcess />
      <WaitlistDialog />
      <Footer />
    </div>
  );
};

export default Index;
