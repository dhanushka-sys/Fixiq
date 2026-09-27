export abstract class AppError extends Error {
  abstract readonly statusCode: number;

  constructor(message: string, public readonly details?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  constructor(message: string, details?: unknown) {
    super(message, details);
  }
}

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  constructor(message = 'Unauthorized access', details?: unknown) {
    super(message, details);
  }
}

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  constructor(message = 'Forbidden action', details?: unknown) {
    super(message, details);
  }
}

export class ValidationError extends AppError {
  readonly statusCode = 400;
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, details);
  }
}

export class ConflictError extends AppError {
  readonly statusCode = 409;
  constructor(message: string, details?: unknown) {
    super(message, details);
  }
}
