import { useState } from 'react';
import { Plus, Calendar, Trash2, RefreshCw, AlertTriangle, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useUnifiedScheduleStore } from '@/hooks/useUnifiedScheduleStore';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';

export function SchedulePeriodsTab() {
  const {
    templates,
    periods,
    createPeriod,
    deletePeriod,
    generateInstances,
    cleanupOrphanedInstances,
  } = useUnifiedScheduleStore();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    template_id: '',
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined,
  });

  const handleCreatePeriod = async () => {
    if (!newPeriod.template_id || !newPeriod.start_date || !newPeriod.end_date) return;

    try {
      await createPeriod({
        template_id: newPeriod.template_id,
        start_date: format(newPeriod.start_date, 'yyyy-MM-dd'),
        end_date: format(newPeriod.end_date, 'yyyy-MM-dd'),
      });

      setNewPeriod({
        template_id: '',
        start_date: undefined,
        end_date: undefined,
      });
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating period:', error);
    }
  };

  const setTwoWeekPeriod = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
    const end = endOfWeek(addDays(start, 13), { weekStartsOn: 1 }); // End of second week
    
    setNewPeriod(prev => ({
      ...prev,
      start_date: start,
      end_date: end,
    }));
  };

  const isDateInPeriods = (date: Date) => {
    return periods.some(period => {
      const startDate = new Date(period.start_date);
      const endDate = new Date(period.end_date);
      return date >= startDate && date <= endDate;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Schedule Periods</h2>
          <p className="text-muted-foreground">Assign schedule templates to specific date ranges</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={cleanupOrphanedInstances}
            className="text-orange-600 hover:text-orange-700"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Clean Database
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Period
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {periods.map((period) => (
          <Card key={period.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {format(new Date(period.start_date), 'MMM d')} - {format(new Date(period.end_date), 'MMM d, yyyy')}
                  </CardTitle>
                  <CardDescription>
                    Template: {period.template?.name}
                    {period.template?.description && ` - ${period.template.description}`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {Math.ceil((new Date(period.end_date).getTime() - new Date(period.start_date).getTime()) / (1000 * 60 * 60 * 24) + 1)} days
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Auto-generated
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => generateInstances(period.id)}
                    title="Regenerate live schedule instances"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => generateInstances(period.id, true)}
                    title="Force regenerate (clears ALL conflicting instances in date range)"
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deletePeriod(period.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {periods.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No schedule periods found. Create your first period to get started.</p>
            </CardContent>
          </Card>
        )}
        
        {/* Admin Tools */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Database Maintenance
            </CardTitle>
            <CardDescription className="text-orange-700">
              Advanced tools for resolving schedule conflicts and cleaning up orphaned data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                <div>
                  <h4 className="font-medium text-orange-900">Clean Orphaned Instances</h4>
                  <p className="text-sm text-orange-700">Remove live schedule instances from inactive periods</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={cleanupOrphanedInstances}
                  className="border-orange-300 text-orange-700 hover:bg-orange-200"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Clean Up
                </Button>
              </div>
              
              <Separator className="bg-orange-200" />
              
              <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Force Regenerate Button</p>
                    <p className="text-yellow-700">
                      The orange warning button next to each period performs a "force regenerate" that clears ALL instances 
                      in the period's date range (from any period) before creating new ones. Use this to resolve duplicate conflicts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Period Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Schedule Period</DialogTitle>
            <DialogDescription>
              Assign a template to a specific date range. Live instances will be generated automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template">Schedule Template</Label>
              <Select 
                value={newPeriod.template_id} 
                onValueChange={(value) => setNewPeriod(prev => ({ ...prev, template_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} ({template.entries.length} classes)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {newPeriod.start_date ? format(newPeriod.start_date, 'MMM d, yyyy') : 'Pick start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={newPeriod.start_date}
                      onSelect={(date) => setNewPeriod(prev => ({ ...prev, start_date: date }))}
                      disabled={(date) => isDateInPeriods(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {newPeriod.end_date ? format(newPeriod.end_date, 'MMM d, yyyy') : 'Pick end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={newPeriod.end_date}
                      onSelect={(date) => setNewPeriod(prev => ({ ...prev, end_date: date }))}
                      disabled={(date) => date < (newPeriod.start_date || new Date()) || isDateInPeriods(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button variant="outline" onClick={setTwoWeekPeriod} className="w-full">
              Set 2-Week Period (Starting Monday)
            </Button>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h4 className="text-sm font-medium text-blue-900">Automated Workflow</h4>
              </div>
              <p className="text-sm text-blue-700">
                When you create this period, live class instances will be automatically generated based on the selected template. 
                No manual generation step required!
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePeriod}>
              Create Period & Generate Classes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}