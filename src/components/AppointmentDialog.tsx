
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { useAppointmentDialog } from '@/hooks/useAppointmentDialog';
import { supabase } from '@/integrations/supabase/client';
import { appointmentFormSchema, AppointmentFormValues } from '@/lib/validations/appointment';
import { format, addDays, isSameDay, isAfter, startOfDay } from 'date-fns';

const AppointmentDialog = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { isOpen, closeAppointment } = useAppointmentDialog();
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
    },
  });

  // Generate available time slots (9 AM to 6 PM, hourly)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    return slots;
  };

  useEffect(() => {
    if (selectedDate) {
      // In a real implementation, you'd check Google Calendar for conflicts
      // For now, we'll show all available slots
      setAvailableSlots(generateTimeSlots());
      form.setValue('appointmentDate', format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, form]);

  useEffect(() => {
    if (selectedTime) {
      form.setValue('appointmentTime', selectedTime);
    }
  }, [selectedTime, form]);

  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true);
    
    try {
      // First, check availability with Google Calendar
      const availabilityResponse = await supabase.functions.invoke('google-calendar', {
        body: {
          action: 'checkAvailability',
          date: data.appointmentDate,
          timeSlot: data.appointmentTime
        }
      });

      if (availabilityResponse.error) {
        throw new Error('Failed to check availability');
      }

      if (!availabilityResponse.data.available) {
        toast({
          title: 'Time Slot Unavailable',
          description: 'This time slot is no longer available. Please select another time.',
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      // Create the appointment in database
      const { error: dbError } = await supabase
        .from('appointments')
        .insert([
          {
            customer_name: data.customerName,
            customer_email: data.customerEmail,
            customer_phone: data.customerPhone,
            appointment_date: data.appointmentDate,
            appointment_time: data.appointmentTime,
            notes: data.notes,
          }
        ]);
      
      if (dbError) {
        console.error('Error creating appointment:', dbError);
        throw new Error('Failed to create appointment');
      }

      // Create event in Google Calendar
      const calendarResponse = await supabase.functions.invoke('google-calendar', {
        body: {
          action: 'createEvent',
          appointmentData: {
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            appointmentDate: data.appointmentDate,
            appointmentTime: data.appointmentTime,
            notes: data.notes
          }
        }
      });

      if (calendarResponse.error) {
        console.error('Calendar integration error:', calendarResponse.error);
        // Don't fail the whole process if calendar fails
      }

      toast({
        title: 'Appointment Booked!',
        description: 'Your assessment appointment has been scheduled. You will receive a confirmation email shortly.',
        duration: 5000,
      });
      
      form.reset();
      setSelectedDate(undefined);
      setSelectedTime('');
      closeAppointment();
      
    } catch (err) {
      console.error('Exception when booking appointment:', err);
      toast({
        title: 'Booking Failed',
        description: 'There was an error booking your appointment. Please try again.',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tomorrow = addDays(new Date(), 1);

  return (
    <Dialog open={isOpen} onOpenChange={closeAppointment}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book Your Assessment</DialogTitle>
          <DialogDescription>
            Schedule your personalized golf assessment session
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Any specific requests or information" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date and Time Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Date & Time</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Choose Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => 
                      date < tomorrow || 
                      date.getDay() === 0 || 
                      date.getDay() === 6
                    }
                    className="rounded-md border"
                  />
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Available Times</label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={selectedTime === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(slot)}
                          className="text-sm"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeAppointment}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-signal-gold hover:bg-signal-gold/90 text-black font-semibold"
                disabled={isSubmitting || !selectedDate || !selectedTime}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </div>
                ) : (
                  'Book Appointment'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
