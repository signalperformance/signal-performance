
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Membership from "@/components/Membership";
import AssessmentProcess from "@/components/AssessmentProcess";
import WaitlistForm from "@/components/WaitlistForm";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    document.title = "Signal Performance - Elite Golf Training";
  }, []);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Membership />
      <AssessmentProcess />
      <WaitlistForm />
      <Footer />
    </div>
  );
};

export default Index;
