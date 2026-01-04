import { z } from 'zod';

export const reservationSchema = z.object({
    deskId: z
        .string()
        .min(1, 'Desk selection is required'),
    reservationDate: z
        .string()
        .min(1, 'Reservation date is required')
        .refine((val) => {
            const date = new Date(val);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
        }, { message: 'Date cannot be in the past' })
});

export type ReservationFormData = z.infer<typeof reservationSchema>;
