
import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { scheduleData } from '@/data/scheduleData';
import { ScheduleEntry, TimeSlotItem, DayKey } from '@/data/scheduleTypes';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type FilterType = 'all' | 'pro' | 'amateur';

const WeeklySchedule = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredSchedule = useMemo(() => {
    if (filter === 'all') {
      return scheduleData;
    }
    return scheduleData.filter(entry => entry.sessionType === filter);
  }, [filter]);

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
    return filteredSchedule.find(entry => entry.dayKey === dayKey && entry.hour24 === hour24);
  };

  // New session-type-based color system
  const sessionTypeStyles = {
    pro: 'bg-blue-500 text-white hover:bg-blue-600',
    amateur: 'bg-emerald-500 text-white hover:bg-emerald-600'
  };

  const toggleItemClasses = "rounded-full text-signal-charcoal border-signal-charcoal data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary data-[state=on]:hover:bg-primary/90";

  return (
    <section id="schedule" className="section-padding text-signal-light-gray bg-signal-white">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center font-lora text-signal-black">
          {t('schedule.title')}
        </h2>
        <p className="text-base md:text-lg text-center text-muted-foreground mb-6 font-montserrat">
          {t('schedule.subtitle')}
        </p>

        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(value: FilterType) => {
            if (value) setFilter(value);
          }}
          className="flex justify-center items-center gap-2 mb-6 flex-wrap"
        >
          <ToggleGroupItem value="all" size="sm" variant="outline" className={toggleItemClasses}>
            {t('schedule.filter.all')}
          </ToggleGroupItem>
          <ToggleGroupItem value="pro" size="sm" variant="outline" className={toggleItemClasses}>
            {t('schedule.filter.pro')}
          </ToggleGroupItem>
          <ToggleGroupItem value="amateur" size="sm" variant="outline" className={toggleItemClasses}>
            {t('schedule.filter.open')}
          </ToggleGroupItem>
        </ToggleGroup>
        
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[auto_repeat(7,minmax(80px,1fr))] gap-1 bg-gray-200 border border-gray-300 rounded-lg min-w-[700px] md:min-w-full p-2">
            {/* Header: Empty Top Left Cell */}
            <div className="bg-white rounded p-2"></div>
            
            {/* Header: Day Names */}
            {daysOfWeek.map(day => (
              <div key={day.key} className="bg-white rounded text-center py-3 px-2 font-semibold text-sm text-signal-black">
                {day.label.toUpperCase()}
              </div>
            ))}

            {/* Time Slots and Schedule Entries */}
            {timeSlots.map(timeSlot => (
              <React.Fragment key={timeSlot.id}>
                <div className="bg-white rounded text-center py-3 px-2 text-sm font-medium text-signal-black flex items-center justify-center">
                  {timeSlot.label}
                </div>
                {daysOfWeek.map(day => {
                  const scheduledClass = getClassForSlot(day.key, timeSlot.hour24);
                  return (
                    <div key={`${day.key}-${timeSlot.hour24}`} className="bg-white rounded p-1 min-h-[60px] flex items-center justify-center">
                      {scheduledClass ? (
                        <div className={cn(
                          "w-full h-full rounded-md p-2 text-center text-sm font-medium flex flex-col items-center justify-center transition-all duration-200 shadow-sm",
                          sessionTypeStyles[scheduledClass.sessionType]
                        )}>
                          <span className="font-semibold">
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
        
        {/* Enhanced Legend/Key */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-signal-black">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm font-medium">PRO: Professionals Only</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-sm font-medium">AM: Open to All Members</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklySchedule;
