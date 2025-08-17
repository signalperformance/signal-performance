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
import { ScheduleEntry } from '@/types/admin';
import { useState } from 'react';

interface ScheduleTemplate {
  name: string;
  schedule: ScheduleEntry[];
}

interface ScheduleTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTemplate: (template: ScheduleTemplate) => void;
  onLoadTemplate: (schedule: ScheduleEntry[]) => void;
  currentSchedule: ScheduleEntry[];
  savedTemplates: ScheduleTemplate[];
}

export function ScheduleTemplateModal({ 
  isOpen, 
  onClose, 
  onSaveTemplate, 
  onLoadTemplate, 
  currentSchedule,
  savedTemplates 
}: ScheduleTemplateModalProps) {
  const [templateName, setTemplateName] = useState('');
  const [mode, setMode] = useState<'save' | 'load'>('save');

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    onSaveTemplate({
      name: templateName,
      schedule: currentSchedule,
    });

    setTemplateName('');
    onClose();
  };

  const handleLoadTemplate = (template: ScheduleTemplate) => {
    onLoadTemplate(template.schedule);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Schedule Templates</DialogTitle>
          <DialogDescription>
            Save your current schedule as a template or load a saved template.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={mode === 'save' ? 'default' : 'outline'}
              onClick={() => setMode('save')}
              className="flex-1"
            >
              Save Current
            </Button>
            <Button 
              variant={mode === 'load' ? 'default' : 'outline'}
              onClick={() => setMode('load')}
              className="flex-1"
            >
              Load Template
            </Button>
          </div>

          {mode === 'save' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Standard Weekly Schedule"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Current schedule has {currentSchedule.length} classes
              </p>
            </div>
          )}

          {mode === 'load' && (
            <div className="space-y-3">
              {savedTemplates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No saved templates yet
                </p>
              ) : (
                savedTemplates.map((template, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {template.schedule.length} classes
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleLoadTemplate(template)}
                    >
                      Load
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {mode === 'save' && (
            <Button onClick={handleSaveTemplate}>
              Save Template
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}