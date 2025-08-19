import { UserProfile, ScheduleEntry, AdminStats, RecentActivity } from '@/types/admin';

export const mockUsers: UserProfile[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    membershipPlan: 'pro',
    playerType: 'pro',
    monthlyRenewalDate: '2024-03-15',
    notes: 'Regular attendee, prefers morning sessions',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    isActive: true,
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah.smith@email.com',
    phone: '+1 (555) 234-5678',
    membershipPlan: 'basic',
    playerType: 'amateur',
    monthlyRenewalDate: '2024-03-01',
    notes: 'New member, interested in strength training',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    isActive: true,
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1 (555) 345-6789',
    membershipPlan: 'pro',
    playerType: 'pro',
    monthlyRenewalDate: '2024-03-10',
    notes: 'Experienced athlete, focuses on mobility work',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-02-15'),
    isActive: true,
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'emily.brown@email.com',
    phone: '+1 (555) 456-7890',
    membershipPlan: 'basic',
    playerType: 'amateur',
    monthlyRenewalDate: '2024-02-28',
    notes: 'Part-time member, evening sessions only',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-12'),
    isActive: false,
  },
];

export const mockSchedule: ScheduleEntry[] = [
  // Monday/Wednesday/Friday Schedule
  { id: '1', dayOfWeek: 'monday', startTime: '12:00', duration: 60, classType: 'mobility', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '2', dayOfWeek: 'monday', startTime: '13:30', duration: 60, classType: 'strength', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '3', dayOfWeek: 'monday', startTime: '15:00', duration: 60, classType: 'mobility', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '5', dayOfWeek: 'monday', startTime: '17:00', duration: 60, classType: 'mobility', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '6', dayOfWeek: 'monday', startTime: '18:30', duration: 60, classType: 'strength', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '7', dayOfWeek: 'monday', startTime: '20:00', duration: 60, classType: 'strength', sessionType: 'amateur', maxParticipants: 3, isActive: true },

  { id: '8', dayOfWeek: 'wednesday', startTime: '12:00', duration: 60, classType: 'mobility', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '9', dayOfWeek: 'wednesday', startTime: '13:30', duration: 60, classType: 'strength', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '10', dayOfWeek: 'wednesday', startTime: '15:00', duration: 60, classType: 'mobility', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '12', dayOfWeek: 'wednesday', startTime: '17:00', duration: 60, classType: 'mobility', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '13', dayOfWeek: 'wednesday', startTime: '18:30', duration: 60, classType: 'strength', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '14', dayOfWeek: 'wednesday', startTime: '20:00', duration: 60, classType: 'strength', sessionType: 'amateur', maxParticipants: 3, isActive: true },

  { id: '15', dayOfWeek: 'friday', startTime: '12:00', duration: 60, classType: 'mobility', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '16', dayOfWeek: 'friday', startTime: '13:30', duration: 60, classType: 'strength', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '17', dayOfWeek: 'friday', startTime: '15:00', duration: 60, classType: 'mobility', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '19', dayOfWeek: 'friday', startTime: '17:00', duration: 60, classType: 'mobility', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '20', dayOfWeek: 'friday', startTime: '18:30', duration: 60, classType: 'strength', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '21', dayOfWeek: 'friday', startTime: '20:00', duration: 60, classType: 'strength', sessionType: 'amateur', maxParticipants: 3, isActive: true },

  // Tuesday/Thursday Schedule
  { id: '22', dayOfWeek: 'tuesday', startTime: '12:00', duration: 60, classType: 'power', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '23', dayOfWeek: 'tuesday', startTime: '13:30', duration: 60, classType: 'cardio', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '24', dayOfWeek: 'tuesday', startTime: '15:00', duration: 60, classType: 'power', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '26', dayOfWeek: 'tuesday', startTime: '17:00', duration: 60, classType: 'power', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '27', dayOfWeek: 'tuesday', startTime: '18:30', duration: 60, classType: 'cardio', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '28', dayOfWeek: 'tuesday', startTime: '20:00', duration: 60, classType: 'power', sessionType: 'amateur', maxParticipants: 3, isActive: true },

  { id: '29', dayOfWeek: 'thursday', startTime: '12:00', duration: 60, classType: 'power', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '30', dayOfWeek: 'thursday', startTime: '13:30', duration: 60, classType: 'cardio', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '31', dayOfWeek: 'thursday', startTime: '15:00', duration: 60, classType: 'power', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '33', dayOfWeek: 'thursday', startTime: '17:00', duration: 60, classType: 'power', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '34', dayOfWeek: 'thursday', startTime: '18:30', duration: 60, classType: 'cardio', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '35', dayOfWeek: 'thursday', startTime: '20:00', duration: 60, classType: 'power', sessionType: 'amateur', maxParticipants: 3, isActive: true },

  // Weekend Schedule
  { id: '36', dayOfWeek: 'saturday', startTime: '09:00', duration: 90, classType: 'mobility', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '37', dayOfWeek: 'saturday', startTime: '10:30', duration: 90, classType: 'strength', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '38', dayOfWeek: 'saturday', startTime: '12:00', duration: 90, classType: 'cardio', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '39', dayOfWeek: 'saturday', startTime: '13:30', duration: 90, classType: 'power', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '40', dayOfWeek: 'saturday', startTime: '15:00', duration: 90, classType: 'mobility', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '41', dayOfWeek: 'saturday', startTime: '16:30', duration: 90, classType: 'power', sessionType: 'pro', maxParticipants: 3, isActive: true },

  { id: '42', dayOfWeek: 'sunday', startTime: '09:00', duration: 90, classType: 'mobility', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '43', dayOfWeek: 'sunday', startTime: '10:30', duration: 90, classType: 'strength', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '44', dayOfWeek: 'sunday', startTime: '12:00', duration: 90, classType: 'cardio', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '45', dayOfWeek: 'sunday', startTime: '13:30', duration: 90, classType: 'power', sessionType: 'amateur', maxParticipants: 3, isActive: true },
  { id: '46', dayOfWeek: 'sunday', startTime: '15:00', duration: 90, classType: 'mobility', sessionType: 'pro', maxParticipants: 3, isActive: true },
  { id: '47', dayOfWeek: 'sunday', startTime: '16:30', duration: 90, classType: 'power', sessionType: 'pro', maxParticipants: 3, isActive: true },
];

export const mockStats: AdminStats = {
  totalUsers: 24,
  activeMembers: 18,
  weeklyClasses: 12,
  revenueThisMonth: 4800,
};

export const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'user_registered',
    description: 'New user Sarah Smith registered',
    timestamp: new Date('2024-02-15T10:30:00'),
    userId: '2',
  },
  {
    id: '2',
    type: 'schedule_changed',
    description: 'Friday Power session time updated',
    timestamp: new Date('2024-02-14T14:15:00'),
  },
  {
    id: '3',
    type: 'user_updated',
    description: 'Mike Johnson upgraded to Pro membership',
    timestamp: new Date('2024-02-13T16:45:00'),
    userId: '3',
  },
  {
    id: '4',
    type: 'user_registered',
    description: 'New user Emily Brown registered',
    timestamp: new Date('2024-02-10T09:20:00'),
    userId: '4',
  },
];