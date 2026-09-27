"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.ValidationError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    details;
    constructor(message, details) {
        super(message);
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    statusCode = 404;
    constructor(message, details) {
        super(message, details);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends AppError {
    statusCode = 401;
    constructor(message = 'Unauthorized access', details) {
        super(message, details);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    statusCode = 403;
    constructor(message = 'Forbidden action', details) {
        super(message, details);
    }
}
exports.ForbiddenError = ForbiddenError;
class ValidationError extends AppError {
    statusCode = 400;
    constructor(message = 'Validation failed', details) {
        super(message, details);
    }
}
exports.ValidationError = ValidationError;
class ConflictError extends AppError {
    statusCode = 409;
    constructor(message, details) {
        super(message, details);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=index.js.map