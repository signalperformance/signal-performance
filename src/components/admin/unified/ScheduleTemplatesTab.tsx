import { useState } from 'react';
import { Plus, Edit2, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUnifiedScheduleStore } from '@/hooks/useUnifiedScheduleStore';
import { TemplateEditorModal } from '../TemplateEditorModal';

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function ScheduleTemplatesTab() {
  const {
    templates,
    createTemplate,
    deleteTemplate,
    duplicateTemplate,
  } = useUnifiedScheduleStore();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string; description?: string } | null>(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '' });

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim()) return;

    try {
      await createTemplate(newTemplate);
      setNewTemplate({ name: '', description: '' });
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate({
      id: template.id,
      name: template.name,
      description: template.description
    });
    setShowTemplateEditor(true);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDaySchedule = (template: any, day: DayOfWeek) => {
    return template.entries
      .filter((entry: any) => entry.day_of_week === day)
      .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
  };

  const getSessionTypeColor = (sessionType: string) => {
    if (sessionType === 'pro') return 'bg-yellow-100 text-yellow-900 border-yellow-300';
    return 'bg-blue-100 text-blue-900 border-blue-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Schedule Templates</h2>
          <p className="text-muted-foreground">Create and manage reusable weekly schedule patterns</p>
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
                      {getDaySchedule(template, day).map((entry: any) => (
                        <div key={entry.id} className={`p-2 rounded text-xs border ${getSessionTypeColor(entry.session_type)}`}>
                          <div className="font-medium">{formatTime(entry.start_time)}</div>
                          <div className="text-xs font-medium">{entry.class_name}</div>
                          <div className="flex items-center justify-end mt-1">
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
            <Button onClick={handleCreateTemplate}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TemplateEditorModal
        isOpen={showTemplateEditor}
        onClose={() => setShowTemplateEditor(false)}
        template={selectedTemplate}
        onTemplateUpdated={() => {}} // Handled by real-time updates
      />
    </div>
  );
}