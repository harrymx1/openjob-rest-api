import userService from '../services/userService.js';
import { getCache, setCache, deleteCache } from '../lib/redis.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await userService.register(name, email, password, role);
    res.status(201).json({ status: 'success', data: newUser });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `users:${id}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).set('X-Data-Source', 'cache').json({ status: 'success', data: cachedData });
    }

    const user = await userService.getUserById(id);
    await setCache(cacheKey, user, 3600);
    res.status(200).set('X-Data-Source', 'database').json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Assuming the user can only update their own profile, or it's an admin route
    const updated = await userService.updateUser(id, req.body);
    await deleteCache(`users:${id}`);
    res.status(200).json({ status: 'success', message: 'User updated', data: updated });
  } catch (err) {
    next(err);
  }
};