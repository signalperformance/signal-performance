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

type SessionType = 'pro' | 'amateur';
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface ScheduleTemplateEntry {
  id: string;
  template_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  duration: number;
  class_name: string;
  session_type: SessionType;
  max_participants: number;
}

interface EditTemplateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: ScheduleTemplateEntry | null;
  onUpdateEntry: (updatedEntry: ScheduleTemplateEntry) => void;
}

export function EditTemplateClassModal({ isOpen, onClose, entry, onUpdateEntry }: EditTemplateClassModalProps) {
  const [formData, setFormData] = useState({
    startTime: '',
    duration: 60,
    classType: 'Mobility',
    sessionType: 'amateur' as SessionType,
    maxParticipants: 8,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      // Extract class type from class name (now without suffixes)
      const classType = entry.class_name.charAt(0) + entry.class_name.slice(1).toLowerCase();
      
      setFormData({
        startTime: entry.start_time,
        duration: entry.duration || 60,
        classType: classType,
        sessionType: entry.session_type,
        maxParticipants: entry.max_participants || 8,
      });
    }
  }, [entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entry) return;

    setIsLoading(true);
    
    try {
      const className = formData.classType.toUpperCase();
      
      const updatedEntry = {
        ...entry,
        start_time: formData.startTime,
        duration: formData.duration,
        class_name: className,
        session_type: formData.sessionType,
        max_participants: formData.maxParticipants,
      };

      onUpdateEntry(updatedEntry);
      onClose();
    } catch (error) {
      console.error('Failed to update entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!entry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>
            Modify the class details for {entry.day_of_week}.
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
            <Label htmlFor="classType">Class Type</Label>
            <Select
              value={formData.classType}
              onValueChange={(value) => handleInputChange('classType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mobility">Mobility</SelectItem>
                <SelectItem value="Strength">Strength</SelectItem>
                <SelectItem value="Cardio">Cardio</SelectItem>
                <SelectItem value="Power">Power</SelectItem>
              </SelectContent>
            </Select>
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