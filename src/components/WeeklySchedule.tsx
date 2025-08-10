import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Clock } from 'lucide-react';

const WeeklySchedule = () => {
  const { t, language } = useLanguage();

  type Item = {
    hour24: number;
    labelKey: 'mobility' | 'strength' | 'cardio' | 'power';
    pro?: boolean;
  };

  // Pro classes at 12/1/2 PM updated per request
  const mwf: Item[] = [
    { hour24: 12, labelKey: 'mobility', pro: true },
    { hour24: 13, labelKey: 'strength', pro: true },
    { hour24: 14, labelKey: 'strength', pro: true },
    { hour24: 17, labelKey: 'mobility' },
    { hour24: 18, labelKey: 'strength' },
    { hour24: 19, labelKey: 'strength' },
  ];

  const tth: Item[] = [
    { hour24: 12, labelKey: 'power', pro: true },
    { hour24: 13, labelKey: 'cardio', pro: true },
    { hour24: 14, labelKey: 'power', pro: true },
    { hour24: 17, labelKey: 'power' },
    { hour24: 18, labelKey: 'cardio' },
    { hour24: 19, labelKey: 'power' },
  ];

  const weekend: Item[] = [
    { hour24: 9, labelKey: 'mobility' },
    { hour24: 10, labelKey: 'strength' },
    { hour24: 11, labelKey: 'cardio' },
    { hour24: 12, labelKey: 'power' },
  ];

  const columns = [
    { title: t('schedule.columns.mwf'), items: mwf },
    { title: t('schedule.columns.tth'), items: tth },
    { title: t('schedule.columns.weekend'), items: weekend },
  ];

  const formatTime = (hour24: number) => {
    if (language === 'zh') {
      return `${String(hour24).padStart(2, '0')}:00`;
    }
    const isPM = hour24 >= 12;
    let hour12 = hour24 % 12 || 12;
    const period = t(isPM ? 'schedule.timePeriods.pm' : 'schedule.timePeriods.am');
    return `${hour12} ${period}`;
  };

  return (
    <TooltipProvider>
      <section id="schedule" className="section-padding">
        <div className="container mx-auto container-padding">
          <header className="mb-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-lora text-signal-black mb-2">
              {t('schedule.title')}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground font-montserrat">
              {t('schedule.subtitle')}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((col, idx) => (
              <article key={idx} className="relative">
                <Card className="overflow-hidden border-border/70 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-1 w-full bg-signal-gold" aria-hidden />
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center text-base font-semibold text-foreground">
                      {col.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2" role="list">
                      {col.items.map((it, i) => (
                          <li
                            key={i}
                            className={`relative grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md border border-border/60 px-3 py-2 ${
                              it.pro ? 'bg-signal-gold/10' : 'bg-card/50'
                            }`}
                          >
                            {it.pro && (
                              <span
                                className="absolute left-0 top-0 h-full w-1 bg-signal-gold"
                                aria-hidden
                              />
                            )}
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" aria-hidden />
                              {formatTime(it.hour24)}
                            </span>
                            <span className="text-base md:text-lg font-extrabold font-lora text-foreground text-center justify-self-center">
                              {t(`schedule.classes.${it.labelKey}`)}
                            </span>
                            <span className="justify-self-end">
                              {it.pro ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-signal-gold/20 text-signal-charcoal px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-signal-gold/40">
                                      {t('schedule.badge.pro')}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>{t('schedule.tooltips.pro')}</TooltipContent>
                                </Tooltip>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-primary/30">
                                      {t('schedule.badge.am')}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>{t('schedule.tooltips.am')}</TooltipContent>
                                </Tooltip>
                              )}
                            </span>
                          </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
          <aside className="mt-4 text-center text-xs text-muted-foreground">
            <p className="inline-flex items-center justify-center gap-6">
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-signal-gold/20 text-signal-charcoal px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-signal-gold/40">
                  {t('schedule.badge.pro')}
                </span>
                <span>=</span>
                <span>{t('schedule.legend.pros')}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-primary/30">
                  {t('schedule.badge.am')}
                </span>
                <span>=</span>
                <span>{t('schedule.legend.amateurs')}</span>
              </span>
            </p>
          </aside>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default WeeklySchedule;
