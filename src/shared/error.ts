export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class APIError extends BaseError {
  constructor(message = 'Internal Server Error', statusCode = 500) {
    super(message, statusCode);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export class ConflictError extends BaseError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}
