import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Clock, Move, Dumbbell, Activity, Zap, Crown, Unlock } from 'lucide-react';
const WeeklySchedule = () => {
  const {
    t
  } = useLanguage();
  const classIconMap: Record<string, React.ReactNode> = {
    mobility: <Move className="h-3.5 w-3.5 text-signal-charcoal" aria-hidden />,
    strength: <Dumbbell className="h-3.5 w-3.5 text-signal-charcoal" aria-hidden />,
    cardio: <Activity className="h-3.5 w-3.5 text-signal-charcoal" aria-hidden />,
    power: <Zap className="h-3.5 w-3.5 text-signal-charcoal" aria-hidden />
  };
  type Item = {
    time: string;
    labelKey: 'mobility' | 'strength' | 'cardio' | 'power';
    pro?: boolean;
  };
  const mwf: Item[] = [{
    time: `12 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'strength',
    pro: true
  }, {
    time: `1 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'strength',
    pro: true
  }, {
    time: `2 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'strength',
    pro: true
  }, {
    time: `5 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'mobility'
  }, {
    time: `6 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'strength'
  }, {
    time: `7 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'strength'
  }];
  const tth: Item[] = [{
    time: `12 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'power',
    pro: true
  }, {
    time: `1 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'power',
    pro: true
  }, {
    time: `2 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'power',
    pro: true
  }, {
    time: `5 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'power'
  }, {
    time: `6 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'cardio'
  }, {
    time: `7 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'power'
  }];
  const weekend: Item[] = [{
    time: `9 ${t('schedule.timePeriods.am')}`,
    labelKey: 'mobility'
  }, {
    time: `10 ${t('schedule.timePeriods.am')}`,
    labelKey: 'strength'
  }, {
    time: `11 ${t('schedule.timePeriods.am')}`,
    labelKey: 'cardio'
  }, {
    time: `12 ${t('schedule.timePeriods.pm')}`,
    labelKey: 'power'
  }];
  const columns = [{
    title: t('schedule.columns.mwf'),
    items: mwf
  }, {
    title: t('schedule.columns.tth'),
    items: tth
  }, {
    title: t('schedule.columns.weekend'),
    items: weekend
  }];
  return <TooltipProvider>
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
          {columns.map((col, idx) => <article key={idx} className="relative">
              <Card className="overflow-hidden border-border/70 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-1 w-full bg-signal-gold" aria-hidden />
                <CardHeader className="pb-3">
                  <CardTitle className="text-center text-base font-semibold text-foreground">
                    {col.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2" role="list">
                    {col.items.map((it, i) => <li key={i} className={`relative flex items-center justify-between rounded-md border border-border/60 px-3 py-2 ${it.pro ? 'bg-signal-gold/10' : 'bg-card/50'}`}>
                        {it.pro && <span className="absolute left-0 top-0 h-full w-1 bg-signal-gold" aria-hidden />}
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" aria-hidden />
                          {it.time}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                          {classIconMap[it.labelKey]}
                          {t(`schedule.classes.${it.labelKey}`)}
                          {it.pro && <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-signal-gold/20 text-signal-charcoal px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-signal-gold/40">
                                  
                                  PRO
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                Professional only class
                              </TooltipContent>
                            </Tooltip>}
                          {!it.pro && <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-primary/30">
                                  
                                  OPEN
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                Open to everyone
                              </TooltipContent>
                            </Tooltip>}
                        </span>
                      </li>)}
                  </ul>
                </CardContent>
              </Card>
            </article>)}
        </div>
      </div>
      </section>
    </TooltipProvider>;
};
export default WeeklySchedule;