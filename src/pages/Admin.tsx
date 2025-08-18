import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ScheduleTemplateManager } from '@/components/admin/ScheduleTemplateManager';
import { SchedulePeriodsManager } from '@/components/admin/SchedulePeriodsManager';
import { LiveCalendarView } from '@/components/admin/LiveCalendarView';
import { DataMigrationManager } from '@/components/admin/DataMigrationManager';
import { UserProfilesManager } from '@/components/admin/UserProfilesManager';

type AdminSection = 'templates' | 'periods' | 'live-calendar' | 'users' | 'migration';

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('migration');

  const renderContent = () => {
    switch (activeSection) {
      case 'templates':
        return <ScheduleTemplateManager />;
      case 'periods':
        return <SchedulePeriodsManager />;
      case 'live-calendar':
        return <LiveCalendarView />;
      case 'users':
        return <UserProfilesManager />;
      case 'migration':
        return <DataMigrationManager />;
      default:
        return <DataMigrationManager />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">
              {renderContent()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;