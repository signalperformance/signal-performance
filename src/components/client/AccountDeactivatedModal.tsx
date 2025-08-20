import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AccountDeactivatedModalProps {
  open: boolean;
}

export const AccountDeactivatedModal: React.FC<AccountDeactivatedModalProps> = ({ open }) => {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleContactSupport = () => {
    // Open LINE page in new tab
    window.open('https://page.line.me/116wwdfe', '_blank');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle className="text-xl font-semibold text-center">
            {t('client.account.deactivated')}
          </DialogTitle>
          <DialogDescription className="text-center space-y-3 pt-2">
            <p>
              {t('client.account.deactivatedMessage')}
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={handleContactSupport}
            className="w-full"
            variant="default"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {t('client.account.contactSupport')}
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('client.account.logout')}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          <p>{t('client.account.deactivatedMessage')}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};