import bookmarkModel from '../models/bookmarkModel.js';

const bookmarkService = {
  create: async ({ userId, jobId }) => {
    return bookmarkModel.create({ userId, jobId });
  },

  getById: async (id) => {
    const bookmark = await bookmarkModel.findById(id);
    if (!bookmark) throw new Error('Bookmark not found');
    return bookmark;
  },

  getByUser: async (userId) => {
    return bookmarkModel.findByUser(userId);
  },

  deleteByUserAndJob: async (userId, jobId) => {
    const bookmark = await bookmarkModel.findByUserAndJob(userId, jobId);
    if (!bookmark) throw new Error('Bookmark not found');
    await bookmarkModel.deleteByUserAndJob(userId, jobId);
  }
};

export default bookmarkService;