import { useMemo } from 'react';
import { format, addWeeks, differenceInDays, isPast, isToday } from 'date-fns';

interface PaymentDueDateInfo {
  nextDueDate: Date;
  daysUntilDue: number;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean; // within 7 days
  formattedDate: string;
  displayText: string;
}

export const usePaymentDueDate = (renewalDate?: Date): PaymentDueDateInfo | null => {
  return useMemo(() => {
    if (!renewalDate) return null;

    const today = new Date();
    let nextDueDate = new Date(renewalDate);

    // Find the next 4-week cycle due date
    while (isPast(nextDueDate) && !isToday(nextDueDate)) {
      nextDueDate = addWeeks(nextDueDate, 4);
    }

    const daysUntilDue = differenceInDays(nextDueDate, today);
    const isOverdue = daysUntilDue < 0;
    const isDueToday = isToday(nextDueDate);
    const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

    const formattedDate = format(nextDueDate, 'MMM dd');

    let displayText: string;
    if (isOverdue) {
      displayText = 'Payment overdue';
    } else if (isDueToday) {
      displayText = 'Payment due today';
    } else if (isDueSoon) {
      displayText = `Due in ${daysUntilDue} ${daysUntilDue === 1 ? 'day' : 'days'}`;
    } else {
      displayText = `Next: ${formattedDate}`;
    }

    return {
      nextDueDate,
      daysUntilDue,
      isOverdue,
      isDueToday,
      isDueSoon,
      formattedDate,
      displayText,
    };
  }, [renewalDate]);
};