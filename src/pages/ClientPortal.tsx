import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ClientNavbar } from '@/components/client/ClientNavbar';
import { ClientScheduleView } from '@/components/client/ClientScheduleView';
import { MyBookings } from '@/components/client/MyBookings';
import { AccountDeactivatedModal } from '@/components/client/AccountDeactivatedModal';

export default function ClientPortal() {
  const { user, isAuthenticated, isLoadingProfile } = useAuth();
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-signal-gold border-t-transparent rounded-full"></div>
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