import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AccountDeactivatedModalProps {
  open: boolean;
}

export const AccountDeactivatedModal: React.FC<AccountDeactivatedModalProps> = ({ open }) => {
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleContactSupport = () => {
    // Copy LINE contact info or open LINE if available
    navigator.clipboard.writeText('@yourlineaccount')
      .then(() => {
        toast({
          title: "Contact info copied",
          description: "LINE contact information has been copied to your clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Contact Support",
          description: "Please contact us via our official LINE channel: @yourlineaccount",
        });
      });
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
          <DialogTitle className="text-xl font-semibold">
            Account Temporarily Deactivated
          </DialogTitle>
          <DialogDescription className="text-center space-y-3 pt-2">
            <p>
              Your account has been temporarily deactivated. This typically occurs due to overdue membership payments.
            </p>
            <p>
              Please contact our support team via our official LINE channel to resolve this issue and reactivate your account.
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
            Contact Support via LINE
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          <p>Need immediate assistance? Contact us directly through our official LINE channel.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};