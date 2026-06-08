import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_KEY;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_KEY;

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: '3h' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};