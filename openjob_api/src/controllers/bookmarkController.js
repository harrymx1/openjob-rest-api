import bookmarkService from '../services/bookmarkService.js';
import { getCache, setCache, deleteCache } from '../lib/redis.js';

export const createBookmark = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    const bookmark = await bookmarkService.create({ userId, jobId });
    await deleteCache(`bookmarks:${userId}`);
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
    await deleteCache(`bookmarks:${userId}`);
    res.status(200).json({ status: 'success', message: 'Bookmark deleted' });
  } catch (err) {
    next(err);
  }
};

export const getAllBookmarksForUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cacheKey = `bookmarks:${userId}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).set('X-Data-Source', 'cache').json({ status: 'success', data: { bookmarks: cachedData } });
    }

    const bookmarks = await bookmarkService.getByUser(userId);
    await setCache(cacheKey, bookmarks, 3600);
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: { bookmarks } });
  } catch (err) {
    next(err);
  }
};