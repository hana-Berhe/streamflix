import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST; // 400
  }
}

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED; // 401
  }
}

class TooManyRequestsError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.TOO_MANY_REQUESTS; // 429
  }
}

// Gemini is down, busy, or not set up. `code` lets the frontend tell them apart.
class ServiceUnavailableError extends CustomAPIError {
  constructor(message, code) {
    super(message);
    this.statusCode = StatusCodes.SERVICE_UNAVAILABLE; // 503
    this.code = code;
  }
}

export {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  TooManyRequestsError,
  ServiceUnavailableError,
};
