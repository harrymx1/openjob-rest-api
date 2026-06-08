import documentModel from '../models/documentModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const documentService = {
  create: async ({ userId, fileName, fileUrl, fileType }) => {
    return documentModel.create({ userId, fileName, fileUrl, fileType });
  },

  getAll: async () => documentModel.findAll(),

  getById: async (id) => {
    const doc = await documentModel.findById(id);
    if (!doc) throw new Error('Document not found');
    return doc;
  },

  deleteDocument: async (id) => {
    const doc = await documentModel.findById(id);
    if (!doc) throw new Error('Document not found');
    // Hapus file fisik
    const filePath = path.join(__dirname, '../../', doc.file_url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await documentModel.delete(id);
  }
};

export default documentService;