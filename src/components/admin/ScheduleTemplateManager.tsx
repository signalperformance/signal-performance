import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TemplateEditorModal } from './TemplateEditorModal';

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type SessionType = 'pro' | 'amateur';

interface ScheduleTemplate {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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

interface TemplateWithEntries extends ScheduleTemplate {
  entries: ScheduleTemplateEntry[];
}

const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function ScheduleTemplateManager() {
  const [templates, setTemplates] = useState<TemplateWithEntries[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateWithEntries | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string; description?: string } | null>(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '' });
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      
      // Load templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('schedule_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;

      // Load template entries for each template
      const templatesWithEntries = await Promise.all(
        (templatesData || []).map(async (template) => {
          const { data: entries, error: entriesError } = await supabase
            .from('schedule_template_entries')
            .select('*')
            .eq('template_id', template.id)
            .order('day_of_week')
            .order('start_time');

          if (entriesError) throw entriesError;

          return {
            ...template,
            entries: entries || []
          };
        })
      );

      setTemplates(templatesWithEntries);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load schedule templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async () => {
    if (!newTemplate.name.trim()) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('schedule_templates')
        .insert([{
          name: newTemplate.name,
          description: newTemplate.description
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template created successfully",
      });

      setNewTemplate({ name: '', description: '' });
      setShowCreateDialog(false);
      loadTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    }
  };

  const duplicateTemplate = async (template: TemplateWithEntries) => {
    try {
      // Create new template
      const { data: newTemplateData, error: templateError } = await supabase
        .from('schedule_templates')
        .insert([{
          name: `${template.name} (Copy)`,
          description: template.description
        }])
        .select()
        .single();

      if (templateError) throw templateError;

      // Copy all entries
      if (template.entries.length > 0) {
        const entriesToCopy = template.entries.map(entry => ({
          template_id: newTemplateData.id,
          day_of_week: entry.day_of_week,
          start_time: entry.start_time,
          duration: entry.duration,
          class_name: entry.class_name,
          session_type: entry.session_type,
          max_participants: entry.max_participants
        }));

        const { error: entriesError } = await supabase
          .from('schedule_template_entries')
          .insert(entriesToCopy);

        if (entriesError) throw entriesError;
      }

      toast({
        title: "Success",
        description: "Template duplicated successfully",
      });

      loadTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate template",
        variant: "destructive",
      });
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('schedule_templates')
        .update({ is_active: false })
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template deleted successfully",
      });

      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
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

  const getDaySchedule = (template: TemplateWithEntries, day: DayOfWeek) => {
    return template.entries
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

  const handleEditTemplate = (template: TemplateWithEntries) => {
    setSelectedTemplate({
      id: template.id,
      name: template.name,
      description: template.description
    });
    setShowTemplateEditor(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Templates</h1>
          <p className="text-muted-foreground">Create and manage reusable weekly schedule templates</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  {template.description && (
                    <CardDescription>{template.description}</CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {template.entries.length} classes
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => duplicateTemplate(template)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteTemplate(template.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="space-y-2">
                    <h4 className="font-medium text-sm capitalize">{day}</h4>
                    <div className="space-y-1">
                      {getDaySchedule(template, day).map((entry) => (
                        <div key={entry.id} className={`p-2 rounded text-xs border ${getClassTypeColor(entry.class_name)}`}>
                          <div className="font-medium">{formatTime(entry.start_time)}</div>
                          <div className="text-xs font-medium">{entry.class_name}</div>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant={entry.session_type === 'pro' ? 'default' : 'secondary'} className="text-xs">
                              {entry.session_type}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {entry.max_participants} max
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {templates.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No templates found. Create your first template to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a new schedule template that can be reused for different time periods.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Standard Week, Holiday Schedule"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this template"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createTemplate}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TemplateEditorModal
        isOpen={showTemplateEditor}
        onClose={() => setShowTemplateEditor(false)}
        template={selectedTemplate}
        onTemplateUpdated={loadTemplates}
      />
    </div>
  );
}