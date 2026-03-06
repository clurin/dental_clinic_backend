import { Router } from 'express';
import * as controller from '../controllers/payment.controller.js';

const router = Router();

router.post('/', controller.createPayment);
router.get('/', controller.getPayments);
router.get('/:id', controller.getPaymentById);
router.delete('/:id', controller.deletePayment);
router.put('/:id', controller.updatePayment);

export default router;