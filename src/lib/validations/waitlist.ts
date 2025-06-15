
import { z } from 'zod';

export const waitlistFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name cannot be longer than 50 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number (with country code)." }).max(20, { message: "Phone number is too long." }),
  handicap: z.string().max(50, { message: "Handicap input is too long." }),
  goals: z.string().max(500, { message: "Goals cannot be longer than 500 characters." }),
});

export const waitlistDialogSchema = waitlistFormSchema.pick({
    name: true,
    email: true,
    phone: true,
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;
export type WaitlistDialogValues = z.infer<typeof waitlistDialogSchema>;
