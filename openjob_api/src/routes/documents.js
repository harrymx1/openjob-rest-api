import express from 'express';
import { uploadDocument, getAllDocuments, getDocumentById, deleteDocument } from '../controllers/documentController.js';
import { authenticate } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Public GET
router.get('/', getAllDocuments);
router.get('/:id', getDocumentById);

// Protected POST/DELETE
router.post('/', authenticate, upload.single('document'), uploadDocument);
router.delete('/:id', authenticate, deleteDocument);

export default router;