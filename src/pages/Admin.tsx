
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { UnifiedScheduleManager } from '@/components/admin/UnifiedScheduleManager';
import { UserProfilesManager } from '@/components/admin/UserProfilesManager';
import { PaymentsManager } from '@/components/admin/PaymentsManager';

type AdminSection = 'schedule' | 'users' | 'payments';

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('schedule');

  const renderContent = () => {
    switch (activeSection) {
      case 'schedule':
        return <UnifiedScheduleManager />;
      case 'users':
        return <UserProfilesManager />;
      case 'payments':
        return <PaymentsManager />;
      default:
        return <UnifiedScheduleManager />;
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
