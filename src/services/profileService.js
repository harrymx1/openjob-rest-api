import userModel from '../models/userModel.js';
import applicationModel from '../models/applicationModel.js';
import bookmarkModel from '../models/bookmarkModel.js';

export const getProfile = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error('User not found');
  return user;
};

export const getMyApplications = async (userId) => {
  return await applicationModel.findByUserId(userId);
};

export const getMyBookmarks = async (userId) => {
  return await bookmarkModel.findByUser(userId);
};