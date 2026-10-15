import jwt from 'jsonwebtoken';
import config from '../config/env.js';

const generateToken = (userId) =>
  jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

export default generateToken;
