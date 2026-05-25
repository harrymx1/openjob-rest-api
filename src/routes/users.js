import express from 'express';
import { register, getUserById } from '../controllers/userController.js';
import { validate } from '../middlewares/validation.js';
import { registerSchema } from '../middlewares/validation.js';

const router = express.Router();

router.post('/', validate(registerSchema), register);
router.get('/:id', getUserById);

export default router;