import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, Calendar, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSessionLimits } from '@/hooks/useSessionLimits';
import { useClientPaymentStatus } from '@/hooks/useClientPaymentStatus';

interface ClientNavbarProps {
  activeTab: 'schedule' | 'bookings';
  onTabChange: (tab: 'schedule' | 'bookings') => void;
}

export const ClientNavbar: React.FC<ClientNavbarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const { sessionInfo, loading } = useSessionLimits();
  const paymentInfo = useClientPaymentStatus(user?.id, user?.monthlyRenewalDate);
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
            {sessionInfo && !loading && (
              <Badge 
                variant={sessionInfo.remainingSessions <= 2 ? "destructive" : "secondary"}
                className="text-xs font-semibold hidden sm:inline-flex"
              >
                {sessionInfo.usedSessions}/{sessionInfo.totalSessions} sessions
              </Badge>
            )}
            {paymentInfo && (
              <Badge 
                variant={paymentInfo.isOverdue || paymentInfo.isDueToday ? "destructive" : 
                        paymentInfo.isDueSoon ? "secondary" : "outline"}
                className="text-xs font-semibold hidden sm:inline-flex"
              >
                {paymentInfo.displayText}
              </Badge>
            )}
            <div className="hidden sm:flex items-center space-x-3">
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