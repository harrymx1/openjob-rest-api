import express from 'express';
import { createJob, getAllJobs, getJobById, getJobsByCompany, getJobsByCategory, updateJob, deleteJob } from '../controllers/jobController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { jobSchema } from '../middlewares/validation.js';

const router = express.Router();

// Public GET endpoints
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.get('/company/:companyId', getJobsByCompany);
router.get('/category/:categoryId', getJobsByCategory);

// Protected POST/PUT/DELETE
router.post('/', authenticate, validate(jobSchema), createJob);
router.put('/:id', authenticate, validate(jobSchema), updateJob);
router.delete('/:id', authenticate, deleteJob);

export default router;