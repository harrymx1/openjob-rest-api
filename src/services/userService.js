import userModel from '../models/userModel.js';
import refreshTokenModel from '../models/refreshTokenModel.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const userService = {
  register: async (name, email, password, role = 'user') => {
    const existing = await userModel.findByEmail(email);
    if (existing) throw new Error('Email already exists');
    const hashed = await hashPassword(password);
    const user = await userModel.create({ name, email, password: hashed, role });
    delete user.password;
    return user;
  },

  getUserById: async (id) => {
    const user = await userModel.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  },

  login: async (email, password) => {
    const user = await userModel.findByEmail(email);
    if (!user) throw new Error('Invalid email or password');
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await refreshTokenModel.create({
      userId: user.id,
      token: refreshToken,
      expiresAt
    });

    return { accessToken, refreshToken };
  },

  refreshAccessToken: async (refreshToken) => {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
    const storedToken = await refreshTokenModel.findByToken(refreshToken);
    if (!storedToken) throw new Error('Refresh token not found');
    if (new Date() > storedToken.expires_at) throw new Error('Refresh token expired');

    const newAccessToken = generateAccessToken(payload.id);
    return newAccessToken;
  },

  logout: async (refreshToken) => {
    const deleted = await refreshTokenModel.deleteByToken(refreshToken);
    if (!deleted) throw new Error('Refresh token not found');
    return true;
  }
};

export default userService;