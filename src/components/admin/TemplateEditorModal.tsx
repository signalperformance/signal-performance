import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TemplateBulkAddClassModal } from './TemplateBulkAddClassModal';
import { EditTemplateClassModal } from './EditTemplateClassModal';

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type SessionType = 'pro' | 'amateur';

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

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: string;
    name: string;
    description?: string;
  } | null;
  onTemplateUpdated: () => void;
}

const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function TemplateEditorModal({ isOpen, onClose, template, onTemplateUpdated }: TemplateEditorModalProps) {
  const [entries, setEntries] = useState<ScheduleTemplateEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ScheduleTemplateEntry | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (template && isOpen) {
      loadTemplateEntries();
    }
  }, [template, isOpen]);

  const loadTemplateEntries = async () => {
    if (!template) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedule_template_entries')
        .select('*')
        .eq('template_id', template.id)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading template entries:', error);
      toast({
        title: "Error",
        description: "Failed to load template entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClasses = async (newEntries: Omit<ScheduleTemplateEntry, 'id' | 'template_id'>[]) => {
    if (!template) return;

    try {
      const entriesToInsert = newEntries.map(entry => ({
        ...entry,
        template_id: template.id
      }));

      const { error } = await supabase
        .from('schedule_template_entries')
        .insert(entriesToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Added ${newEntries.length} class${newEntries.length > 1 ? 'es' : ''} to template`,
      });

      loadTemplateEntries();
      onTemplateUpdated();
    } catch (error) {
      console.error('Error adding classes:', error);
      toast({
        title: "Error",
        description: "Failed to add classes",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEntry = async (updatedEntry: ScheduleTemplateEntry) => {
    try {
      const { error } = await supabase
        .from('schedule_template_entries')
        .update({
          start_time: updatedEntry.start_time,
          duration: updatedEntry.duration,
          class_name: updatedEntry.class_name,
          session_type: updatedEntry.session_type,
          max_participants: updatedEntry.max_participants,
        })
        .eq('id', updatedEntry.id);

      if (error) throw error;

      setEntries(prev => prev.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ));

      toast({
        title: "Success",
        description: "Class updated successfully",
      });

      onTemplateUpdated();
    } catch (error) {
      console.error('Error updating entry:', error);
      toast({
        title: "Error",
        description: "Failed to update class",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('schedule_template_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      
      toast({
        title: "Success",
        description: "Class deleted successfully",
      });

      onTemplateUpdated();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayEntries = (day: DayOfWeek) => {
    return entries
      .filter(entry => entry.day_of_week === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const getClassTypeColor = (className: string) => {
    const type = className.toLowerCase();
    if (type.includes('mobility')) return 'bg-green-100 text-green-800 border-green-200';
    if (type.includes('strength')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (type.includes('cardio')) return 'bg-red-100 text-red-800 border-red-200';
    if (type.includes('power')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!template) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template: {template.name}</DialogTitle>
            <DialogDescription>
              Add and manage classes for this template. Changes will apply to future schedule periods using this template.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {entries.length} classes total
                </Badge>
              </div>
              <Button onClick={() => setShowBulkAdd(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Classes
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading template...</div>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="space-y-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-center py-2 bg-muted rounded">
                      {day}
                    </h3>
                    <div className="space-y-2 min-h-[200px]">
                      {getDayEntries(day).map((entry) => (
                        <div 
                          key={entry.id} 
                          className={`p-3 rounded-lg border ${getClassTypeColor(entry.class_name)} transition-all hover:shadow-sm`}
                        >
                          <div className="space-y-2">
                            <div className="font-medium text-sm">
                              {formatTime(entry.start_time)}
                            </div>
                            <div className="text-xs font-medium">
                              {entry.class_name}
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge 
                                variant={entry.session_type === 'pro' ? 'default' : 'secondary'} 
                                className="text-xs"
                              >
                                {entry.session_type}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {entry.max_participants} max
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingEntry(entry)}
                                className="h-6 px-2"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="h-6 px-2 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {getDayEntries(day).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No classes
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <TemplateBulkAddClassModal
        isOpen={showBulkAdd}
        onClose={() => setShowBulkAdd(false)}
        onAddClasses={handleAddClasses}
      />

      <EditTemplateClassModal
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        entry={editingEntry}
        onUpdateEntry={handleUpdateEntry}
      />
    </>
  );
}