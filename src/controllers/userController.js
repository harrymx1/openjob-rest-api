import userService from '../services/userService.js';

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
    const user = await userService.getUserById(id);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
};