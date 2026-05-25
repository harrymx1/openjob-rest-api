import userService from '../services/userService.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tokens = await userService.login(email, password);
    res.status(200).json({ status: 'success', data: tokens });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ status: 'failed', message: 'Refresh token required' });
    }
    const newAccessToken = await userService.refreshAccessToken(refreshToken);
    res.status(200).json({ status: 'success', data: { accessToken: newAccessToken } });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ status: 'failed', message: 'Refresh token required' });
    }
    await userService.logout(refreshToken);
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};