import express from 'express';
import { getProfile, getMyApplications, getMyBookmarks } from '../controllers/profileController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getProfile);
router.get('/applications', getMyApplications);
router.get('/bookmarks', getMyBookmarks);

export default router;