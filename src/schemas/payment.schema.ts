import { z } from 'zod';

export const paymentMethodSchema = z.enum(['cash', 'card', 'transfer', 'insurance']);
export const paymentStatusSchema = z.enum(['pending', 'paid', 'failed', 'refunded']);

export const paymentSchema = z.object({
    id: z.string().uuid(),
    visit_id: z.string().uuid(),
    amount: z.number().positive('Сумма должна быть больше 0'),
    payment_method: paymentMethodSchema,
    status: paymentStatusSchema,
    created_at: z.string(),
    updated_at: z.string(),
});

export const createPaymentSchema = paymentSchema.pick({
    visit_id: true,
    amount: true,
    payment_method: true,
    status: true,
});

export const updatePaymentSchema = createPaymentSchema.partial();
