import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { scheduleData } from '@/data/scheduleData';
import { ScheduleEntry, TimeSlotItem, DayKey } from '@/data/scheduleTypes';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
type FilterType = 'all' | 'pro' | 'amateur';
const WeeklySchedule = () => {
  const {
    t
  } = useLanguage();
  const [filter, setFilter] = useState<FilterType>('all');
  const filteredSchedule = useMemo(() => {
    if (filter === 'all') {
      return scheduleData;
    }
    return scheduleData.filter(entry => entry.sessionType === filter);
  }, [filter]);
  const daysOfWeek = [{
    key: 'monday' as DayKey,
    label: t('schedule.days.monday')
  }, {
    key: 'tuesday' as DayKey,
    label: t('schedule.days.tuesday')
  }, {
    key: 'wednesday' as DayKey,
    label: t('schedule.days.wednesday')
  }, {
    key: 'thursday' as DayKey,
    label: t('schedule.days.thursday')
  }, {
    key: 'friday' as DayKey,
    label: t('schedule.days.friday')
  }, {
    key: 'saturday' as DayKey,
    label: t('schedule.days.saturday')
  }, {
    key: 'sunday' as DayKey,
    label: t('schedule.days.sunday')
  }];
  const timeSlots: TimeSlotItem[] = [{
    id: 'ts-9',
    hour24: 9,
    label: `9 ${t('schedule.timePeriods.am')}`
  }, {
    id: 'ts-10',
    hour24: 10,
    label: `10 ${t('schedule.timePeriods.am')}`
  }, {
    id: 'ts-11',
    hour24: 11,
    label: `11 ${t('schedule.timePeriods.am')}`
  }, {
    id: 'ts-12',
    hour24: 12,
    label: `12 ${t('schedule.timePeriods.pm')}`
  }, {
    id: 'ts-13',
    hour24: 13,
    label: `1 ${t('schedule.timePeriods.pm')}`
  }, {
    id: 'ts-14',
    hour24: 14,
    label: `2 ${t('schedule.timePeriods.pm')}`
  }, {
    id: 'ts-15',
    hour24: 15,
    label: `3 ${t('schedule.timePeriods.pm')}`
  }, {
    id: 'ts-16',
    hour24: 16,
    label: `4 ${t('schedule.timePeriods.pm')}`
  }, {
    id: 'ts-17',
    hour24: 17,
    label: `5 ${t('schedule.timePeriods.pm')}`
  }, {
    id: 'ts-18',
    hour24: 18,
    label: `6 ${t('schedule.timePeriods.pm')}`
  }, {
    id: 'ts-19',
    hour24: 19,
    label: `7 ${t('schedule.timePeriods.pm')}`
  }];
  const getClassForSlot = (dayKey: DayKey, hour24: number) => {
    return filteredSchedule.find(entry => entry.dayKey === dayKey && entry.hour24 === hour24);
  };

  // Session-type-based color system
  const sessionTypeStyles = {
    pro: 'bg-blue-500 text-white hover:bg-blue-600',
    amateur: 'bg-emerald-500 text-white hover:bg-emerald-600'
  };
  const toggleItemClasses = "rounded-full text-signal-charcoal border-signal-charcoal hover:bg-accent hover:text-accent-foreground";
  const toggleItemSelectedClasses = {
    all: "rounded-full data-[state=on]:bg-gray-500 data-[state=on]:text-white data-[state=on]:border-gray-500",
    pro: "rounded-full data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:border-blue-500",
    amateur: "rounded-full data-[state=on]:bg-emerald-500 data-[state=on]:text-white data-[state=on]:border-emerald-500"
  };
  return <section id="schedule" className="section-padding text-signal-light-gray bg-signal-white">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center font-lora text-signal-black">
          {t('schedule.title')}
        </h2>
        <p className="text-base md:text-lg text-center text-muted-foreground mb-6 font-montserrat">
          {t('schedule.subtitle')}
        </p>

        {/* Filter and Legend Container */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          {/* Filter Buttons */}
          <ToggleGroup type="single" value={filter} onValueChange={(value: FilterType) => {
          if (value) setFilter(value);
        }} className="flex justify-center items-center gap-2">
            <ToggleGroupItem value="all" size="sm" variant="outline" className={cn(toggleItemClasses, toggleItemSelectedClasses.all)}>
              {t('schedule.filter.all')}
            </ToggleGroupItem>
            <ToggleGroupItem value="pro" size="sm" variant="outline" className={cn(toggleItemClasses, toggleItemSelectedClasses.pro)}>
              {t('schedule.filter.pro')}
            </ToggleGroupItem>
            <ToggleGroupItem value="amateur" size="sm" variant="outline" className={cn(toggleItemClasses, toggleItemSelectedClasses.amateur)}>
              {t('schedule.filter.open')}
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Legend */}
          <div className="flex items-center gap-4 text-signal-black text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Pro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>Amateurs</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[auto_repeat(7,minmax(80px,1fr))] gap-1 bg-gray-100 border border-gray-200 rounded-lg min-w-[600px] md:min-w-full p-2">
            {/* Header: Empty Top Left Cell */}
            <div className="bg-white rounded p-2 border border-gray-200"></div>
            
            {/* Header: Day Names */}
            {daysOfWeek.map(day => <div key={day.key} className="bg-white rounded text-center py-2 px-2 font-semibold text-xs text-signal-black border border-gray-200 shadow-sm">
                {day.label.toUpperCase()}
              </div>)}

            {/* Time Slots and Schedule Entries */}
            {timeSlots.map(timeSlot => <React.Fragment key={timeSlot.id}>
                <div className="bg-white rounded text-center py-2 px-2 text-xs font-semibold text-signal-black flex items-center justify-center border border-gray-200 shadow-sm">
                  {timeSlot.label}
                </div>
                {daysOfWeek.map(day => {
              const scheduledClass = getClassForSlot(day.key, timeSlot.hour24);
              return <div key={`${day.key}-${timeSlot.hour24}`} className="bg-white rounded p-1 min-h-[50px] flex items-center justify-center border border-gray-200 shadow-sm">
                      {scheduledClass ? <div className={cn("w-full h-full rounded p-2 text-center text-sm font-semibold flex items-center justify-center transition-all duration-200 shadow-md", sessionTypeStyles[scheduledClass.sessionType])}>
                          <span>
                            {t(`schedule.classes.${scheduledClass.name.toLowerCase()}`)}
                          </span>
                        </div> : <div className="w-full h-full"></div>}
                    </div>;
            })}
              </React.Fragment>)}
          </div>
        </div>
      </div>
    </section>;
};
export default WeeklySchedule;