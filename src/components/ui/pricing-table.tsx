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
  return;
}
function renderCell(value: CellValue | undefined) {
  if (value === true) return <Check className="w-5 h-5 text-primary" aria-label="Included" />;
  if (value === false || value === undefined) return <span className="text-muted-foreground">—</span>;
  return <span>{value}</span>;
}