import userService from '../services/userService.js';
import applicationService from '../services/applicationService.js';
import bookmarkService from '../services/bookmarkService.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getByUserId(req.user.id);
    res.status(200).json({ status: 'success', data: { applications } });
  } catch (err) {
    next(err);
  }
};

export const getMyBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await bookmarkService.getByUser(req.user.id);
    res.status(200).json({ status: 'success', data: { bookmarks } });
  } catch (err) {
    next(err);
  }
};