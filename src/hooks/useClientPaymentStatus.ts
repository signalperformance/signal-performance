import { useState, useEffect } from 'react';
import { format, addMonths, differenceInDays, isPast, isToday } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface PaymentDueDateInfo {
  nextDueDate: Date;
  daysUntilDue: number;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean; // within 7 days
  formattedDate: string;
  displayText: string;
}

export const useClientPaymentStatus = (userId?: string, renewalDate?: Date): PaymentDueDateInfo | null => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentDueDateInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!userId || !renewalDate) {
        setPaymentStatus(null);
        setLoading(false);
        return;
      }

      const today = new Date();
      let nextDueDate = new Date(renewalDate);

      // Find the next monthly due date (same day each month)
      while (isPast(nextDueDate) && !isToday(nextDueDate)) {
        nextDueDate = addMonths(nextDueDate, 1);
      }

      // Get the current month to check payment records
      const currentMonth = new Date(nextDueDate.getFullYear(), nextDueDate.getMonth(), 1);

      try {
        // Query payment records for the current month
        const { data: paymentRecord, error } = await supabase
          .from('user_payment_records')
          .select('is_paid')
          .eq('user_profile_id', userId)
          .eq('period_month', format(currentMonth, 'yyyy-MM-dd'))
          .maybeSingle();

        if (error) {
          console.error('Error fetching payment status:', error);
          setPaymentStatus(null);
          setLoading(false);
          return;
        }

        // If payment is marked as paid, don't show any badge
        if (paymentRecord?.is_paid) {
          setPaymentStatus(null);
          setLoading(false);
          return;
        }

        // Payment is unpaid or no record exists, check if we should show the badge
        const daysUntilDue = differenceInDays(nextDueDate, today);
        const isOverdue = daysUntilDue < 0;
        const isDueToday = isToday(nextDueDate);
        const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

        // Only show badge if payment is due within 7 days, due today, or overdue
        if (!isDueSoon && !isDueToday && !isOverdue) {
          setPaymentStatus(null);
          setLoading(false);
          return;
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

        setPaymentStatus({
          nextDueDate,
          daysUntilDue,
          isOverdue,
          isDueToday,
          isDueSoon,
          formattedDate,
          displayText,
        });
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus(null);
      }

      setLoading(false);
    };

    checkPaymentStatus();
  }, [userId, renewalDate]);

  return loading ? null : paymentStatus;
};