
import { ScheduleEntry } from './scheduleTypes';

export const scheduleData: ScheduleEntry[] = [
  // Monday
  { dayKey: 'monday', hour24: 12, name: 'STRENGTH', sessionType: 'pro' },
  { dayKey: 'monday', hour24: 13, name: 'POWER', sessionType: 'pro' },
  { dayKey: 'monday', hour24: 14, name: 'CARDIO', sessionType: 'pro' },
  // Amateur sessions for Monday
  { dayKey: 'monday', hour24: 17, name: 'MOBILITY', sessionType: 'amateur' },
  { dayKey: 'monday', hour24: 18, name: 'STRENGTH', sessionType: 'amateur' },
  { dayKey: 'monday', hour24: 19, name: 'CARDIO', sessionType: 'amateur' },

  // Tuesday
  { dayKey: 'tuesday', hour24: 12, name: 'CARDIO', sessionType: 'pro' },
  { dayKey: 'tuesday', hour24: 13, name: 'MOBILITY', sessionType: 'pro' },
  { dayKey: 'tuesday', hour24: 14, name: 'STRENGTH', sessionType: 'pro' },
  // Amateur sessions for Tuesday
  { dayKey: 'tuesday', hour24: 17, name: 'POWER', sessionType: 'amateur' },
  { dayKey: 'tuesday', hour24: 18, name: 'MOBILITY', sessionType: 'amateur' },
  { dayKey: 'tuesday', hour24: 19, name: 'STRENGTH', sessionType: 'amateur' },

  // Wednesday
  { dayKey: 'wednesday', hour24: 12, name: 'POWER', sessionType: 'pro' },
  { dayKey: 'wednesday', hour24: 13, name: 'STRENGTH', sessionType: 'pro' },
  { dayKey: 'wednesday', hour24: 14, name: 'MOBILITY', sessionType: 'pro' },
  // Amateur sessions for Wednesday
  { dayKey: 'wednesday', hour24: 17, name: 'CARDIO', sessionType: 'amateur' },
  { dayKey: 'wednesday', hour24: 18, name: 'POWER', sessionType: 'amateur' },
  { dayKey: 'wednesday', hour24: 19, name: 'MOBILITY', sessionType: 'amateur' },

  // Thursday
  { dayKey: 'thursday', hour24: 12, name: 'STRENGTH', sessionType: 'pro' },
  { dayKey: 'thursday', hour24: 13, name: 'CARDIO', sessionType: 'pro' },
  { dayKey: 'thursday', hour24: 14, name: 'POWER', sessionType: 'pro' },
  // Amateur sessions for Thursday
  { dayKey: 'thursday', hour24: 17, name: 'STRENGTH', sessionType: 'amateur' },
  { dayKey: 'thursday', hour24: 18, name: 'CARDIO', sessionType: 'amateur' },
  { dayKey: 'thursday', hour24: 19, name: 'POWER', sessionType: 'amateur' },

  // Friday
  { dayKey: 'friday', hour24: 12, name: 'MOBILITY', sessionType: 'pro' },
  { dayKey: 'friday', hour24: 13, name: 'POWER', sessionType: 'pro' },
  { dayKey: 'friday', hour24: 14, name: 'STRENGTH', sessionType: 'pro' },
  // Amateur sessions for Friday
  { dayKey: 'friday', hour24: 17, name: 'MOBILITY', sessionType: 'amateur' },
  { dayKey: 'friday', hour24: 18, name: 'STRENGTH', sessionType: 'amateur' },
  { dayKey: 'friday', hour24: 19, name: 'CARDIO', sessionType: 'amateur' },
  
  // Saturday - Example: Amateur Only
  { dayKey: 'saturday', hour24: 12, name: 'STRENGTH', sessionType: 'amateur' },
  { dayKey: 'saturday', hour24: 13, name: 'CARDIO', sessionType: 'amateur' },
  
  // Sunday - Example: Amateur Only
  { dayKey: 'sunday', hour24: 12, name: 'MOBILITY', sessionType: 'amateur' },
  { dayKey: 'sunday', hour24: 13, name: 'POWER', sessionType: 'amateur' },
];
