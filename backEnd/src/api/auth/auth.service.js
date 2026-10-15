import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../users/user.model.js';
import generateToken from '../../utils/generateToken.js';
import AppError from '../../utils/AppError.js';

const BCRYPT_ROUNDS = 12;

// A real hash compared against when the email doesn't exist, so a failed login
// takes the same time either way and can't be used to discover registered emails.
const DUMMY_HASH = await bcrypt.hash('timing-equaliser', BCRYPT_ROUNDS);

const invalidCredentials = () =>
  new AppError('Invalid email or password', 401, { code: 'INVALID_CREDENTIALS' });

export const register = async ({ fullName, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError('Email is already registered', 409, { code: 'EMAIL_TAKEN' });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  return createUser(fullName, email, passwordHash);
};

export const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  const isPasswordValid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);

  if (!user || !isPasswordValid) throw invalidCredentials();

  return {
    token: generateToken(user.id),
    // Same field names as GET /api/users/me, so the frontend has one user shape.
    user: { id: user.id, full_name: user.full_name, email: user.email },
  };
};
