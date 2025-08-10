import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Feature = {
  name: string;
  description?: string;
  included: boolean;
};

export type PricingTier = {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description?: string;
  features: Feature[];
  highlight?: boolean;
  badge?: string;
  icon: React.ReactNode;
  currency?: string; // e.g., "NT$"
};

interface PricingSectionProps {
  tiers: PricingTier[];
  className?: string;
  title?: string;
  subtitle?: string;
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

function PricingSection({ tiers, className, title = "Membership Options", subtitle }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section
      className={cn(
        "section-padding bg-background text-foreground",
        "overflow-hidden",
        className,
      )}
    >
      <div className="container mx-auto container-padding">
        <div className="flex flex-col items-center gap-4 mb-10 md:mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-lora">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
          )}

          <div className="inline-flex items-center p-1.5 bg-card rounded-full border border-border shadow-sm">
            {["Monthly", "Yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setIsYearly(period === "Yearly")}
                className={cn(
                  "px-6 py-2 text-sm font-medium rounded-full transition-all duration-300",
                  (period === "Yearly") === isYearly
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={(period === "Yearly") === isYearly}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={cn(
                "relative group backdrop-blur-sm",
                "rounded-3xl transition-all duration-300",
                "flex flex-col bg-card border border-border shadow-lg hover:shadow-xl",
                tier.highlight && "ring-1 ring-primary/40 bg-gradient-to-b from-primary/5 to-transparent",
              )}
            >
              {tier.badge && tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1.5 text-xs md:text-sm font-medium bg-primary text-primary-foreground border-none shadow">
                    {tier.badge}
                  </Badge>
                </div>
              )}

              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-3 rounded-xl bg-muted text-foreground/80")}>{tier.icon}</div>
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      {tier.currency ?? "NT$"}
                      {formatNumber(isYearly ? tier.price.yearly : tier.price.monthly)}
                    </span>
                    <span className="text-sm text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                  </div>
                  {tier.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
                  )}
                </div>

                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature.name} className="flex gap-3">
                      <div
                        className={cn(
                          "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border",
                          feature.included
                            ? "border-primary text-primary"
                            : "border-muted text-muted-foreground",
                        )}
                        aria-hidden
                      >
                        {/* simple check marker */}
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{feature.name}</div>
                        {feature.description && (
                          <div className="text-sm text-muted-foreground">{feature.description}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <Button
                  variant={tier.highlight ? "default" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  {tier.highlight ? "Buy now" : "Get started"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export { PricingSection };
