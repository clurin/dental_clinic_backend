import { Router } from 'express';
import * as controller from '../controllers/service.controller.js';

const router = Router();

router.post('/', controller.createService);
router.get('/', controller.getServices);
router.get('/:id', controller.getServiceById);
router.delete('/:id', controller.deleteService);
router.put('/:id', controller.updateService);

export default router;