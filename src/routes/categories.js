import express from 'express';
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { categorySchema } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

router.post('/', authenticate, validate(categorySchema), createCategory);
router.put('/:id', authenticate, validate(categorySchema), updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;