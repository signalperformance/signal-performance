
import { useEffect, useMemo, Suspense } from "react";
import { useLoadingState } from "@/hooks/useLoadingState";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Membership from "@/components/Membership";
import AssessmentProcess from "@/components/AssessmentProcess";

import Philosophy from "@/components/Philosophy";

import LazyWeeklySchedule from "@/components/lazy/LazyWeeklySchedule";
import LazyStudioLocation from "@/components/lazy/LazyStudioLocation";
import Footer from "@/components/Footer";
import FloatingAssessmentButton from "@/components/FloatingAssessmentButton";
import FloatingControls from "@/components/FloatingControls";


import { MembershipFlow } from "@/components/ui/membership-flow";

import { Trophy, Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "react-router-dom";

const Index = () => {
  const { isLoading, completeLoading } = useLoadingState();
  const { t } = useLanguage();
  const location = useLocation();
  useEffect(() => {
    document.title = "Signal Performance";
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const params = new URLSearchParams(location.search);
    const targetId =
      (location.hash || "").replace("#", "") || params.get("section");
    if (!targetId) return;
    const section = document.getElementById(targetId);
    if (!section) return;

    const nav = document.getElementById("site-nav");
    const offset = (nav?.offsetHeight ?? 0) + 12; // extra space so previous section color isn't visible

    const anchor = section.querySelector("[data-scroll-anchor], h1, h2, h3") as HTMLElement | null;
    const target = anchor ?? section;

    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }, [isLoading, location.hash, location.search]);

  const membershipTiers = useMemo(() => ([
    {
      id: "plus",
      name: t('pricing.plus.name'),
      currency: "NT$",
      price: { monthly: 15000, yearly: 15000 * 12 },
      originalPrice: { monthly: 18000, yearly: 18000 * 12 },
      description: t('pricing.plus.description'),
      highlight: true,
      badge: t('pricing.mostPopular'),
      icon: <Trophy className="w-7 h-7" />,
      isPromo: true,
      promoDetails: {
        spotsRemaining: 6,
        totalSpots: 10
      },
      features: [
        { name: t('pricing.features.physical.4x'), included: true },
        { name: t('pricing.features.mental.2x'), included: true },
        { name: t('pricing.features.report.monthly'), included: true },
      ],
    },
    {
      id: "foundations",
      name: t('pricing.foundations.name'),
      currency: "NT$",
      price: { monthly: 13000, yearly: 13000 * 12 },
      description: t('pricing.foundations.description'),
      icon: <Dumbbell className="w-7 h-7" />,
      isPromo: false,
      features: [
        { name: t('pricing.features.physical.3x'), included: true },
        { name: t('pricing.features.mental.2x'), included: false },
        { name: t('pricing.features.report.monthly'), included: false },
      ],
    },
  ]), [t]);


  if (isLoading) {
    return <LoadingScreen onLoadingComplete={completeLoading} />;
  }
  
  return (
    <>
      <div className="min-h-screen flex flex-col animate-fade-in">
        <Navbar />
        <section id="home" className="bg-background scroll-mt-24 lg:scroll-mt-32">
          <Hero />
        </section>
        <section className="bg-muted scroll-mt-24 lg:scroll-mt-32">
          <Philosophy />
        </section>
        <section id="getting-started" className="bg-card scroll-mt-24 lg:scroll-mt-32">
          <MembershipFlow tiers={membershipTiers} subtitle={t('gettingstarted.subtitle')} />
        </section>
        <section id="membership" className="bg-muted scroll-mt-24 lg:scroll-mt-32">
          <Membership />
        </section>
        <section id="weekly-schedule" className="bg-muted scroll-mt-24 lg:scroll-mt-32">
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-signal-gold border-t-transparent rounded-full"></div></div>}>
            <LazyWeeklySchedule />
          </Suspense>
        </section>
        <section id="assessment-process" className="bg-muted scroll-mt-24 lg:scroll-mt-32">
          <AssessmentProcess />
        </section>
        <section id="studio-location" className="bg-muted scroll-mt-24 lg:scroll-mt-32">
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-signal-gold border-t-transparent rounded-full"></div></div>}>
            <LazyStudioLocation />
          </Suspense>
        </section>
        <section id="about" className="bg-card scroll-mt-24 lg:scroll-mt-32">
          <About />
        </section>
        <Footer />
      </div>
      <FloatingAssessmentButton />
      <FloatingControls />
    </>
  );
};

export default Index;
