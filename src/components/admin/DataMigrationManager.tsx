import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Database, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const DataMigrationManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any>(null);

  const runMigration = async () => {
    setIsLoading(true);
    setMigrationResult(null);

    try {
      console.log('Starting migration...');
      
      const { data, error } = await supabase.functions.invoke('migrate-schedule-to-live-system');

      if (error) {
        console.error('Migration error:', error);
        throw error;
      }

      console.log('Migration completed:', data);
      setMigrationResult(data);
      
      toast.success('Migration completed successfully!');
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error('Migration failed: ' + (error as Error).message);
      setMigrationResult({ success: false, error: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Migration
          </CardTitle>
          <CardDescription>
            Migrate existing schedule data to the new live calendar system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This will migrate your existing schedule entries to the new live calendar system. 
              This process creates schedule templates, periods, and live instances for the next 4 weeks.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={runMigration} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Migration...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Run Migration
              </>
            )}
          </Button>

          {migrationResult && (
            <Alert className={migrationResult.success ? "border-green-500" : "border-red-500"}>
              {migrationResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription>
                {migrationResult.success ? (
                  <div>
                    <p className="font-semibold text-green-700">Migration Successful!</p>
                    <ul className="mt-2 text-sm text-green-600">
                      <li>• Template ID: {migrationResult.template_id}</li>
                      <li>• Period ID: {migrationResult.period_id}</li>
                      <li>• Live instances created: {migrationResult.live_instances_created}</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-red-700">Migration Failed</p>
                    <p className="mt-1 text-sm text-red-600">{migrationResult.error}</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};