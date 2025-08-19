
import { Calendar, Users, CalendarDays, CalendarCheck, CreditCard } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

type AdminSection = 'templates' | 'periods' | 'live-calendar' | 'users' | 'payments';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const menuItems = [
  {
    id: 'templates' as AdminSection,
    title: 'Schedule Templates',
    icon: Calendar,
  },
  {
    id: 'periods' as AdminSection,
    title: 'Schedule Periods',
    icon: CalendarDays,
  },
  {
    id: 'live-calendar' as AdminSection,
    title: 'Live Calendar',
    icon: CalendarCheck,
  },
  {
    id: 'users' as AdminSection,
    title: 'User Profiles',
    icon: Users,
  },
  {
    id: 'payments' as AdminSection,
    title: 'Payments',
    icon: CreditCard,
  },
];

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <Sidebar className="border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-signal-gold rounded-lg flex items-center justify-center">
            <span className="text-charcoal font-bold text-sm">S</span>
          </div>
          <div>
            <h2 className="font-semibold text-sm">Signal Admin</h2>
            <p className="text-xs text-muted-foreground">Management Portal</p>
          </div>
        </div>
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => onSectionChange(item.id)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
