import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AddLiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClass: () => void;
  selectedDate?: Date;
}

export function AddLiveClassModal({ 
  isOpen, 
  onClose, 
  onAddClass,
  selectedDate
}: AddLiveClassModalProps) {
  const [formData, setFormData] = useState({
    class_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    duration: 60,
    class_name: '',
    session_type: 'amateur' as 'pro' | 'amateur',
    max_participants: 8
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // We need a period_id - for now, let's get the most recent active period
      const { data: periods, error: periodError } = await supabase
        .from('schedule_periods')
        .select('id')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (periodError) throw periodError;
      if (!periods || periods.length === 0) {
        throw new Error('No active schedule period found. Please create a schedule period first.');
      }

      const { error } = await supabase
        .from('live_schedule_instances')
        .insert({
          period_id: periods[0].id,
          class_date: formData.class_date,
          start_time: formData.start_time,
          duration: formData.duration,
          class_name: formData.class_name,
          session_type: formData.session_type,
          max_participants: formData.max_participants,
          is_cancelled: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Class added successfully",
      });

      // Reset form
      setFormData({
        class_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        start_time: '09:00',
        duration: 60,
        class_name: '',
        session_type: 'amateur',
        max_participants: 8
      });

      onAddClass();
      onClose();
    } catch (error: any) {
      console.error('Error adding class:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add class",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class_date">Date</Label>
              <Input
                id="class_date"
                type="date"
                value={formData.class_date}
                onChange={(e) => handleInputChange('class_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="180"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input
                id="max_participants"
                type="number"
                min="1"
                max="50"
                value={formData.max_participants}
                onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="class_name">Class Name</Label>
            <Input
              id="class_name"
              value={formData.class_name}
              onChange={(e) => handleInputChange('class_name', e.target.value)}
              placeholder="e.g., Morning Yoga, HIIT Training"
              required
            />
          </div>

          <div>
            <Label htmlFor="session_type">Session Type</Label>
            <Select 
              value={formData.session_type} 
              onValueChange={(value) => handleInputChange('session_type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amateur">Amateur</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Class
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}