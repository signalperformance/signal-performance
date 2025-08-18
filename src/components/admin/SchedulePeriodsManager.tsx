import { useState, useEffect } from 'react';
import { Plus, Calendar, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

interface ScheduleTemplate {
  id: string;
  name: string;
  description?: string;
}

interface SchedulePeriod {
  id: string;
  template_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  template: ScheduleTemplate;
}

export function SchedulePeriodsManager() {
  const [periods, setPeriods] = useState<SchedulePeriod[]>([]);
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    template_id: '',
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined,
  });
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([loadPeriods(), loadTemplates()]);
  }, []);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedule_periods')
        .select(`
          *,
          template:schedule_templates(id, name, description)
        `)
        .eq('is_active', true)
        .order('start_date', { ascending: true });

      if (error) throw error;

      setPeriods(data || []);
    } catch (error) {
      console.error('Error loading periods:', error);
      toast({
        title: "Error",
        description: "Failed to load schedule periods",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_templates')
        .select('id, name, description')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      });
    }
  };

  const createPeriod = async () => {
    if (!newPeriod.template_id || !newPeriod.start_date || !newPeriod.end_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (newPeriod.end_date < newPeriod.start_date) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('schedule_periods')
        .insert([{
          template_id: newPeriod.template_id,
          start_date: format(newPeriod.start_date, 'yyyy-MM-dd'),
          end_date: format(newPeriod.end_date, 'yyyy-MM-dd'),
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Schedule period created successfully",
      });

      setNewPeriod({
        template_id: '',
        start_date: undefined,
        end_date: undefined,
      });
      setShowCreateDialog(false);
      loadPeriods();
    } catch (error) {
      console.error('Error creating period:', error);
      toast({
        title: "Error",
        description: "Failed to create schedule period. Check for overlapping dates.",
        variant: "destructive",
      });
    }
  };

  const deletePeriod = async (periodId: string) => {
    try {
      const { error } = await supabase
        .from('schedule_periods')
        .update({ is_active: false })
        .eq('id', periodId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Schedule period deleted successfully",
      });

      loadPeriods();
    } catch (error) {
      console.error('Error deleting period:', error);
      toast({
        title: "Error",
        description: "Failed to delete schedule period",
        variant: "destructive",
      });
    }
  };

  const generateInstances = async (periodId: string) => {
    try {
      setLoading(true);
      console.log('Generating instances for period:', periodId);
      
      const { data, error } = await supabase.functions.invoke('generate-schedule-instances', {
        body: { period_id: periodId }
      });

      if (error) {
        console.error('Failed to generate instances:', error);
        toast({
          title: "Error",
          description: "Failed to generate schedule instances",
          variant: "destructive",
        });
        return;
      }

      console.log('Instances generated successfully:', data);
      toast({
        title: "Success",
        description: `Generated ${data?.instances_count || 0} live schedule instances`,
      });
      
    } catch (error) {
      console.error('Error generating instances:', error);
      toast({
        title: "Error",
        description: "Failed to generate schedule instances",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading schedule periods...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Periods</h1>
          <p className="text-muted-foreground">Assign schedule templates to specific date ranges</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Period
        </Button>
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => generateInstances(period.id)}
                    title="Generate live schedule instances"
                  >
                    <RefreshCw className="h-4 w-4" />
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
      </div>

      {/* Create Period Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Schedule Period</DialogTitle>
            <DialogDescription>
              Assign a template to a specific date range to create bookable classes.
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
                      {template.name}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createPeriod}>
              Create Period
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}