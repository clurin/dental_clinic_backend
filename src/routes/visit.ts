import { Router } from 'express';
import * as controller from '../controllers/visit.controller.js';

const router = Router();

router.post('/', controller.createVisit);
router.get('/', controller.getVisits);
router.get('/:id', controller.getVisitById);
router.delete('/:id', controller.deleteVisit);
router.put('/:id', controller.updateVisit);

export default router;