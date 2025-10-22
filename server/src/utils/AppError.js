// Export app error class
export default class AppError extends Error {
    constructor(message, statusCode = 500, details = undefined) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.details = details;
        this.isOperational = true;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }
}
