import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookingStore } from '@/stores/useBookingStore';
import { addWeeks, isWithinInterval, startOfDay } from 'date-fns';

export interface SessionLimitInfo {
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  isAtLimit: boolean;
}

export const useSessionLimits = () => {
  const { user } = useAuth();
  const { getUserBookings, loadBookings, bookings } = useBookingStore();
  const [sessionInfo, setSessionInfo] = useState<SessionLimitInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateSessionLimits = (): SessionLimitInfo | null => {
    if (!user) return null;

    // Get total sessions based on membership plan
    const totalSessions = user.membershipPlan === 'pro' ? 16 : 12;

    // Calculate current 4-week period - use account creation or current date as fallback
    const renewalDate = new Date(); // For now, use current date as base period
    const today = new Date();
    
    // Find which 4-week period we're currently in
    let periodStart = new Date(renewalDate);
    while (periodStart > today) {
      periodStart = addWeeks(periodStart, -4);
    }
    
    while (addWeeks(periodStart, 4) <= today) {
      periodStart = addWeeks(periodStart, 4);
    }
    
    const periodEnd = addWeeks(periodStart, 4);

    // Count bookings within current period
    const userBookings = getUserBookings(user.id);
    const usedSessions = userBookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return isWithinInterval(startOfDay(bookingDate), {
        start: startOfDay(periodStart),
        end: startOfDay(periodEnd)
      });
    }).length;

    const remainingSessions = Math.max(0, totalSessions - usedSessions);
    const isAtLimit = usedSessions >= totalSessions;

    return {
      totalSessions,
      usedSessions,
      remainingSessions,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      isAtLimit
    };
  };

  // Initial load
  useEffect(() => {
    const initializeData = async () => {
      if (!user) {
        setSessionInfo(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      await loadBookings();
      setLoading(false);
    };

    initializeData();
  }, [user, loadBookings]);

  // Recalculate when bookings change
  useEffect(() => {
    if (user && bookings.length >= 0) { // Check >= 0 to handle empty arrays
      const info = calculateSessionLimits();
      setSessionInfo(info);
    }
  }, [user, bookings]);

  const canBookSession = (): boolean => {
    return sessionInfo ? !sessionInfo.isAtLimit : false;
  };

  const getSessionLimitMessage = (): string => {
    if (!sessionInfo) return '';
    
    if (sessionInfo.isAtLimit) {
      return `You've reached your ${sessionInfo.totalSessions} session limit for this 4-week period.`;
    }
    
    if (sessionInfo.remainingSessions <= 2) {
      return `Only ${sessionInfo.remainingSessions} sessions remaining in this period.`;
    }
    
    return '';
  };

  return {
    sessionInfo,
    loading,
    canBookSession,
    getSessionLimitMessage,
    refreshSessionInfo: () => {
      const info = calculateSessionLimits();
      setSessionInfo(info);
    }
  };
};