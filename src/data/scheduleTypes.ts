
export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface ScheduleEntry {
  dayKey: DayKey;
  hour24: number; // 24-hour format (e.g., 13 for 1 PM)
  name: string; // Class name, e.g., "MOBILITY", "STRENGTH"
  sessionType: 'pro' | 'amateur'; // Type of session
}

export interface TimeSlotItem {
  id: string;
  hour24: number; // 24-hour format, e.g., 13 for 1 PM. Made non-optional.
  label: string;
}
