import express from 'express';
import { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany } from '../controllers/companyController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { companySchema } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);

router.post('/', authenticate, validate(companySchema), createCompany);
router.put('/:id', authenticate, validate(companySchema), updateCompany);
router.delete('/:id', authenticate, deleteCompany);

export default router;