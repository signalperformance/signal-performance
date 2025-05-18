
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Membership from "@/components/Membership";
import About from "@/components/About";
import Founder from "@/components/Founder";
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
      <About />
      <Founder />
      <WaitlistForm />
      <Footer />
    </div>
  );
};

export default Index;
