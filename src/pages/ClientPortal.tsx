import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ClientNavbar } from '@/components/client/ClientNavbar';
import { ClientScheduleView } from '@/components/client/ClientScheduleView';
import { MyBookings } from '@/components/client/MyBookings';
import { AccountDeactivatedModal } from '@/components/client/AccountDeactivatedModal';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export default function ClientPortal() {
  const { user, isAuthenticated, isLoadingProfile, profileError, isOnline, retryProfileLoad } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'schedule' | 'bookings'>('schedule');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/client/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-signal-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show loading if authenticated but user profile is still loading
  if (isAuthenticated && (!user || isLoadingProfile)) {
    // If there's an error and we're not actively loading, show error state
    if (profileError && !isLoadingProfile) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="flex justify-center">
              {isOnline ? (
                <AlertCircle className="w-16 h-16 text-destructive" />
              ) : (
                <WifiOff className="w-16 h-16 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                {isOnline ? 'Loading Error' : 'Connection Error'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {profileError}
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={retryProfileLoad}
                className="w-full"
                disabled={!isOnline}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              {!isOnline && (
                <p className="text-xs text-muted-foreground flex items-center justify-center">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Check your internet connection
                </p>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.removeItem('client-user');
                  navigate('/client/login');
                }}
                className="w-full mt-2"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    // Show loading spinner
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-signal-gold border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-muted-foreground">
            Loading your profile...
            {!isOnline && (
              <span className="flex items-center justify-center mt-1">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Show deactivated modal if user account is inactive
  if (!user.isActive) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-background">
          <AccountDeactivatedModal open={true} />
        </div>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <ClientNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'schedule' ? (
            <ClientScheduleView />
          ) : (
            <MyBookings />
          )}
        </main>
      </div>
    </LanguageProvider>
  );
}