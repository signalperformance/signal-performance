import React from 'react'; // Moved React import to the top for convention
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ScheduleEntry {
  id: string;
  dayKey: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  hour24: number; // 8 to 20 (though 8 will no longer be displayed)
  name: string; // Class name, e.g., "Mobility"
}

// TODO: Move to a separate data file or fetch if it becomes complex
// TODO: Add actual translations for class names
const scheduleData: ScheduleEntry[] = [
  // Monday
  { id: 'mon-17-mob', dayKey: 'monday', hour24: 17, name: 'Mobility' },
  { id: 'mon-18-str', dayKey: 'monday', hour24: 18, name: 'Strength' },
  { id: 'mon-19-str', dayKey: 'monday', hour24: 19, name: 'Strength' },
  // Tuesday
  { id: 'tue-17-pow', dayKey: 'tuesday', hour24: 17, name: 'Power' },
  { id: 'tue-18-car', dayKey: 'tuesday', hour24: 18, name: 'Cardio' },
  { id: 'tue-19-pow', dayKey: 'tuesday', hour24: 19, name: 'Power' },
  // Wednesday
  { id: 'wed-17-mob', dayKey: 'wednesday', hour24: 17, name: 'Mobility' },
  { id: 'wed-18-str', dayKey: 'wednesday', hour24: 18, name: 'Strength' },
  { id: 'wed-19-str', dayKey: 'wednesday', hour24: 19, name: 'Strength' },
  // Thursday
  { id: 'thu-17-pow', dayKey: 'thursday', hour24: 17, name: 'Power' },
  { id: 'thu-18-car', dayKey: 'thursday', hour24: 18, name: 'Cardio' },
  { id: 'thu-19-pow', dayKey: 'thursday', hour24: 19, name: 'Power' },
  // Friday
  { id: 'fri-17-mob', dayKey: 'friday', hour24: 17, name: 'Mobility' },
  { id: 'fri-18-str', dayKey: 'friday', hour24: 18, name: 'Strength' },
  { id: 'fri-19-str', dayKey: 'friday', hour24: 19, name: 'Strength' },
  // Saturday
  { id: 'sat-9-mob', dayKey: 'saturday', hour24: 9, name: 'Mobility' },
  { id: 'sat-10-str', dayKey: 'saturday', hour24: 10, name: 'Strength' },
  { id: 'sat-11-car', dayKey: 'saturday', hour24: 11, name: 'Cardio' },
  { id: 'sat-12-pow', dayKey: 'saturday', hour24: 12, name: 'Power' },
  // Sunday
  { id: 'sun-9-mob', dayKey: 'sunday', hour24: 9, name: 'Mobility' },
  { id: 'sun-10-str', dayKey: 'sunday', hour24: 10, name: 'Strength' },
  { id: 'sun-11-car', dayKey: 'sunday', hour24: 11, name: 'Cardio' },
  { id: 'sun-12-pow', dayKey: 'sunday', hour24: 12, name: 'Power' },
];

interface TimeSlotItem {
  id: string;
  type: 'time' | 'break';
  hour24?: number; // Only for type 'time'
  label: string;
}

const WeeklySchedule = () => {
  const { t } = useLanguage();

  const daysOfWeek = [
    { key: 'monday' as ScheduleEntry['dayKey'], label: t('schedule.days.monday') },
    { key: 'tuesday' as ScheduleEntry['dayKey'], label: t('schedule.days.tuesday') },
    { key: 'wednesday' as ScheduleEntry['dayKey'], label: t('schedule.days.wednesday') },
    { key: 'thursday' as ScheduleEntry['dayKey'], label: t('schedule.days.thursday') },
    { key: 'friday' as ScheduleEntry['dayKey'], label: t('schedule.days.friday') },
    { key: 'saturday' as ScheduleEntry['dayKey'], label: t('schedule.days.saturday') },
    { key: 'sunday' as ScheduleEntry['dayKey'], label: t('schedule.days.sunday') },
  ];

  const timeSlots: TimeSlotItem[] = [
    { id: 'ts-9', type: 'time', hour24: 9, label: `9 ${t('schedule.timePeriods.am')}` },
    { id: 'ts-10', type: 'time', hour24: 10, label: `10 ${t('schedule.timePeriods.am')}` },
    { id: 'ts-11', type: 'time', hour24: 11, label: `11 ${t('schedule.timePeriods.am')}` },
    { id: 'ts-12', type: 'time', hour24: 12, label: `12 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-break', type: 'break', label: '...' }, // Visual cue for time jump
    { id: 'ts-16', type: 'time', hour24: 16, label: `4 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-17', type: 'time', hour24: 17, label: `5 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-18', type: 'time', hour24: 18, label: `6 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-19', type: 'time', hour24: 19, label: `7 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-20', type: 'time', hour24: 20, label: `8 ${t('schedule.timePeriods.pm')}` },
  ];

  const getClassForSlot = (dayKey: ScheduleEntry['dayKey'], hour24: number) => {
    return scheduleData.find(entry => entry.dayKey === dayKey && entry.hour24 === hour24);
  };
  
  const classDisplayNames = {
    MOBILITY: t('schedule.classes.mobility'),
    STRENGTH: t('schedule.classes.strength'),
    CARDIO: t('schedule.classes.cardio'),
    POWER: t('schedule.classes.power'),
  };
  
  const classStyles: { [key: string]: string } = {
    [classDisplayNames.MOBILITY.toUpperCase()]: 'bg-gray-600 text-signal-light-gray hover:opacity-90',
    [classDisplayNames.STRENGTH.toUpperCase()]: 'bg-signal-gold text-signal-black font-semibold hover:opacity-90',
    [classDisplayNames.CARDIO.toUpperCase()]: 'bg-signal-charcoal text-signal-light-gray border border-gray-700 hover:opacity-90',
    [classDisplayNames.POWER.toUpperCase()]: 'bg-gray-500 text-white hover:opacity-90',
  };

  const keyItems = [
    { name: classDisplayNames.STRENGTH, style: classStyles[classDisplayNames.STRENGTH.toUpperCase()] },
    { name: classDisplayNames.CARDIO, style: classStyles[classDisplayNames.CARDIO.toUpperCase()] },
    { name: classDisplayNames.MOBILITY, style: classStyles[classDisplayNames.MOBILITY.toUpperCase()] },
    { name: classDisplayNames.POWER, style: classStyles[classDisplayNames.POWER.toUpperCase()] },
  ];

  return (
    <section id="schedule" className="section-padding bg-signal-black text-signal-light-gray">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center font-lora">{t('schedule.title')}</h2>
        
        <div className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <span className="font-semibold mr-2">{t('schedule.keyTitle')}</span>
          {keyItems.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <span className={cn("w-4 h-4 rounded-sm block", item.style)}></span>
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          {/* Main grid for the schedule table. Day column widths adjusted slightly. */}
          <div className="grid grid-cols-[auto_repeat(7,minmax(55px,1fr))] gap-px bg-gray-700 border border-gray-700 rounded-lg min-w-[600px] md:min-w-full">
            {/* Header: Empty Top Left Cell */}
            <div className="bg-signal-charcoal p-1.5"></div>
            {/* Header: Day Names - text size adjusted */}
            {daysOfWeek.map(day => (
              <div key={day.key} className="bg-signal-charcoal text-center py-2 px-1 font-semibold text-xs sticky top-0 z-10">
                {day.label.toUpperCase()}
              </div>
            ))}

            {/* Time Slots and Schedule Entries */}
            {timeSlots.map(timeSlot => (
              <React.Fragment key={timeSlot.id}>
                {timeSlot.type === 'time' ? (
                  <>
                    {/* Time Label Cell for regular time slots. min-h-[40px] for consistent row height. */}
                    <div className="bg-signal-charcoal text-right py-1 pr-2 pl-1 text-xs font-medium sticky left-0 z-10 min-h-[40px] flex items-center justify-end">
                      {timeSlot.label}
                    </div>
                    {/* Class Cells for this Time Slot */}
                    {daysOfWeek.map(day => {
                      const scheduledClass = getClassForSlot(day.key, timeSlot.hour24!); // hour24 is defined for type 'time'
                      return (
                        <div key={`${day.key}-${timeSlot.hour24}`} className="bg-signal-charcoal p-0.5 min-h-[40px] h-full">
                          {scheduledClass ? (
                            <div className={cn(
                              "w-full h-full rounded-sm p-1 text-center text-xs leading-tight flex items-center justify-center transition-opacity duration-150", // p-1 from p-1.5
                              classStyles[scheduledClass.name.toUpperCase()] || 'bg-gray-400 text-black'
                            )}>
                              {t(`schedule.classes.${scheduledClass.name.toLowerCase()}` as any)}
                            </div>
                          ) : (
                            <div className="w-full h-full"></div> // Empty cell
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : ( // type === 'break'
                  <>
                    {/* Time Label Cell for Break. h-[20px] for a smaller break row. */}
                    <div className="bg-signal-charcoal text-center py-1 text-xs font-medium sticky left-0 z-10 h-[20px] flex items-center justify-center">
                      {timeSlot.label} {/* This will display "..." */}
                    </div>
                    {/* Break Visual Cue Cell spanning all day columns */}
                    <div className="bg-signal-charcoal h-[20px] flex items-center justify-center col-span-7">
                       <div className="w-1/2 border-t border-dashed border-gray-500"></div> {/* Dashed line as visual cue */}
                    </div>
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4 italic">
          {t('schedule.disclaimer')}
        </p>
      </div>
    </section>
  );
};

export default WeeklySchedule;
