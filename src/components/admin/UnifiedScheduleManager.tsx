import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, CalendarCheck, RefreshCw, TrendingUp } from 'lucide-react';
import { useUnifiedScheduleStore } from '@/hooks/useUnifiedScheduleStore';
import { ScheduleTemplatesTab } from './unified/ScheduleTemplatesTab';
import { SchedulePeriodsTab } from './unified/SchedulePeriodsTab';
import { LiveCalendarTab } from './unified/LiveCalendarTab';

export function UnifiedScheduleManager() {
  const [activeTab, setActiveTab] = useState('overview');
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
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="periods" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Periods
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4" />
            Live Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeTemplates}</div>
                <p className="text-xs text-muted-foreground">
                  Reusable schedule patterns
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Periods</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activePeriods}</div>
                <p className="text-xs text-muted-foreground">
                  Date ranges with assigned templates
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Live Classes</CardTitle>
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClasses}</div>
                <p className="text-xs text-muted-foreground">
                  Generated class instances
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingClasses}</div>
                <p className="text-xs text-muted-foreground">
                  Classes scheduled for future
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Overview */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Templates</CardTitle>
                <CardDescription>Latest created schedule templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templates.slice(0, 5).map((template) => (
                    <div key={template.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {template.entries.length} classes
                        </div>
                      </div>
                      <Badge variant="secondary">{template.entries.length}</Badge>
                    </div>
                  ))}
                  {templates.length === 0 && (
                    <p className="text-muted-foreground text-sm">No templates created yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Periods</CardTitle>
                <CardDescription>Currently active schedule periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {periods.slice(0, 5).map((period) => (
                    <div key={period.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{period.template?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  ))}
                  {periods.length === 0 && (
                    <p className="text-muted-foreground text-sm">No active periods</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Streamlined Workflow</CardTitle>
              <CardDescription>Follow this simplified process to manage your schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">1. Create Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Design reusable weekly schedule patterns with classes and timings
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">2. Assign to Periods</h3>
                  <p className="text-sm text-muted-foreground">
                    Apply templates to specific date ranges - instances generate automatically
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <CalendarCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">3. Manage Live Classes</h3>
                  <p className="text-sm text-muted-foreground">
                    View, edit, and manage individual class instances and bookings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <ScheduleTemplatesTab />
        </TabsContent>

        <TabsContent value="periods">
          <SchedulePeriodsTab />
        </TabsContent>

        <TabsContent value="live">
          <LiveCalendarTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}