
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWaitlistDialog } from '@/hooks/useWaitlistDialog';
import { supabase } from '@/integrations/supabase/client';
import { waitlistDialogSchema, WaitlistDialogValues } from '@/lib/validations/waitlist';


const WaitlistDialog = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, closeWaitlist } = useWaitlistDialog();
  const [showFixedButton, setShowFixedButton] = useState(false);
  
  // Updated scroll event listener to check if the hero waitlist button is visible
  useEffect(() => {
    const handleScroll = () => {
      const waitlistButton = document.querySelector('#hero-waitlist-button');
      
      if (waitlistButton) {
        const buttonRect = waitlistButton.getBoundingClientRect();
        // Show fixed button when hero waitlist button is no longer visible in the viewport
        setShowFixedButton(
          buttonRect.bottom < 0 || // button is above viewport
          buttonRect.top > window.innerHeight // button is below viewport
        );
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const form = useForm<WaitlistDialogValues>({
    resolver: zodResolver(waitlistDialogSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: WaitlistDialogValues) => {
    setIsSubmitting(true);
    
    try {
      // Submit data to Supabase
      const { error } = await supabase
        .from('waitlist_entries')
        .insert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
          }
        ]);
      
      if (error) {
        console.error('Error submitting to waitlist:', error);
        toast({
          title: t('errors.generic'),
          description: error.message,
          variant: "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: t('waitlist.success'),
          duration: 5000,
        });
        form.reset();
        closeWaitlist();
      }
    } catch (err) {
      console.error('Exception when submitting to waitlist:', err);
      toast({
        title: t('errors.generic'),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Fixed Book Assessment button at bottom right - only shown when hero button is not visible */}
      {showFixedButton && (
        <div className="fixed bottom-8 right-8 z-40">
          <Button
            size="lg"
            asChild
            className="font-medium px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg text-signal-white bg-signal-gold hover:bg-signal-gold/90 active:bg-signal-gold focus:bg-signal-gold shadow-lg"
          >
            <a 
              href="https://lin.ee/CaWvRmo" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t('hero.cta.assessment')}
            </a>
          </Button>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={closeWaitlist}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t('waitlist.title')}</DialogTitle>
            <DialogDescription>
              {t('waitlist.subtitle')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('waitlist.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('waitlist.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('waitlist.phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-signal-gold hover:bg-signal-gold/90 text-black font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : t('waitlist.submit')}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div id="waitlist"></div>
    </>
  );
};

export default WaitlistDialog;
