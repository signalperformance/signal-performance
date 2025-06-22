
import { z } from 'zod';

export const appointmentFormSchema = z.object({
  customerName: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name cannot be longer than 50 characters." }),
  customerEmail: z.string().email({ message: "Please enter a valid email address." }),
  customerPhone: z.string().min(10, { message: "Please enter a valid phone number." }).max(20, { message: "Phone number is too long." }),
  appointmentDate: z.string().min(1, { message: "Please select a date." }),
  appointmentTime: z.string().min(1, { message: "Please select a time." }),
  notes: z.string().max(500, { message: "Notes cannot be longer than 500 characters." }).optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
