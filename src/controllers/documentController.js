import documentService from '../services/documentService.js';

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'failed', message: 'No file uploaded' });
    }
    const userId = req.user.id;
    const { originalname, filename, mimetype, path: filePath } = req.file;
    const document = await documentService.create({
      userId,
      fileName: originalname,
      fileUrl: `/uploads/${filename}`,
      fileType: mimetype
    });
    res.status(201).json({ status: 'success', data: document });
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
    res.status(200).json({ status: 'success', data: document });
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