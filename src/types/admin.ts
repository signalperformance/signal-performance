export type MembershipPlan = 'basic' | 'pro';

export type ClassType = 'mobility' | 'strength' | 'cardio' | 'power';

export type SessionType = 'pro' | 'amateur';

export type PlayerType = 'amateur' | 'pro';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipPlan: MembershipPlan;
  playerType: PlayerType;
  profilePicture?: string;
  notes: string;
  monthlyRenewalDate: string; // "YYYY-MM-DD" format
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ScheduleEntry {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:00"
  duration: number; // duration in minutes
  classType: ClassType;
  sessionType: SessionType;
  maxParticipants: number;
  isActive: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeMembers: number;
  weeklyClasses: number;
  revenueThisMonth: number;
}

export interface RecentActivity {
  id: string;
  type: 'user_registered' | 'user_updated' | 'schedule_changed';
  description: string;
  timestamp: Date;
  userId?: string;
}