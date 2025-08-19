import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/hooks/use-toast';
export function AdminHeader() {
  const {
    adminUser,
    logout
  } = useAdminAuth();
  const {
    toast
  } = useToast();
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  return <header className="h-14 md:h-16 border-b border-border bg-background flex items-center justify-between px-3 md:px-6">
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-lg md:text-xl font-semibold">Admin Portal</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-1 md:gap-2">
        <span className="text-xs md:text-sm text-muted-foreground hidden lg:block max-w-[120px] md:max-w-none truncate">
          {adminUser?.email}
        </span>
        <Button variant="ghost" size="sm" className="h-8 w-8 md:h-10 md:w-10" onClick={handleLogout}>
          <LogOut className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
      </div>
    </header>;
}