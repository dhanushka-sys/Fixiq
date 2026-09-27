export declare abstract class AppError extends Error {
    readonly details?: unknown | undefined;
    abstract readonly statusCode: number;
    constructor(message: string, details?: unknown | undefined);
}
export declare class NotFoundError extends AppError {
    readonly statusCode = 404;
    constructor(message: string, details?: unknown);
}
export declare class UnauthorizedError extends AppError {
    readonly statusCode = 401;
    constructor(message?: string, details?: unknown);
}
export declare class ForbiddenError extends AppError {
    readonly statusCode = 403;
    constructor(message?: string, details?: unknown);
}
export declare class ValidationError extends AppError {
    readonly statusCode = 400;
    constructor(message?: string, details?: unknown);
}
export declare class ConflictError extends AppError {
    readonly statusCode = 409;
    constructor(message: string, details?: unknown);
}
//# sourceMappingURL=index.d.ts.map