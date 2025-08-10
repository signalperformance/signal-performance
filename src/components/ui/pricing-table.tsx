import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";

export type PlanLevel = string;

type CellValue = boolean | string;

export interface ComparisonFeature {
  name: string;
  values: Record<PlanLevel, CellValue>;
}

export interface ComparisonPlan {
  name: string;
  level: PlanLevel;
  price: { monthly: number; yearly: number };
  popular?: boolean;
  currency?: string; // e.g., NT$
}

export interface PricingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  features: ComparisonFeature[];
  plans: ComparisonPlan[];
  onPlanSelect?: (plan: PlanLevel) => void;
  defaultPlan?: PlanLevel;
  defaultInterval?: "monthly" | "yearly";
  containerClassName?: string;
  buttonClassName?: string;
  title?: string;
}

const formatCurrency = (value: number, currency = "NT$") =>
  `${currency}${new Intl.NumberFormat("en-US").format(value)}`;

export function PricingTable({
  features,
  plans,
  onPlanSelect,
  defaultPlan,
  defaultInterval = "monthly",
  className,
  containerClassName,
  buttonClassName,
  title = "Compare Memberships",
  ...props
}: PricingTableProps) {
  const initialPlan = defaultPlan ?? plans[0]?.level ?? "";
  const [isYearly, setIsYearly] = React.useState(defaultInterval === "yearly");
  const [selectedPlan, setSelectedPlan] = React.useState<PlanLevel>(initialPlan);

  const handlePlanSelect = (plan: PlanLevel) => {
    setSelectedPlan(plan);
    onPlanSelect?.(plan);
  };

  return (
    <section className={cn("section-padding bg-background text-foreground", className)}>
      <div className={cn("container mx-auto container-padding", containerClassName)} {...props}>
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-lora">{title}</h2>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm bg-card border border-border rounded-md p-1">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-3 py-1 rounded-md transition-colors",
                !isYearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-3 py-1 rounded-md transition-colors",
                isYearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {plans.map((plan) => (
            <button
              key={plan.level}
              type="button"
              onClick={() => handlePlanSelect(plan.level)}
              className={cn(
                "flex-1 p-4 rounded-xl text-left transition-all bg-card",
                "border border-border shadow-sm hover:shadow-md",
                selectedPlan === plan.level && "ring-2 ring-primary"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{plan.name}</span>
                {plan.popular && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">
                  {formatCurrency(isYearly ? plan.price.yearly : plan.price.monthly, plan.currency ?? "NT$")}
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  /{isYearly ? "year" : "month"}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <div>
            <div className="w-full divide-y divide-border">
              <div className="flex items-center p-4 bg-muted/40">
                <div className="flex-1 text-sm font-medium">Features</div>
                <div className="flex items-center gap-4 sm:gap-8 text-sm">
                  {plans.map((plan) => (
                    <div key={plan.level} className="w-24 sm:w-32 text-center font-medium">
                      {plan.name}
                    </div>
                  ))}
                </div>
              </div>

              {features.map((feature) => (
                <div key={feature.name} className={cn("flex items-center p-4 transition-colors")}> 
                  <div className="flex-1 text-sm">{feature.name}</div>
                  <div className="flex items-center gap-4 sm:gap-8 text-sm">
                    {plans.map((plan) => (
                      <div key={plan.level} className={cn("w-24 sm:w-32 flex justify-center text-center")}> 
                        {renderCell(feature.values[plan.level])}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button className={cn("w-full sm:w-auto px-8", buttonClassName)}>
            Get started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function renderCell(value: CellValue | undefined) {
  if (value === true) return <Check className="w-5 h-5 text-primary" aria-label="Included" />;
  if (value === false || value === undefined)
    return <span className="text-muted-foreground">—</span>;
  return <span>{value}</span>;
}
