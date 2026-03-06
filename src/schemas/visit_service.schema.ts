import { z } from 'zod';

export const visitServiceSchema = z.object({
    id: z.string().uuid(),
    visit_id: z.string().uuid(),
    service_id: z.string().uuid(),
    quantity: z.number().int().positive('Количество должно быть больше 0'),
    price_at_time: z.number().nonnegative('Цена не может быть отрицательной'),
    created_at: z.string(),
    updated_at: z.string(),
});

export const createVisitServiceSchema = visitServiceSchema.pick({
    visit_id: true,
    service_id: true,
    quantity: true,
    price_at_time: true,
});

export const updateVisitServiceSchema = createVisitServiceSchema.partial();
