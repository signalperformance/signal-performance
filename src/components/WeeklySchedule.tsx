
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { scheduleData } from '@/data/scheduleData';
import { ScheduleEntry, TimeSlotItem, DayKey } from '@/data/scheduleTypes';

const WeeklySchedule = () => {
  const { t } = useLanguage();

  const daysOfWeek = [
    { key: 'monday' as DayKey, label: t('schedule.days.monday') },
    { key: 'tuesday' as DayKey, label: t('schedule.days.tuesday') },
    { key: 'wednesday' as DayKey, label: t('schedule.days.wednesday') },
    { key: 'thursday' as DayKey, label: t('schedule.days.thursday') },
    { key: 'friday' as DayKey, label: t('schedule.days.friday') },
    { key: 'saturday' as DayKey, label: t('schedule.days.saturday') },
    { key: 'sunday' as DayKey, label: t('schedule.days.sunday') },
  ];

  const timeSlots: TimeSlotItem[] = [
    { id: 'ts-8', hour24: 8, label: `8 ${t('schedule.timePeriods.am')}` },
    { id: 'ts-9', hour24: 9, label: `9 ${t('schedule.timePeriods.am')}` },
    { id: 'ts-10', hour24: 10, label: `10 ${t('schedule.timePeriods.am')}` },
    { id: 'ts-11', hour24: 11, label: `11 ${t('schedule.timePeriods.am')}` },
    { id: 'ts-12', hour24: 12, label: `12 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-13', hour24: 13, label: `1 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-14', hour24: 14, label: `2 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-15', hour24: 15, label: `3 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-16', hour24: 16, label: `4 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-17', hour24: 17, label: `5 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-18', hour24: 18, label: `6 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-19', hour24: 19, label: `7 ${t('schedule.timePeriods.pm')}` },
    { id: 'ts-20', hour24: 20, label: `8 ${t('schedule.timePeriods.pm')}` },
  ];

  const getClassForSlot = (dayKey: DayKey, hour24: number) => {
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
    {
      name: "PR: Pro's Only", // Updated text
      style: cn('bg-gray-600') // Removed pattern-diagonal-stripes
    },
    {
      name: "OP: Open to All Members", // Updated text
      style: cn('bg-gray-600') // Kept solid color for consistency or if needed for future differentiation
    }
  ];

  return (
    <section id="schedule" className="section-padding bg-signal-black text-signal-light-gray">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center font-lora">{t('schedule.title')}</h2>
        <p className="text-base md:text-lg text-center text-gray-400 mb-6 font-montserrat">
          {t('schedule.subtitle')}
        </p>
        
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[auto_repeat(7,minmax(55px,1fr))] gap-px bg-gray-700 border border-gray-700 rounded-lg min-w-[600px] md:min-w-full">
            {/* Header: Empty Top Left Cell */}
            <div className="bg-signal-charcoal p-1.5"></div>
            {/* Header: Day Names */}
            {daysOfWeek.map(day => (
              <div key={day.key} className="bg-signal-charcoal text-center py-2 px-1 font-semibold text-xs sticky top-0 z-10">
                {day.label.toUpperCase()}
              </div>
            ))}

            {/* Time Slots and Schedule Entries */}
            {timeSlots.map(timeSlot => (
              <React.Fragment key={timeSlot.id}>
                <div className="bg-signal-charcoal text-right py-1 pr-2 pl-1 text-xs font-medium sticky left-0 z-10 min-h-[40px] flex items-center justify-end">
                  {timeSlot.label}
                </div>
                {daysOfWeek.map(day => {
                  const scheduledClass = getClassForSlot(day.key, timeSlot.hour24);
                  return (
                    <div key={`${day.key}-${timeSlot.hour24}`} className="bg-signal-charcoal p-0.5 min-h-[40px] h-full">
                      {scheduledClass ? (
                        <div className={cn(
                          "w-full h-full rounded-sm p-1 text-center text-xs leading-tight flex flex-col items-center justify-center transition-opacity duration-150",
                          classStyles[scheduledClass.name.toUpperCase()] || 'bg-gray-400 text-black'
                          // Removed: scheduledClass.sessionType === 'pro' ? 'pattern-diagonal-stripes' : ''
                        )}>
                          <span>
                            {t(`schedule.classes.${scheduledClass.name.toLowerCase()}`)}
                            {scheduledClass.sessionType === 'pro' && <sup>PR</sup>}
                            {scheduledClass.sessionType === 'amateur' && <sup>OP</sup>}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-full"></div> // Empty cell
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Key/Legend items */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
          <span className="text-sm font-semibold uppercase mr-2">{t('schedule.keyTitle')}</span>
          {keyItems.map(item => (
            <div key={item.name} className="flex items-center">
              <span className={cn("w-3 h-3 rounded-xs mr-1.5", item.style)}></span>
              <span className="text-xs">{item.name}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WeeklySchedule;

