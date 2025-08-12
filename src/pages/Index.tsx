
import { useEffect, useMemo } from "react";
import { useLoadingState } from "@/hooks/useLoadingState";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Membership from "@/components/Membership";
import AssessmentProcess from "@/components/AssessmentProcess";

import Philosophy from "@/components/Philosophy";

import WeeklySchedule from "@/components/WeeklySchedule";
import StudioLocation from "@/components/StudioLocation";
import Footer from "@/components/Footer";
import FloatingAssessmentButton from "@/components/FloatingAssessmentButton";
import { MembershipFlow } from "@/components/ui/membership-flow";

import { Trophy, Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { isLoading, completeLoading } = useLoadingState();
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "Signal Performance";
  }, []);

  const membershipTiers = useMemo(() => ([
    {
      id: "plus",
      name: t('pricing.plus.name'),
      currency: "NT$",
      price: { monthly: 15000, yearly: 15000 * 12 },
      description: t('pricing.plus.description'),
      highlight: true,
      badge: t('pricing.mostPopular'),
      icon: <Trophy className="w-7 h-7" />,
      features: [
        { name: t('pricing.features.physical.4x'), included: true },
        { name: t('pricing.features.mental.2x'), included: true },
        { name: t('pricing.features.report.monthly'), included: true },
        { name: t('pricing.features.assessment.quarterly'), included: true },
      ],
    },
    {
      id: "foundations",
      name: t('pricing.foundations.name'),
      currency: "NT$",
      price: { monthly: 10000, yearly: 10000 * 12 },
      description: t('pricing.foundations.description'),
      icon: <Dumbbell className="w-7 h-7" />,
      features: [
        { name: t('pricing.features.physical.3x'), included: true },
        { name: t('pricing.features.mental.2x'), included: false },
        { name: t('pricing.features.report.monthly'), included: false },
        { name: t('pricing.features.assessment.quarterly'), included: true },
      ],
    },
  ]), [t]);


  if (isLoading) {
    return <LoadingScreen onLoadingComplete={completeLoading} />;
  }
  
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Navbar />
      <section className="bg-background">
        <Hero />
      </section>
      <section className="bg-muted">
        <Philosophy />
      </section>
      <section className="bg-card">
        <MembershipFlow tiers={membershipTiers} subtitle={t('gettingstarted.subtitle')} />
      </section>
      <section className="bg-muted">
        <Membership />
      </section>
      <section className="bg-muted">
        <WeeklySchedule />
      </section>
      <section className="bg-muted">
        <AssessmentProcess />
      </section>
      <section className="bg-muted">
        <StudioLocation />
      </section>
      <section className="bg-card">
        <About />
      </section>
      <Footer />
      <FloatingAssessmentButton />
    </div>
  );
};

export default Index;
