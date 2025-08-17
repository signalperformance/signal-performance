import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Calendar, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClientNavbarProps {
  activeTab: 'schedule' | 'bookings';
  onTabChange: (tab: 'schedule' | 'bookings') => void;
}

export const ClientNavbar: React.FC<ClientNavbarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
  };

  return (
    <nav className="bg-card border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-heading font-semibold text-foreground">
              Training Portal
            </div>
            
            <div className="hidden md:flex space-x-4">
              <Button
                variant={activeTab === 'schedule' ? 'default' : 'ghost'}
                onClick={() => onTabChange('schedule')}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
              <Button
                variant={activeTab === 'bookings' ? 'default' : 'ghost'}
                onClick={() => onTabChange('bookings')}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                My Bookings
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                <div className="text-muted-foreground capitalize">{user?.membershipPlan} Member</div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile tab navigation */}
        <div className="md:hidden border-t bg-background">
          <div className="flex">
            <Button
              variant={activeTab === 'schedule' ? 'default' : 'ghost'}
              onClick={() => onTabChange('schedule')}
              className="flex-1 rounded-none justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
            <Button
              variant={activeTab === 'bookings' ? 'default' : 'ghost'}
              onClick={() => onTabChange('bookings')}
              className="flex-1 rounded-none justify-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              My Bookings
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};