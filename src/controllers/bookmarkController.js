import bookmarkService from '../services/bookmarkService.js';

export const createBookmark = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    const bookmark = await bookmarkService.create({ userId, jobId });
    res.status(201).json({ status: 'success', data: bookmark });
  } catch (err) {
    next(err);
  }
};

export const getBookmarkById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookmark = await bookmarkService.getById(id);
    res.status(200).json({ status: 'success', data: bookmark });
  } catch (err) {
    next(err);
  }
};

export const deleteBookmarkByUserAndJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    await bookmarkService.deleteByUserAndJob(userId, jobId);
    res.status(200).json({ status: 'success', message: 'Bookmark deleted' });
  } catch (err) {
    next(err);
  }
};

export const getAllBookmarksForUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await bookmarkService.getByUser(userId);
    res.status(200).json({ status: 'success', data: { bookmarks } });
  } catch (err) {
    next(err);
  }
};