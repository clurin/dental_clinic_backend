import { Router } from 'express';
import * as controller from '../controllers/user.controller.js';

const router = Router();

router.post('/', controller.createUser);
router.get('/', controller.getUsers);
router.get('/:id', controller.getUserById);
router.delete('/:id', controller.deleteUser);
router.put('/:id', controller.updateUser);

export default router;