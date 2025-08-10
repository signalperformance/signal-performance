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
  price: {
    monthly: number;
    yearly: number;
  };
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
const formatCurrency = (value: number, currency = "NT$") => `${currency}${new Intl.NumberFormat("en-US").format(value)}`;
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
  return <section className={cn("section-padding bg-background text-foreground", className)}>
      <div className={cn("container mx-auto container-padding", containerClassName)} {...props}>
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-lora">{title}</h2>
          
        </div>


        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm md:shadow-md">
          <div>
            <div className="w-full divide-y divide-border">
              <div className="flex items-center p-3 md:p-4 bg-muted/40">
                <div className="flex-1 text-sm font-medium">Features</div>
                <div className="flex items-center gap-3 md:gap-6 text-sm">
                  {plans.map(plan => <div key={plan.level} className="relative w-20 md:w-24 lg:w-28 text-center font-semibold">
                      {plan.popular && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[10px] shadow">
                          Most Popular
                        </span>
                      )}
                      {plan.name}
                    </div>)}
                </div>
              </div>

              {features.map(feature => <div key={feature.name} className={cn("flex items-center p-3 md:p-4 transition-colors")}> 
                  <div className="flex-1 text-sm">{feature.name}</div>
                  <div className="flex items-center gap-3 md:gap-6 text-sm">
                    {plans.map(plan => <div key={plan.level} className={cn("w-20 md:w-24 lg:w-28 flex justify-center text-center", plan.popular ? "font-semibold text-foreground" : "text-muted-foreground")}> 
                        {renderCell(feature.values[plan.level])}
                      </div>)}
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">Physical training sessions are 1-on-3 semi-private.</p>
        </div>
      </div>
    </section>;
}
function renderCell(value: CellValue | undefined) {
  if (value === true) return <Check className="w-5 h-5 text-primary" aria-label="Included" />;
  if (value === false || value === undefined) return <span className="text-muted-foreground">—</span>;
  return <span>{value}</span>;
}