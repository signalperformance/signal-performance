
import React, { useMemo } from 'react';
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
    { key: 'sunday' as DayKey, label: t('schedule.days.sunday') }
  ];

  const timeSlots: TimeSlotItem[] = [
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
    { id: 'ts-19', hour24: 19, label: `7 ${t('schedule.timePeriods.pm')}` }
  ];

  const getClassForSlot = (dayKey: DayKey, hour24: number) => {
    return scheduleData.find(entry => entry.dayKey === dayKey && entry.hour24 === hour24);
  };

  // Session-type-based color system
  const sessionTypeStyles = {
    pro: 'bg-blue-500 text-white hover:bg-blue-600',
    amateur: 'bg-emerald-500 text-white hover:bg-emerald-600'
  };

  return (
    <section id="schedule" className="section-padding text-signal-light-gray bg-signal-white">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center font-lora text-signal-black">
          {t('schedule.title')}
        </h2>
        <p className="text-base md:text-lg text-center text-muted-foreground mb-6 font-montserrat">
          {t('schedule.subtitle')}
        </p>

        {/* Legend */}
        <div className="flex justify-center items-center mb-6">
          <div className="flex items-center gap-4 text-signal-black text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>{t('schedule.legend.pros')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>{t('schedule.legend.amateurs')}</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[auto_repeat(7,minmax(70px,1fr))] md:grid-cols-[auto_repeat(7,minmax(50px,1fr))] gap-1 bg-gray-200 border-2 border-gray-300 rounded-lg min-w-[600px] md:min-w-full p-1 shadow-lg">
            {/* Header: Empty Top Left Cell */}
            <div className="bg-gray-50 rounded border-2 border-gray-300 p-1 shadow-sm"></div>
            
            {/* Header: Day Names */}
            {daysOfWeek.map(day => (
              <div 
                key={day.key} 
                className="bg-gray-50 rounded text-center py-1 px-0.5 font-semibold text-xs text-signal-black border-2 border-gray-300 shadow-sm"
              >
                {day.label.toUpperCase()}
              </div>
            ))}

            {/* Time Slots and Schedule Entries */}
            {timeSlots.map(timeSlot => (
              <React.Fragment key={timeSlot.id}>
                <div className="bg-gray-50 rounded text-center py-1 px-0.5 text-xs font-semibold text-signal-black flex items-center justify-center border-2 border-gray-300 shadow-sm">
                  {timeSlot.label}
                </div>
                {daysOfWeek.map(day => {
                  const scheduledClass = getClassForSlot(day.key, timeSlot.hour24);
                  return (
                    <div 
                      key={`${day.key}-${timeSlot.hour24}`} 
                      className="bg-white rounded p-0.5 min-h-[32px] md:min-h-[28px] flex items-center justify-center border-2 border-gray-300 shadow-sm"
                    >
                      {scheduledClass ? (
                        <div 
                          className={cn(
                            "w-full h-full rounded p-1 md:p-0.5 text-center text-xs font-semibold flex items-center justify-center transition-all duration-200 shadow-md border border-white/20",
                            sessionTypeStyles[scheduledClass.sessionType]
                          )}
                        >
                          <span>
                            {t(`schedule.classes.${scheduledClass.name.toLowerCase()}`)}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-full"></div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklySchedule;
