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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">Unified interface for managing schedules, templates, and live classes</p>
        </div>
        <Button variant="outline" onClick={refreshData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="live" className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4" />
            Live Calendar
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="periods" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Periods
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