export interface ClientUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  playerType: 'amateur' | 'pro';
  isActive: boolean;
  monthlyRenewalDate?: Date;
}

export interface Booking {
  id: string;
  userId: string;
  scheduleEntryId: string;
  dayKey: string;
  hour24: number;
  minute: number;
  sessionName: string;
  sessionType: 'pro' | 'amateur';
  bookingDate: Date;
  createdAt: Date;
}

export interface ScheduleWithAvailability {
  id: string;
  dayKey: string;
  hour24: number;
  minute: number;
  name: string;
  sessionType: 'pro' | 'amateur';
  maxParticipants: number;
  currentBookings: number;
  date: Date;
  scheduleEntryId?: string;
}

export interface AuthState {
  user: ClientUser | null;
  isAuthenticated: boolean;
  isLoadingProfile?: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}