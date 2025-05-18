
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(5, { message: "Please enter a valid phone number." }),
  handicap: z.string(),
  goals: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const WaitlistForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      handicap: "",
      goals: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', data);
      toast({
        title: t('waitlist.success'),
        duration: 5000,
      });
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="waitlist" className="section-padding bg-signal-charcoal text-white">
      <div className="container mx-auto container-padding">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">{t('waitlist.title')}</h2>
            <p className="text-lg text-white/80">{t('waitlist.subtitle')}</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('waitlist.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="bg-white/10 border-signal-gold/50 text-white" />
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
                      <Input placeholder="" {...field} className="bg-white/10 border-signal-gold/50 text-white" type="email" />
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
                      <Input placeholder="" {...field} className="bg-white/10 border-signal-gold/50 text-white" type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="handicap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('waitlist.handicap')}</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="bg-white/10 border-signal-gold/50 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('waitlist.goals')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="" 
                        {...field} 
                        className="bg-white/10 border-signal-gold/50 text-white resize-none" 
                        rows={4}
                      />
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
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;
