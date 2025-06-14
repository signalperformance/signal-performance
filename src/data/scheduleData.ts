
import { ScheduleEntry } from './scheduleTypes';

export const scheduleData: ScheduleEntry[] = [
  // Monday
  // Pro sessions (1 PM - 3 PM)
  { dayKey: 'monday', hour24: 13, name: 'MOBILITY', sessionType: 'pro' },
  { dayKey: 'monday', hour24: 14, name: 'STRENGTH', sessionType: 'pro' },
  { dayKey: 'monday', hour24: 15, name: 'STRENGTH', sessionType: 'pro' },
  // Amateur sessions (5 PM - 7 PM)
  { dayKey: 'monday', hour24: 17, name: 'MOBILITY', sessionType: 'amateur' },
  { dayKey: 'monday', hour24: 18, name: 'STRENGTH', sessionType: 'amateur' },
  { dayKey: 'monday', hour24: 19, name: 'STRENGTH', sessionType: 'amateur' },

  // Tuesday
  // Pro sessions (1 PM - 3 PM)
  { dayKey: 'tuesday', hour24: 13, name: 'POWER', sessionType: 'pro' },
  { dayKey: 'tuesday', hour24: 14, name: 'CARDIO', sessionType: 'pro' },
  { dayKey: 'tuesday', hour24: 15, name: 'POWER', sessionType: 'pro' },
  // Amateur sessions (5 PM - 7 PM)
  { dayKey: 'tuesday', hour24: 17, name: 'POWER', sessionType: 'amateur' },
  { dayKey: 'tuesday', hour24: 18, name: 'CARDIO', sessionType: 'amateur' },
  { dayKey: 'tuesday', hour24: 19, name: 'POWER', sessionType: 'amateur' },

  // Wednesday
  // Pro sessions (1 PM - 3 PM)
  { dayKey: 'wednesday', hour24: 13, name: 'MOBILITY', sessionType: 'pro' },
  { dayKey: 'wednesday', hour24: 14, name: 'STRENGTH', sessionType: 'pro' },
  { dayKey: 'wednesday', hour24: 15, name: 'STRENGTH', sessionType: 'pro' },
  // Amateur sessions (5 PM - 7 PM)
  { dayKey: 'wednesday', hour24: 17, name: 'MOBILITY', sessionType: 'amateur' },
  { dayKey: 'wednesday', hour24: 18, name: 'STRENGTH', sessionType: 'amateur' },
  { dayKey: 'wednesday', hour24: 19, name: 'STRENGTH', sessionType: 'amateur' },

  // Thursday
  // Pro sessions (1 PM - 3 PM)
  { dayKey: 'thursday', hour24: 13, name: 'POWER', sessionType: 'pro' },
  { dayKey: 'thursday', hour24: 14, name: 'CARDIO', sessionType: 'pro' },
  { dayKey: 'thursday', hour24: 15, name: 'POWER', sessionType: 'pro' },
  // Amateur sessions (5 PM - 7 PM)
  { dayKey: 'thursday', hour24: 17, name: 'POWER', sessionType: 'amateur' },
  { dayKey: 'thursday', hour24: 18, name: 'CARDIO', sessionType: 'amateur' },
  { dayKey: 'thursday', hour24: 19, name: 'POWER', sessionType: 'amateur' },

  // Friday
  // Pro sessions (1 PM - 3 PM)
  { dayKey: 'friday', hour24: 13, name: 'MOBILITY', sessionType: 'pro' },
  { dayKey: 'friday', hour24: 14, name: 'STRENGTH', sessionType: 'pro' },
  { dayKey: 'friday', hour24: 15, name: 'STRENGTH', sessionType: 'pro' },
  // Amateur sessions (5 PM - 7 PM)
  { dayKey: 'friday', hour24: 17, name: 'MOBILITY', sessionType: 'amateur' },
  { dayKey: 'friday', hour24: 18, name: 'STRENGTH', sessionType: 'amateur' },
  { dayKey: 'friday', hour24: 19, name: 'STRENGTH', sessionType: 'amateur' },
  
  // Saturday - Amateur Only (9 AM - 12 PM)
  { dayKey: 'saturday', hour24: 9, name: 'MOBILITY', sessionType: 'amateur' },
  { dayKey: 'saturday', hour24: 10, name: 'STRENGTH', sessionType: 'amateur' },
  { dayKey: 'saturday', hour24: 11, name: 'CARDIO', sessionType: 'amateur' },
  { dayKey: 'saturday', hour24: 12, name: 'POWER', sessionType: 'amateur' },
  
  // Sunday - Amateur Only (9 AM - 12 PM)
  { dayKey: 'sunday', hour24: 9, name: 'MOBILITY', sessionType: 'amateur' },
  { dayKey: 'sunday', hour24: 10, name: 'STRENGTH', sessionType: 'amateur' },
  { dayKey: 'sunday', hour24: 11, name: 'CARDIO', sessionType: 'amateur' },
  { dayKey: 'sunday', hour24: 12, name: 'POWER', sessionType: 'amateur' },
];
