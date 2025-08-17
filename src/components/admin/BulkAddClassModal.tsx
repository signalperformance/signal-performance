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
import { Checkbox } from '@/components/ui/checkbox';
import { ScheduleEntry, DayOfWeek, ClassType, SessionType } from '@/types/admin';

const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface BulkAddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClasses: (classEntries: Omit<ScheduleEntry, 'id'>[]) => void;
}

export function BulkAddClassModal({ isOpen, onClose, onAddClasses }: BulkAddClassModalProps) {
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [formData, setFormData] = useState({
    startTime: '',
    duration: 60,
    classType: 'mobility' as ClassType,
    sessionType: 'amateur' as SessionType,
    maxParticipants: 3,
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDays.length === 0) {
      alert('Please select at least one day');
      return;
    }

    const newClasses = selectedDays.map(day => ({
      dayOfWeek: day,
      startTime: formData.startTime,
      duration: formData.duration,
      classType: formData.classType,
      sessionType: formData.sessionType,
      maxParticipants: formData.maxParticipants,
      isActive: formData.isActive,
    }));

    onAddClasses(newClasses);
    
    // Reset form
    setSelectedDays([]);
    setFormData({
      startTime: '',
      duration: 60,
      classType: 'mobility',
      sessionType: 'amateur',
      maxParticipants: 3,
      isActive: true,
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDayToggle = (day: DayOfWeek, checked: boolean) => {
    if (checked) {
      setSelectedDays(prev => [...prev, day]);
    } else {
      setSelectedDays(prev => prev.filter(d => d !== day));
    }
  };

  const selectAllWeekdays = () => {
    setSelectedDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  };

  const selectWeekend = () => {
    setSelectedDays(['saturday', 'sunday']);
  };

  const selectAllDays = () => {
    setSelectedDays([...daysOfWeek]);
  };

  const clearSelection = () => {
    setSelectedDays([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Recurring Class</DialogTitle>
          <DialogDescription>
            Create the same class across multiple days of the week.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Day Selection */}
          <div className="space-y-3">
            <Label>Select Days</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              <Button type="button" variant="outline" size="sm" onClick={selectAllWeekdays}>
                Weekdays
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={selectWeekend}>
                Weekend
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={selectAllDays}>
                All Days
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={clearSelection}>
                Clear
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={day}
                    checked={selectedDays.includes(day)}
                    onCheckedChange={(checked) => handleDayToggle(day, checked as boolean)}
                  />
                  <Label htmlFor={day} className="capitalize font-normal">
                    {day}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Time Selection */}
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
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="180"
                step="15"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Class Details */}
          <div className="grid grid-cols-2 gap-4">
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
            <Button type="submit">
              Add to {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}