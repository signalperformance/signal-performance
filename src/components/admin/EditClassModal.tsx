import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type SessionType = 'pro' | 'amateur';

interface ScheduleEntry {
  id: string;
  day_of_week: string;
  start_time: string;
  duration: number;
  class_name: string;
  session_type: SessionType;
  max_participants: number;
  is_active: boolean;
}

interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classEntry: ScheduleEntry | null;
  onUpdateClass: (updatedClass: ScheduleEntry) => void;
}

export function EditClassModal({ isOpen, onClose, classEntry, onUpdateClass }: EditClassModalProps) {
  const [formData, setFormData] = useState({
    startTime: '',
    duration: 60,
    className: '',
    sessionType: 'amateur' as SessionType,
    maxParticipants: 8,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (classEntry) {
      setFormData({
        startTime: classEntry.start_time,
        duration: classEntry.duration || 60,
        className: classEntry.class_name,
        sessionType: classEntry.session_type,
        maxParticipants: classEntry.max_participants || 8,
      });
    }
  }, [classEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classEntry) return;

    setIsLoading(true);
    
    try {
      const updatedClass = {
        ...classEntry,
        start_time: formData.startTime,
        duration: formData.duration,
        class_name: formData.className,
        session_type: formData.sessionType,
        max_participants: formData.maxParticipants,
      };

      const { error } = await supabase
        .from('schedule_entries')
        .update({
          start_time: updatedClass.start_time,
          duration: updatedClass.duration,
          class_name: updatedClass.class_name,
          session_type: updatedClass.session_type,
          max_participants: updatedClass.max_participants,
        })
        .eq('id', updatedClass.id);

      if (error) throw error;

      onUpdateClass(updatedClass);
      toast({
        title: "Class updated",
        description: "The class has been updated successfully.",
      });
      onClose();
    } catch (error) {
      console.error('Failed to update class:', error);
      toast({
        title: "Error",
        description: "Failed to update class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!classEntry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>
            Modify the class details for {classEntry.day_of_week}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="15"
              max="180"
              step="15"
              value={formData.duration || ''}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="className">Class Name</Label>
            <Input
              id="className"
              type="text"
              value={formData.className}
              onChange={(e) => handleInputChange('className', e.target.value)}
              placeholder="e.g., MOBILITY (PRO)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionType">Session Type</Label>
            <Select
              value={formData.sessionType}
              onValueChange={(value) => handleInputChange('sessionType', value as SessionType)}
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

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Max Participants</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              max="20"
              value={formData.maxParticipants || ''}
              onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 8)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full"></div>
                  Updating...
                </div>
              ) : (
                'Update Class'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}