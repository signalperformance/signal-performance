import { Calendar, Users, CreditCard } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
type AdminSection = 'schedule' | 'users' | 'payments';
interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}
const menuItems = [{
  id: 'schedule' as AdminSection,
  title: 'Schedule Management',
  icon: Calendar
}, {
  id: 'users' as AdminSection,
  title: 'User Profiles',
  icon: Users
}, {
  id: 'payments' as AdminSection,
  title: 'Payments',
  icon: CreditCard
}];
export function AdminSidebar({
  activeSection,
  onSectionChange
}: AdminSidebarProps) {
  return <Sidebar className="border-r border-border" collapsible="icon">
      <div className="p-3 md:p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-signal-gold rounded-lg flex items-center justify-center">
            <span className="text-charcoal font-bold text-xs md:text-sm">S</span>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="font-semibold text-xs md:text-sm">Signal Performance</h2>
            <p className="text-xs text-muted-foreground">Management Portal</p>
          </div>
        </div>
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeSection === item.id} 
                    onClick={() => onSectionChange(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}