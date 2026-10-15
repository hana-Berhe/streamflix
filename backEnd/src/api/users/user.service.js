import * as userModel from './user.model.js';
import AppError from '../../utils/AppError.js';

export const getUserProfile = async (userId) => {
  const user = await userModel.findUserById(userId);

  // A valid token for a deleted account: treat as signed out.
  if (!user) throw new AppError('Sign in to continue', 401, { code: 'UNAUTHENTICATED' });

  return user;
};
