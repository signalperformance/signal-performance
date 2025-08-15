import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
type Feature = {
  name: string;
  description?: string;
  included: boolean;
};
export type PricingTier = {
  id: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  originalPrice?: {
    monthly: number;
    yearly: number;
  };
  description?: string;
  features: Feature[];
  highlight?: boolean;
  badge?: string;
  icon: React.ReactNode;
  currency?: string; // e.g., "NT$"
  isPromo?: boolean;
  promoDetails?: {
    spotsRemaining: number;
    totalSpots: number;
  };
};
interface PricingSectionProps {
  tiers: PricingTier[];
  className?: string;
  title?: string;
  subtitle?: string;
}
const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
function PricingSection({
  tiers,
  className,
  title,
  subtitle
}: PricingSectionProps) {
  const {
    t
  } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);
  const sectionTitle = title ?? t("pricing.title");
  return <section className={cn("section-padding text-foreground", "overflow-hidden", className)}>
      <div className="container mx-auto container-padding">
        <div className="flex flex-col items-center gap-4 mb-10 md:mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-lora">{sectionTitle}</h2>
          {subtitle && <p className="text-muted-foreground max-w-2xl">{subtitle}</p>}
          
          {/* Promotional Banner */}
          {tiers.some(tier => tier.isPromo) && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl px-6 py-3 max-w-md">
              <p className="text-red-800 font-semibold text-sm md:text-base">
                {t("promo.earlyBird")} - {t("promo.firstMembers")}
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="bg-red-200 rounded-full h-2 flex-1 max-w-32">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(4/10) * 100}%` }}
                  />
                </div>
                <span className="text-red-700 text-xs font-medium">
                  6 {t("promo.of")} 10 {t("promo.spotsRemaining")}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {tiers.map(tier => <article key={tier.id} className={cn("relative group", "rounded-3xl transition-all duration-300", "flex flex-col bg-card border border-border shadow-lg hover:shadow-xl", tier.highlight && "ring-1 ring-primary/40 bg-gradient-to-b from-primary/5 to-transparent")}>
              {tier.badge && tier.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1.5 text-xs md:text-sm font-medium bg-primary text-primary-foreground border-none shadow">
                    {tier.badge}
                  </Badge>
                </div>}

              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 min-h-[2.75rem]">
                    {tier.originalPrice && tier.isPromo && (
                      <div className="flex flex-col">
                        <span className="text-lg line-through text-muted-foreground">
                          {tier.currency ?? "NT$"}
                          {formatNumber(isYearly ? tier.originalPrice.yearly : tier.originalPrice.monthly)}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-green-600">
                            {tier.currency ?? "NT$"}
                            {formatNumber(isYearly ? tier.price.yearly : tier.price.monthly)}
                          </span>
                          <span className="text-sm text-muted-foreground">{isYearly ? t("pricing.perYear") : t("pricing.perMonth")}</span>
                        </div>
                      </div>
                    )}
                    {!tier.isPromo && (
                      <>
                        <span className="text-4xl font-bold">
                          {tier.currency ?? "NT$"}
                          {formatNumber(isYearly ? tier.price.yearly : tier.price.monthly)}
                        </span>
                        <span className="text-sm text-muted-foreground">{isYearly ? t("pricing.perYear") : t("pricing.perMonth")}</span>
                      </>
                    )}
                  </div>
                  {tier.originalPrice && tier.isPromo && (
                    <div className="mt-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {t("promo.save")} {tier.currency ?? "NT$"}
                        {formatNumber((isYearly ? tier.originalPrice.yearly : tier.originalPrice.monthly) - (isYearly ? tier.price.yearly : tier.price.monthly))}
                      </Badge>
                    </div>
                  )}
                  {tier.description && <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>}
                </div>

                <ul className="space-y-4">
                  {tier.features.map(feature => <li key={feature.name} className="flex gap-3">
                      <div className={cn("mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border", feature.included ? "border-primary text-primary" : "border-muted text-muted-foreground")} aria-hidden>
                        {/* simple check marker */}
                        {feature.included ? <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg> : <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 6l12 12M6 18L18 6" />
                          </svg>}
                      </div>
                      <div>
                        <div className={cn("text-sm font-medium", !feature.included && "line-through text-muted-foreground")}>{feature.name}</div>
                        {feature.description && <div className={cn("text-sm text-muted-foreground", !feature.included && "line-through")}>{feature.description}</div>}
                      </div>
                    </li>)}
                </ul>
              </div>

            </article>)}
        </div>
      </div>
    </section>;
}
export { PricingSection };