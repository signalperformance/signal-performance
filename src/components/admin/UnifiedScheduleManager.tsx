import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, CalendarCheck, RefreshCw } from 'lucide-react';
import { useUnifiedScheduleStore } from '@/hooks/useUnifiedScheduleStore';
import { ScheduleTemplatesTab } from './unified/ScheduleTemplatesTab';
import { SchedulePeriodsTab } from './unified/SchedulePeriodsTab';
import { LiveCalendarTab } from './unified/LiveCalendarTab';

export function UnifiedScheduleManager() {
  const [activeTab, setActiveTab] = useState('live');
  const {
    templates,
    periods,
    liveInstances,
    loading,
    error,
    refreshData
  } = useUnifiedScheduleStore();

  // Calculate summary stats
  const totalClasses = liveInstances.length;
  const activeTemplates = templates.filter(t => t.is_active).length;
  const activePeriods = periods.filter(p => p.is_active).length;
  const upcomingClasses = liveInstances.filter(instance => 
    new Date(instance.class_date) >= new Date()
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading schedule management...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-destructive mb-4">{error}</div>
        <Button onClick={refreshData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Schedule Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">Unified interface for managing schedules, templates, and live classes</p>
        </div>
        <Button variant="outline" onClick={refreshData} size="sm" className="self-start sm:self-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Refresh All</span>
          <span className="sm:hidden">Refresh</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="live" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <CalendarCheck className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Live Calendar</span>
            <span className="sm:hidden">Live</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Templates</span>
            <span className="sm:hidden">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="periods" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <CalendarDays className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Periods</span>
            <span className="sm:hidden">Periods</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <LiveCalendarTab />
        </TabsContent>

        <TabsContent value="templates">
          <ScheduleTemplatesTab />
        </TabsContent>

        <TabsContent value="periods">
          <SchedulePeriodsTab />
        </TabsContent>

      </Tabs>
    </div>
  );
}