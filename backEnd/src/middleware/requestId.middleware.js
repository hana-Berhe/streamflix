import { randomUUID } from 'node:crypto';

const VALID_ID = /^[\w-]{1,100}$/;

/**
 * Gives every request an ID (reusing one from a proxy if present), echoes it in
 * the X-Request-Id response header, and includes it in logs and error bodies.
 * When a user reports "it said something went wrong", the ID finds the log line.
 */
const requestId = (req, res, next) => {
  const incoming = req.get('x-request-id');
  req.id = incoming && VALID_ID.test(incoming) ? incoming : randomUUID();
  res.set('X-Request-Id', req.id);
  next();
};

export default requestId;
