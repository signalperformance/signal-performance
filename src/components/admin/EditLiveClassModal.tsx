import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LiveScheduleInstance {
  id: string;
  class_date: string;
  start_time: string;
  duration: number;
  class_name: string;
  session_type: 'pro' | 'amateur';
  max_participants: number;
  is_cancelled: boolean;
}

interface EditLiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInstance: LiveScheduleInstance | null;
  onUpdateClass: () => void;
  bookingCount?: number;
}

export function EditLiveClassModal({ 
  isOpen, 
  onClose, 
  classInstance, 
  onUpdateClass,
  bookingCount = 0
}: EditLiveClassModalProps) {
  const [formData, setFormData] = useState({
    class_date: '',
    start_time: '',
    duration: 60,
    class_name: '',
    session_type: 'amateur' as 'pro' | 'amateur',
    max_participants: 8,
    is_cancelled: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (classInstance) {
      setFormData({
        class_date: classInstance.class_date,
        start_time: classInstance.start_time,
        duration: classInstance.duration,
        class_name: classInstance.class_name,
        session_type: classInstance.session_type,
        max_participants: classInstance.max_participants,
        is_cancelled: classInstance.is_cancelled
      });
      setShowCancelWarning(false);
    }
  }, [classInstance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classInstance) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('live_schedule_instances')
        .update({
          class_date: formData.class_date,
          start_time: formData.start_time,
          duration: formData.duration,
          class_name: formData.class_name,
          session_type: formData.session_type,
          max_participants: formData.max_participants,
          is_cancelled: formData.is_cancelled
        })
        .eq('id', classInstance.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: formData.is_cancelled ? "Class cancelled successfully" : "Class updated successfully",
      });

      onUpdateClass();
      onClose();
    } catch (error) {
      console.error('Error updating class:', error);
      toast({
        title: "Error",
        description: "Failed to update class",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(prev => ({ ...prev, is_cancelled: true }));
    setShowCancelWarning(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'is_cancelled' && !value) {
      setShowCancelWarning(false);
    }
  };

  if (!classInstance) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Live Class</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {bookingCount > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This class has {bookingCount} booking(s). Changes may affect booked users.
              </AlertDescription>
            </Alert>
          )}

          {showCancelWarning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Cancelling this class will affect {bookingCount} booking(s). Users should be notified separately.
              </AlertDescription>
            </Alert>
          )}

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

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {!formData.is_cancelled && bookingCount === 0 && (
              <Button type="button" variant="destructive" onClick={handleCancel}>
                Cancel Class
              </Button>
            )}
            {formData.is_cancelled && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleInputChange('is_cancelled', false)}
              >
                Uncancel Class
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Class
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}