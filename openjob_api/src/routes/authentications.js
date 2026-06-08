import express from 'express';
import { login, refresh, logout } from '../controllers/authController.js';
import { validate } from '../middlewares/validation.js';
import { loginSchema, refreshTokenSchema } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', validate(loginSchema), login);
router.put('/', validate(refreshTokenSchema), refresh);
router.delete('/', authenticate, validate(refreshTokenSchema), logout);

export default router;