import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Types
export interface ScheduleTemplate {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduleTemplateEntry {
  id: string;
  template_id: string;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  duration: number;
  class_name: string;
  session_type: 'pro' | 'amateur';
  max_participants: number;
}

export interface SchedulePeriod {
  id: string;
  template_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  template: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface LiveScheduleInstance {
  id: string;
  class_date: string;
  start_time: string;
  duration: number;
  class_name: string;
  session_type: 'pro' | 'amateur';
  max_participants: number;
  is_cancelled: boolean;
}

export interface TemplateWithEntries extends ScheduleTemplate {
  entries: ScheduleTemplateEntry[];
}

export function useUnifiedScheduleStore() {
  const [templates, setTemplates] = useState<TemplateWithEntries[]>([]);
  const [periods, setPeriods] = useState<SchedulePeriod[]>([]);
  const [liveInstances, setLiveInstances] = useState<LiveScheduleInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load all data
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        loadTemplates(),
        loadPeriods(),
        loadLiveInstances()
      ]);
    } catch (err) {
      console.error('Error loading schedule data:', err);
      setError('Failed to load schedule data');
      toast({
        title: "Error",
        description: "Failed to load schedule data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load templates with entries
  const loadTemplates = async () => {
    const { data: templatesData, error: templatesError } = await supabase
      .from('schedule_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (templatesError) throw templatesError;

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
  };

  // Load periods
  const loadPeriods = async () => {
    const { data, error } = await supabase
      .from('schedule_periods')
      .select(`
        *,
        template:schedule_templates(id, name, description)
      `)
      .eq('is_active', true)
      .order('start_date', { ascending: true });

    if (error) throw error;
    setPeriods(data || []);
  };

  // Load live instances
  const loadLiveInstances = async () => {
    const { data, error } = await supabase
      .from('live_schedule_instances')
      .select('*')
      .eq('is_cancelled', false)
      .gte('class_date', format(new Date(), 'yyyy-MM-dd'))
      .order('class_date')
      .order('start_time');

    if (error) throw error;
    setLiveInstances(data || []);
  };

  // Create template
  const createTemplate = async (templateData: { name: string; description?: string }) => {
    const { error } = await supabase
      .from('schedule_templates')
      .insert([templateData]);

    if (error) throw error;

    toast({
      title: "Success",
      description: "Template created successfully",
    });

    await loadTemplates();
  };

  // Create period with automatic instance generation
  const createPeriod = async (periodData: {
    template_id: string;
    start_date: string;
    end_date: string;
  }) => {
    // Insert the period
    const { data: newPeriod, error: periodError } = await supabase
      .from('schedule_periods')
      .insert([periodData])
      .select()
      .single();

    if (periodError) throw periodError;

    // Automatically generate instances
    const { error: generateError } = await supabase.functions.invoke('generate-schedule-instances', {
      body: { period_id: newPeriod.id }
    });

    if (generateError) {
      console.warn('Failed to auto-generate instances:', generateError);
      toast({
        title: "Warning",
        description: "Period created but instances need to be generated manually",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Period created and instances generated automatically",
      });
    }

    await Promise.all([loadPeriods(), loadLiveInstances()]);
  };

  // Delete template
  const deleteTemplate = async (templateId: string) => {
    const { error } = await supabase
      .from('schedule_templates')
      .update({ is_active: false })
      .eq('id', templateId);

    if (error) throw error;

    toast({
      title: "Success",
      description: "Template deleted successfully",
    });

    await loadTemplates();
  };

  // Delete period with instance cleanup
  const deletePeriod = async (periodId: string) => {
    try {
      // First delete all associated live schedule instances
      const { error: instancesError } = await supabase
        .from('live_schedule_instances')
        .delete()
        .eq('period_id', periodId);

      if (instancesError) {
        console.warn('Failed to delete instances for period:', instancesError);
        // Continue with period deletion even if instance cleanup fails
      }

      // Then deactivate the period
      const { error: periodError } = await supabase
        .from('schedule_periods')
        .update({ is_active: false })
        .eq('id', periodId);

      if (periodError) throw periodError;

      toast({
        title: "Success",
        description: "Period and associated instances deleted successfully",
      });

      await Promise.all([loadPeriods(), loadLiveInstances()]);
    } catch (error) {
      console.error('Error deleting period:', error);
      throw error;
    }
  };

  // Duplicate template
  const duplicateTemplate = async (template: TemplateWithEntries) => {
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

    await loadTemplates();
  };

  // Manual instance generation with force cleanup
  const generateInstances = async (periodId: string, forceCleanup = false) => {
    const { data, error } = await supabase.functions.invoke('generate-schedule-instances', {
      body: { period_id: periodId, force_cleanup: forceCleanup }
    });

    if (error) throw error;

    toast({
      title: "Success",
      description: `Generated ${data?.instances_count || 0} live schedule instances`,
    });

    await loadLiveInstances();
  };

  // Database cleanup function
  const cleanupOrphanedInstances = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-orphaned-instances');

      if (error) throw error;

      toast({
        title: "Success",
        description: `Cleaned up ${data?.cleaned_count || 0} orphaned instances`,
      });

      await loadLiveInstances();
    } catch (error) {
      console.error('Error cleaning up instances:', error);
      toast({
        title: "Error",
        description: "Failed to cleanup orphaned instances",
        variant: "destructive",
      });
    }
  };

  // Initialize data on mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Set up real-time subscriptions
  useEffect(() => {
    const templatesChannel = supabase
      .channel('schedule_templates_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'schedule_templates' },
        () => loadTemplates()
      )
      .subscribe();

    const periodsChannel = supabase
      .channel('schedule_periods_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'schedule_periods' },
        () => loadPeriods()
      )
      .subscribe();

    const instancesChannel = supabase
      .channel('live_schedule_instances_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'live_schedule_instances' },
        () => loadLiveInstances()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(templatesChannel);
      supabase.removeChannel(periodsChannel);
      supabase.removeChannel(instancesChannel);
    };
  }, []);

  return {
    // Data
    templates,
    periods,
    liveInstances,
    loading,
    error,
    
    // Actions
    createTemplate,
    createPeriod,
    deleteTemplate,
    deletePeriod,
    duplicateTemplate,
    generateInstances,
    cleanupOrphanedInstances,
    refreshData: loadAllData,
  };
}