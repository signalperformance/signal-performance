
import { useEffect, useMemo } from "react";
import { useLoadingState } from "@/hooks/useLoadingState";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Membership from "@/components/Membership";
import AssessmentProcess from "@/components/AssessmentProcess";
import GettingStarted from "@/components/GettingStarted";
import Philosophy from "@/components/Philosophy";

import WeeklySchedule from "@/components/WeeklySchedule";
import StudioLocation from "@/components/StudioLocation";
import Footer from "@/components/Footer";
import FloatingAssessmentButton from "@/components/FloatingAssessmentButton";
import { MembershipFlow } from "@/components/ui/membership-flow";
import { PricingTable } from "@/components/ui/pricing-table";
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

  const comparisonPlans = [
    { name: "Foundations", level: "golf", price: { monthly: 12000, yearly: 12000 * 12 } },
    { name: "Plus", level: "complete", price: { monthly: 18000, yearly: 18000 * 12 }, popular: true },
  ];

  const comparisonFeatures = [
    { name: "Physical Training", values: { golf: "3× / week", complete: "4× / week" } },
    { name: "Mental Training", values: { golf: "—", complete: "2× / month" } },
    { name: "Progress Tracking Review", values: { golf: "Monthly", complete: "Monthly" } },
    { name: "Quarterly Assessment", values: { golf: true, complete: true } },
  ];

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
      <section className="bg-background">
        <AssessmentProcess />
      </section>
      <section className="bg-muted">
        <MembershipFlow tiers={membershipTiers} subtitle={t('gettingstarted.subtitle')} />
      </section>
      <section className="bg-background">
        <Membership />
      </section>
      <section className="bg-muted">
        <PricingTable
          title="What's included in your membership"
          plans={comparisonPlans}
          features={comparisonFeatures}
          defaultPlan="complete"
          defaultInterval="monthly"
        />
      </section>
      <section className="bg-background">
        <GettingStarted />
      </section>
      <section className="bg-muted">
        <WeeklySchedule />
      </section>
      <section className="bg-background">
        <StudioLocation />
      </section>
      <section className="bg-muted">
        <About />
      </section>
      <Footer />
      <FloatingAssessmentButton />
    </div>
  );
};

export default Index;
