import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isStep2VideoOpen, setIsStep2VideoOpen] = useState(false);
  const currentTier = useMemo(() => orderedTiers.find(x => x.id === activeTier) ?? orderedTiers[0] ?? tiers[0], [activeTier, orderedTiers, tiers]);
  const sectionTitle = title ?? t("pricing.title");
  
  return <section className={cn("section-padding text-foreground", "overflow-hidden", className)}>
      <div className="container mx-auto container-padding">
        <div className="flex flex-col items-center gap-4 mb-10 md:mb-14 text-center">
          <h2 data-scroll-anchor className="text-3xl md:text-4xl font-bold font-lora">{sectionTitle}</h2>
          {subtitle && <p className="text-muted-foreground max-w-2xl">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Step 1: Assessment Card */}
          <article className={cn("relative group", "rounded-3xl transition-all duration-300", "flex flex-col bg-card border border-border shadow-lg hover:shadow-xl")}>
            <div className="p-6 md:p-8 flex-1">
              <div className="mb-4">
                <Badge variant="outline" className="rounded-full border border-primary bg-primary/10 text-foreground px-4 py-1.5 text-xs md:text-sm font-medium whitespace-nowrap">
                  {t("flow.step1")}
                </Badge>
              </div>

              {/* Assessment Promo Banner */}
              <div className="mb-4 bg-gradient-to-r from-red-500/90 to-orange-500/90 text-white rounded-xl p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-bold text-sm">{t("promo.limitedOffer")}</h4>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 min-w-[160px]">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-500"
                        style={{ width: "20%" }}
                      />
                    </div>
                    <div className="text-xs font-medium">
                      <span className="font-bold">2</span> {t("promo.spotsTaken")} • <span className="font-bold">8</span> {t("promo.remaining")}
                    </div>
                  </div>
                </div>
              </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 min-h-[2.75rem] my-[3px]">
                    <div className="flex flex-col">
                      <span className="text-lg line-through text-muted-foreground">NT$12,000</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-green-600">{t("gettingstarted.assessmentPackage.price")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {t("promo.save")} NT$2,000
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("assessment.description")}
                  </p>
                </div>

              <ul className="space-y-4">
                {assessmentFeatures.map(name => <li key={name} className="flex gap-3">
                    <div className={cn("mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border", "border-primary text-foreground")} aria-hidden>
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
                <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {t("cta.learnMore")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[90vw] sm:w-[80vw] lg:w-[70vw] h-auto max-h-[80vh] sm:max-h-[90vh] p-4 bg-background">
                    <div className="relative w-full aspect-video">
                      {isVideoOpen && (
                        <iframe 
                          src="https://player.vimeo.com/video/1115391563?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1" 
                          width="100%" 
                          height="100%" 
                          frameBorder="0" 
                          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                          referrerPolicy="strict-origin-when-cross-origin" 
                          title="Assessment Proces"
                          className="rounded-lg absolute inset-0"
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

            </div>
          </article>

          {/* Step 2: Membership selection with toggle */}
          <article className={cn(
            "relative group",
            "rounded-3xl transition-all duration-300",
            "flex flex-col border border-border shadow-lg hover:shadow-xl",
            "bg-secondary",
            activeTier === "plus" && "ring-1 ring-primary/20"
          )}>
            <div className="p-6 md:p-8 flex-1">
              <Tabs value={activeTier} onValueChange={setActiveTier} className="w-full">
                <div className="mb-4">
                  <Badge variant="outline" className="rounded-full border border-primary bg-primary/10 text-foreground px-4 py-1.5 text-xs md:text-sm font-medium whitespace-nowrap">
                    {t("flow.step2")}
                  </Badge>
                </div>

                {/* Monthly Program Promo Banner - Aligned with Step 1 */}
                {currentTier.isPromo && (
                  <div className="mb-4 bg-gradient-to-r from-red-500/90 to-orange-500/90 text-white rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-bold text-sm">{t("promo.limitedOffer")}</h4>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 min-w-[160px]">
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-white rounded-full h-2 transition-all duration-500"
                            style={{ width: "20%" }}
                          />
                        </div>
                        <div className="text-xs font-medium">
                          <span className="font-bold">2</span> {t("promo.spotsTaken")} • <span className="font-bold">8</span> {t("promo.remaining")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <TabsList className="bg-transparent border border-primary/30 rounded-full p-1 flex w-full h-auto sm:h-10 overflow-visible sm:overflow-visible justify-between sm:justify-center gap-1 sm:gap-2 flex-nowrap sm:w-auto">
                    {orderedTiers.map(tier => (
                      <TabsTrigger
                        key={tier.id}
                        value={tier.id}
                        className={cn(
                          "flex flex-1 basis-1/2 w-full min-w-0 justify-center rounded-full px-2 py-1 text-xs sm:flex-none sm:basis-auto sm:w-auto sm:min-w-[96px] sm:px-3 sm:py-1.5 sm:text-sm truncate border bg-card text-primary border-primary hover:bg-primary/5",
                          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-sm data-[state=active]:font-semibold"
                        )}
                      >
                        {tier.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {orderedTiers.map(tier => (
                  <TabsContent key={tier.id} value={tier.id} className="mt-0">
                    
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 min-h-[2.75rem] my-[3px]">
                        {tier.originalPrice && tier.isPromo && (
                          <div className="flex flex-col">
                            <span className="text-lg line-through text-muted-foreground">
                              {tier.currency ?? "NT$"}
                              {formatNumber(tier.originalPrice.monthly)}
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl font-bold text-green-600">
                                15,000元
                              </span>
                              <span className="text-sm text-muted-foreground">{t("pricing.perMonth")}</span>
                            </div>
                          </div>
                        )}
                        {!tier.isPromo && (
                          <>
                            <span className="text-4xl font-bold text-foreground">
                              {tier.currency ?? "NT$"}
                              {formatNumber(tier.price.monthly)}
                            </span>
                            <span className="text-sm text-muted-foreground">{t("pricing.perMonth")}</span>
                          </>
                        )}
                      </div>
                      {tier.originalPrice && tier.isPromo && (
                        <div className="mt-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            {t("promo.save")} {tier.currency ?? "NT$"}
                            {formatNumber(tier.originalPrice.monthly - tier.price.monthly)}
                          </Badge>
                        </div>
                      )}
                      {tier.description && <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>}
                    </div>

                    <ul className="space-y-4">
                      {tier.features.map(feature => (
                        <li key={feature.name} className="flex gap-3">
                          <div
                            className={cn(
                              "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border",
                              feature.included ? "border-primary text-foreground" : "border-muted text-muted-foreground"
                            )}
                            aria-hidden
                          >
                            {feature.included ? (
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 6l12 12M6 18L18 6" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className={cn("text-sm font-medium", !feature.included && "line-through text-muted-foreground")}>{feature.name}</div>
                            {feature.description && (
                              <div className={cn("text-sm text-muted-foreground", !feature.included && "line-through")}>
                                {feature.description}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <Dialog open={isStep2VideoOpen} onOpenChange={setIsStep2VideoOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            {t("cta.watchOverview")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[90vw] sm:w-[80vw] lg:w-[70vw] h-auto max-h-[80vh] sm:max-h-[90vh] p-4 bg-background">
                          <div className="relative w-full aspect-video">
                            {isStep2VideoOpen && (
                              <iframe 
                                src="https://player.vimeo.com/video/1115394967?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1" 
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                                referrerPolicy="strict-origin-when-cross-origin" 
                                title="訓練方案 / Program Overview"
                                className="rounded-lg absolute inset-0"
                              />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </article>
        </div>
      </div>
    </section>;
}