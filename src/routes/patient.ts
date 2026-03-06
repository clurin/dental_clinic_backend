import { Router } from 'express';
import * as controller from '../controllers/patient.controller.js';

const router = Router();

router.post('/', controller.createPatient);
router.get('/', controller.getPatients);
router.get('/:id', controller.getPatientById);
router.delete('/:id', controller.deletePatient);
router.put('/:id', controller.updatePatient);

export default router;