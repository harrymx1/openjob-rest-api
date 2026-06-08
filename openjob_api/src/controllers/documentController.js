import documentService from '../services/documentService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'failed', message: 'File is required' });
    }
    const userId = req.user.id;
    const { originalname, filename, mimetype, size, path: filePath } = req.file;
    const document = await documentService.create({
      userId,
      fileName: originalname,
      fileUrl: `/uploads/${filename}`,
      fileType: mimetype
    });
    
    res.status(201).json({ 
      status: 'success', 
      data: {
        documentId: document.id,
        filename: filename,
        originalName: originalname,
        size: size
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getAllDocuments = async (req, res, next) => {
  try {
    const documents = await documentService.getAll();
    res.status(200).json({ status: 'success', data: { documents } });
  } catch (err) {
    next(err);
  }
};

export const getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const document = await documentService.getById(id);
    
    // Kirim file fisik untuk endpoint view/download
    const filePath = path.join(__dirname, '../../', document.file_url);
    res.download(filePath, document.file_name, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${document.file_name}"`
      }
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    await documentService.deleteDocument(id);
    res.status(200).json({ status: 'success', message: 'Document deleted' });
  } catch (err) {
    next(err);
  }
};