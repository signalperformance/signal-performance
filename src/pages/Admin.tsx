import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { WeeklyScheduleManager } from '@/components/admin/WeeklyScheduleManager';
import { UserProfilesManager } from '@/components/admin/UserProfilesManager';

type AdminSection = 'schedule' | 'users';

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('schedule');

  const renderContent = () => {
    switch (activeSection) {
      case 'schedule':
        return <WeeklyScheduleManager />;
      case 'users':
        return <UserProfilesManager />;
      default:
        return <WeeklyScheduleManager />;
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