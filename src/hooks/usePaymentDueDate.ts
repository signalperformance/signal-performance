import { useMemo } from 'react';
import { format, addMonths, differenceInDays, isPast, isToday } from 'date-fns';

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

    // Find the next monthly due date (same day each month)
    while (isPast(nextDueDate) && !isToday(nextDueDate)) {
      nextDueDate = addMonths(nextDueDate, 1);
    }

    const daysUntilDue = differenceInDays(nextDueDate, today);
    const isOverdue = daysUntilDue < 0;
    const isDueToday = isToday(nextDueDate);
    const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

    // Only show badge if payment is due within 7 days
    if (!isDueSoon && !isDueToday && !isOverdue) {
      return null;
    }

    const formattedDate = format(nextDueDate, 'MMM dd');

    let displayText: string;
    if (isOverdue) {
      displayText = 'Payment overdue';
    } else if (isDueToday) {
      displayText = 'Payment due today';
    } else {
      displayText = `Due ${formattedDate}`;
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