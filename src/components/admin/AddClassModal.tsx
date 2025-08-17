import { useState } from 'react';
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
import { ScheduleEntry, DayOfWeek, ClassType, SessionType } from '@/types/admin';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClass: (classEntry: Omit<ScheduleEntry, 'id'>) => void;
  selectedDay: DayOfWeek;
}

export function AddClassModal({ isOpen, onClose, onAddClass, selectedDay }: AddClassModalProps) {
  const [formData, setFormData] = useState({
    dayOfWeek: selectedDay,
    startTime: '',
    endTime: '',
    classType: 'mobility' as ClassType,
    sessionType: 'amateur' as SessionType,
    maxParticipants: 8,
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClass(formData);
    setFormData({
      dayOfWeek: selectedDay,
      startTime: '',
      endTime: '',
      classType: 'mobility',
      sessionType: 'amateur',
      maxParticipants: 8,
      isActive: true,
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Create a new class for {selectedDay}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Day</Label>
            <Select
              value={formData.dayOfWeek}
              onValueChange={(value) => handleInputChange('dayOfWeek', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                required
              />
            </div>
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
                <SelectItem value="mobility">Mobility</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="power">Power</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionType">Session Type</Label>
            <Select
              value={formData.sessionType}
              onValueChange={(value) => handleInputChange('sessionType', value)}
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
              value={formData.maxParticipants}
              onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Class</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}