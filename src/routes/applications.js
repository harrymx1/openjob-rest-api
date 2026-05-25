import express from 'express';
import { createApplication, getAllApplications, getApplicationById, getApplicationsByUser, getApplicationsByJob, updateApplicationStatus, deleteApplication } from '../controllers/applicationController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { applicationSchema, applicationStatusSchema } from '../middlewares/validation.js';

const router = express.Router();

// Semua endpoint applications protected (sesuai spesifikasi)
router.use(authenticate);

router.post('/', validate(applicationSchema), createApplication);
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.get('/user/:userId', getApplicationsByUser);
router.get('/job/:jobId', getApplicationsByJob);
router.put('/:id', validate(applicationStatusSchema), updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;