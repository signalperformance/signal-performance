
import { Badge } from "@/components/ui/badge";

type Status = 'paid' | 'due-soon' | 'overdue' | 'unpaid';

export function PaymentStatusBadge({ status }: { status: Status }) {
  switch (status) {
    case 'paid':
      return <Badge variant="default">Paid</Badge>;
    case 'due-soon':
      return <Badge variant="secondary">Due Soon</Badge>;
    case 'overdue':
      return <Badge variant="destructive">Overdue</Badge>;
    case 'unpaid':
    default:
      return <Badge variant="outline">Unpaid</Badge>;
  }
}
