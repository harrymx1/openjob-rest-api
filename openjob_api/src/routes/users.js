import express from 'express';
import { register, getUserById, updateUser } from '../controllers/userController.js';
import { validate } from '../middlewares/validation.js';
import { registerSchema } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', validate(registerSchema), register);
router.get('/:id', getUserById);
router.put('/:id', authenticate, updateUser);

export default router;