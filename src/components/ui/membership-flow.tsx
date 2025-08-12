import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PricingTier } from "@/components/ui/pricing-section";
interface MembershipFlowProps {
  tiers: PricingTier[];
  className?: string;
  title?: string;
  subtitle?: string;
}
const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
export function MembershipFlow({
  tiers,
  className,
  title,
  subtitle
}: MembershipFlowProps) {
  const {
    t
  } = useLanguage();
  const assessmentFeatures = useMemo(() => [t("gettingstarted.assessmentPackage.bullets.assess"), t("gettingstarted.assessmentPackage.bullets.review"), t("gettingstarted.assessmentPackage.bullets.train")], [t]);
  const orderedTiers = useMemo(() => {
    // Ensure Pro (plus) shows first by default
    const pro = tiers.find(x => x.id === "plus");
    const basic = tiers.find(x => x.id === "foundations");
    return [pro, basic].filter(Boolean) as PricingTier[];
  }, [tiers]);
  const [activeTier, setActiveTier] = useState<string>(orderedTiers[0]?.id ?? tiers[0]?.id);
  const currentTier = useMemo(() => orderedTiers.find(x => x.id === activeTier) ?? orderedTiers[0] ?? tiers[0], [activeTier, orderedTiers, tiers]);
  const sectionTitle = title ?? t("pricing.title");
  return <section className={cn("section-padding text-foreground", "overflow-hidden", className)}>
      <div className="container mx-auto container-padding">
        <div className="flex flex-col items-center gap-4 mb-10 md:mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-lora">{sectionTitle}</h2>
          {subtitle && <p className="text-muted-foreground max-w-2xl">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Step 1: Assessment Card */}
          <article className={cn("relative group", "rounded-3xl transition-all duration-300", "flex flex-col bg-card border border-border shadow-lg hover:shadow-xl")}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="px-4 py-1.5 text-xs md:text-sm font-medium whitespace-nowrap bg-primary text-primary-foreground border-none shadow">
                {t("flow.step1")}
              </Badge>
            </div>

            <div className="p-6 md:p-8 flex-1">
              <div className="mb-3 hidden lg:block lg:min-h-12" aria-hidden />

              <div className="mb-6">
                <div className="flex items-baseline gap-2 min-h-[2.75rem] my-[3px]">
                  <span className="text-4xl font-bold">{t("gettingstarted.assessmentPackage.price")}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("assessment.description")}
                </p>
              </div>

              <ul className="space-y-4">
                {assessmentFeatures.map(name => <li key={name} className="flex gap-3">
                    <div className={cn("mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border", "border-primary text-primary")} aria-hidden>
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{name}</div>
                    </div>
                  </li>)}
              </ul>

              <div className="mt-6">
                <Button onClick={() => {
                const el = document.getElementById("assessment-process");
                el?.scrollIntoView({
                  behavior: "smooth",
                  block: "start"
                });
              }} className="w-full sm:w-auto">
                  {t("cta.learnMore")}
                </Button>
              </div>

            </div>
          </article>

          {/* Step 2: Membership selection with toggle */}
          <article className={cn("relative group", "rounded-3xl transition-all duration-300", "flex flex-col bg-card border border-border shadow-lg hover:shadow-xl")}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="px-4 py-1.5 text-xs md:text-sm font-medium whitespace-nowrap bg-primary text-primary-foreground border-none shadow">
                {t("flow.step2")}
              </Badge>
            </div>

            <div className="p-6 md:p-8 flex-1">
              {/* Toggle */}
              <Tabs value={activeTier} onValueChange={setActiveTier} className="w-full">
              <div className="flex items-center justify-center mb-3 lg:mb-4 lg:min-h-12">
                <TabsList className="bg-muted">
                  {orderedTiers.map(tier => <TabsTrigger key={tier.id} value={tier.id} className="min-w-[96px]">
                      {tier.name}
                    </TabsTrigger>)}
                </TabsList>
              </div>

                {orderedTiers.map(tier => <TabsContent key={tier.id} value={tier.id} className="mt-0">
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 min-h-[2.75rem]">
                        <span className="text-4xl font-bold">
                          {tier.currency ?? "NT$"}
                          {formatNumber(tier.price.monthly)}
                        </span>
                        <span className="text-sm text-muted-foreground">{t("pricing.perMonth")}</span>
                      </div>
                      {tier.description && <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>}
                    </div>

                    <ul className="space-y-4">
                      {tier.features.map(feature => <li key={feature.name} className="flex gap-3">
                          <div className={cn("mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border", feature.included ? "border-primary text-primary" : "border-muted text-muted-foreground")} aria-hidden>
                            {feature.included ? <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg> : <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 6l12 12M6 18L18 6" />
                              </svg>}
                          </div>
                          <div>
                            <div className={cn("text-sm font-medium", !feature.included && "line-through text-muted-foreground")}>{feature.name}</div>
                            {feature.description && <div className={cn("text-sm text-muted-foreground", !feature.included && "line-through")}>
                                {feature.description}
                              </div>}
                          </div>
                        </li>)}
                    </ul>
                  </TabsContent>)}
              </Tabs>
            </div>
          </article>
        </div>
      </div>
    </section>;
}