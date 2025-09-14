import { ClientUser, Booking } from '@/types/client';
import { mockUsers } from './mockAdminData';

// Convert admin users to client users format
export const mockClientUsers: ClientUser[] = mockUsers.map(user => ({
  id: user.id,
  email: user.email,
  password: (user as any).password || 'password123', // fallback for existing users
  firstName: user.firstName,
  lastName: user.lastName,
  playerType: user.playerType,
  isActive: user.isActive,
}));

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: mockClientUsers[0]?.id || 'user-1',
    scheduleEntryId: 'schedule-1',
    dayKey: 'monday',
    hour24: 13,
    sessionName: 'MOBILITY',
    sessionType: 'pro',
    bookingDate: new Date(2024, 11, 23), // December 23, 2024
    createdAt: new Date(),
  },
  {
    id: 'booking-2',
    userId: mockClientUsers[0]?.id || 'user-1',
    scheduleEntryId: 'schedule-2',
    dayKey: 'wednesday',
    hour24: 18,
    sessionName: 'STRENGTH',
    sessionType: 'amateur',
    bookingDate: new Date(2024, 11, 25), // December 25, 2024
    createdAt: new Date(),
  },
];

// Session configuration
export const SESSION_CONFIG = {
  maxParticipants: {
    pro: 8,
    amateur: 12,
  },
};