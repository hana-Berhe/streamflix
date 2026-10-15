import * as userService from './user.service.js';

export const getUserProfile = async (req, res) => {
  const user = await userService.getUserProfile(req.userId);
  res.status(200).json({ user });
};
