
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const WeeklySchedule = () => {
  const { t } = useLanguage();


  return (
    <section id="schedule" className="section-padding">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center font-lora text-signal-black">
          {t('schedule.title')}
        </h2>
        <p className="text-base md:text-lg text-center text-muted-foreground mb-6 font-montserrat">
          {t('schedule.subtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <article className="rounded-lg border border-border bg-card p-3 shadow-sm">
            <h3 className="text-center text-sm font-semibold text-foreground mb-2">{t('schedule.columns.mwf')}</h3>
            <ul className="space-y-1 text-xs">
              <li className="flex items-center justify-between"><span className="text-muted-foreground">5 {t('schedule.timePeriods.pm')}</span><span className="font-medium text-foreground">{t('schedule.classes.mobility')}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">6 {t('schedule.timePeriods.pm')}</span><span className="font-medium text-foreground">{t('schedule.classes.strength')}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">7 {t('schedule.timePeriods.pm')}</span><span className="font-medium text-foreground">{t('schedule.classes.strength')}</span></li>
            </ul>
          </article>

          <article className="rounded-lg border border-border bg-card p-3 shadow-sm">
            <h3 className="text-center text-sm font-semibold text-foreground mb-2">{t('schedule.columns.tth')}</h3>
            <ul className="space-y-1 text-xs">
              <li className="flex items-center justify-between"><span className="text-muted-foreground">5 {t('schedule.timePeriods.pm')}</span><span className="font-medium text-foreground">{t('schedule.classes.power')}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">6 {t('schedule.timePeriods.pm')}</span><span className="font-medium text-foreground">{t('schedule.classes.cardio')}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">7 {t('schedule.timePeriods.pm')}</span><span className="font-medium text-foreground">{t('schedule.classes.power')}</span></li>
            </ul>
          </article>

          <article className="rounded-lg border border-border bg-card p-3 shadow-sm">
            <h3 className="text-center text-sm font-semibold text-foreground mb-2">{t('schedule.columns.weekend')}</h3>
            <ul className="space-y-1 text-xs">
              <li className="flex items-center justify-between"><span className="text-muted-foreground">9 {t('schedule.timePeriods.am')}</span><span className="font-medium text-foreground">{t('schedule.classes.mobility')}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">10 {t('schedule.timePeriods.am')}</span><span className="font-medium text-foreground">{t('schedule.classes.strength')}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">11 {t('schedule.timePeriods.am')}</span><span className="font-medium text-foreground">{t('schedule.classes.cardio')}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">12 {t('schedule.timePeriods.pm')}</span><span className="font-medium text-foreground">{t('schedule.classes.power')}</span></li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};

export default WeeklySchedule;
