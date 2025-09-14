import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { LogOut, Calendar, BookOpen, Menu, User, Clock, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSessionLimits } from '@/hooks/useSessionLimits';
import { useClientPaymentStatus } from '@/hooks/useClientPaymentStatus';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface ClientNavbarProps {
  activeTab: 'schedule' | 'bookings';
  onTabChange: (tab: 'schedule' | 'bookings') => void;
}

export const ClientNavbar: React.FC<ClientNavbarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { sessionInfo, loading } = useSessionLimits();
  const paymentInfo = useClientPaymentStatus(user?.id, user?.monthlyRenewalDate);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: t('portal.nav.logout'),
      description: t('portal.toast.logoutSuccess') || 'See you next time!',
    });
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  const MobileUserInfo = () => (
    <div className="space-y-4">
      {/* Language Toggle - Mobile */}
      <div className="flex items-center justify-center space-x-1 p-3 bg-muted rounded-lg">
        <span className={`text-xs font-medium ${language === 'en' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>EN</span>
        <Switch 
          checked={language === 'zh'} 
          onCheckedChange={handleLanguageToggle}
          className="data-[state=checked]:bg-signal-gold data-[state=unchecked]:bg-signal-charcoal" 
        />
        <span className={`text-xs font-medium ${language === 'zh' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>中文</span>
      </div>

      <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-medium">{user?.firstName} {user?.lastName}</div>
          <div className="text-sm text-muted-foreground">{user?.playerType.toUpperCase()} {t('portal.user.member')}</div>
        </div>
      </div>

      <div className="space-y-3">
        {sessionInfo && !loading && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t('portal.user.sessionsUsed')}</span>
            </div>
            <Badge variant={sessionInfo.remainingSessions <= 2 ? "destructive" : "secondary"}>
              {sessionInfo.usedSessions}/{sessionInfo.totalSessions}
            </Badge>
          </div>
        )}

        {paymentInfo && (paymentInfo.isOverdue || paymentInfo.isDueToday || paymentInfo.isDueSoon) && (
          <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{t('portal.user.paymentStatus')}</span>
            </div>
            <Badge variant={paymentInfo.isOverdue || paymentInfo.isDueToday ? "destructive" : "secondary"}>
              {paymentInfo.displayText}
            </Badge>
          </div>
        )}
      </div>

      <Button onClick={handleLogout} variant="outline" className="w-full" size="lg">
        <LogOut className="h-4 w-4 mr-2" />
        {t('portal.nav.signOut')}
      </Button>
    </div>
  );

  return (
    <nav className="bg-card border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex-shrink-0">
                <img 
                  alt="Signal Performance Logo" 
                  className="h-full w-auto object-contain" 
                  src="/lovable-uploads/0959e8f0-e34c-4d16-9e3e-16462b6d8961.png" 
                />
              </div>
              <h1 className="text-xl font-bold text-foreground brand-font">
                {t('portal.title')}
              </h1>
            </div>
            
            <div className="hidden md:flex space-x-4">
              <Button
                variant={activeTab === 'schedule' ? 'default' : 'ghost'}
                onClick={() => onTabChange('schedule')}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {t('portal.nav.schedule')}
              </Button>
              <Button
                variant={activeTab === 'bookings' ? 'default' : 'ghost'}
                onClick={() => onTabChange('bookings')}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                {t('portal.nav.bookings')}
              </Button>
            </div>
          </div>

          {/* Desktop User Info */}
          <div className="hidden md:flex items-center space-x-4">
            {sessionInfo && !loading && (
              <Badge 
                variant={sessionInfo.remainingSessions <= 2 ? "destructive" : "secondary"}
                className="text-xs font-semibold"
              >
                {sessionInfo.usedSessions}/{sessionInfo.totalSessions} {t('portal.schedule.sessions')}
              </Badge>
            )}
            {paymentInfo && (paymentInfo.isOverdue || paymentInfo.isDueToday || paymentInfo.isDueSoon) && (
              <Badge 
                variant={paymentInfo.isOverdue || paymentInfo.isDueToday ? "destructive" : "secondary"}
                className="text-xs font-semibold"
              >
                {paymentInfo.displayText}
              </Badge>
            )}
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                <div className="text-muted-foreground">{user?.playerType.toUpperCase()} {t('portal.user.member')}</div>
              </div>
            </div>

            {/* Language Toggle - Desktop */}
            <div className="flex items-center space-x-2">
              <span className={`text-xs md:text-sm font-medium ${language === 'en' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>EN</span>
              <Switch 
                checked={language === 'zh'} 
                onCheckedChange={handleLanguageToggle}
                className="data-[state=checked]:bg-signal-gold data-[state=unchecked]:bg-signal-charcoal" 
              />
              <span className={`text-xs md:text-sm font-medium ${language === 'zh' ? 'text-signal-gold' : 'text-signal-charcoal'}`}>中文</span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="ml-2">{t('portal.nav.logout')}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>{t('portal.user.accountInfo')}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <MobileUserInfo />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile tab navigation */}
        <div className="md:hidden border-t bg-background">
          <div className="flex">
            <Button
              variant={activeTab === 'schedule' ? 'default' : 'ghost'}
              onClick={() => onTabChange('schedule')}
              className="flex-1 rounded-none justify-center gap-2 h-14 text-base"
            >
              <Calendar className="h-5 w-5" />
              {t('portal.nav.schedule')}
            </Button>
            <Button
              variant={activeTab === 'bookings' ? 'default' : 'ghost'}
              onClick={() => onTabChange('bookings')}
              className="flex-1 rounded-none justify-center gap-2 h-14 text-base"
            >
              <BookOpen className="h-5 w-5" />
              {t('portal.nav.bookings')}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};