import express from 'express';
import { createBookmark, getBookmarkById, deleteBookmarkByUserAndJob, getAllBookmarksForUser } from '../controllers/bookmarkController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// GET /bookmarks
router.get('/bookmarks', authenticate, getAllBookmarksForUser);

// POST /jobs/:jobId/bookmark
router.post('/jobs/:jobId/bookmark', authenticate, createBookmark);

// GET /jobs/:jobId/bookmark/:id
router.get('/jobs/:jobId/bookmark/:id', authenticate, getBookmarkById);

// DELETE /jobs/:jobId/bookmark
router.delete('/jobs/:jobId/bookmark', authenticate, deleteBookmarkByUserAndJob);

export default router;