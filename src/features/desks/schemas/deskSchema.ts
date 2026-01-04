import { z } from 'zod';

export const deskSchema = z.object({
    deskNumber: z
        .string()
        .min(1, 'Desk number is required')
        .max(10, 'Desk number is too long (max 10 characters)'),
    floor: z
        .number()
        .min(0, 'Floor cannot be negative')
        .max(100, 'Floor number is too high'),
    hasDualMonitor: z.boolean(),
    isStandingDesk: z.boolean(),
})

export type DeskFormData = z.infer<typeof deskSchema>; // creates on its own type. So we dont need to create it. for Single Source of Truth
