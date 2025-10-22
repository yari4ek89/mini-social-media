// Import neccessary library
import AppError from "../utils/AppError.js";
import multer from "multer";


// Check logging mode
const isProd = process.env.NODE_ENV === "production";

function buildDetailsList(items) {
    return items.filter(Boolean).map(({path, message}) => ({path, message}));
}

// Function for formatting errors
function formatError(err) {
    const payload = {
        status: err.status || "error",
        message: err.message || "Internal Server Error",
    };
    if (err.details) payload.details = err.details;

    if (!isProd) {
        payload.stack = err.stack;
        payload.raw = {
            name: err.name,
            code: err.code,
            kind: err.kind,
            errors: err.errors,
        };
    }
    return payload;
}

// Function for normalizing errors
function normalizeErrors(err) {
    if (err instanceof AppError) return err;

    if (err instanceof SyntaxError && "body" in err) return new AppError("Malformed JSON in request body", 400);

    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                return new AppError("File too large", 413);
            case "LIMIT_FILE_COUNT":
                return new AppError("Too many files", 400);
            case "LIMIT_UNEXPECTED_FILE":
                return new AppError("Unexpected file", 400);
            default:
                return new AppError("File upload error", 400);
        }
    }

    if (err.code === "EBADCSRFTOKEN") {
        return new AppError("Invalid CSRF token", 403);
    }

    if (["ECONNREFUSED", "ETIMEDOUT"].includes(err.code)) {
        return new AppError("Upstream service unavailable", 503);
    }

    if (err.name === "CastError") {
        const val = typeof err.value === "object" ? JSON.stringify(err.value) : err.value;
        return new AppError(`Invalid ${err.path}: ${val}`, 400);
    }

    if (err.name === "ValidationError") {
        const details = Object.values(err.errors || {}).map((e) => ({
            path: e.path,
            message: e.message,
        }));
        return new AppError("Validation failed", 400, buildDetailsList(details));
    }

    if (err.code === 11000) {
        const fields = Object.keys(err.keyPattern || err.keyValue || {});
        const details = fields.map((f) => ({
            path: f,
            message: `Duplicate value: ${err.keyValue?.[f]}`,
        }));
        const msg = fields.length
            ? `Duplicate value for: ${fields.join(", ")}`
            : "Duplicate key error";
        return new AppError(msg, 409, buildDetailsList(details));
    }

    if (err.name === "JsonWebTokenError") return new AppError("Invalid token", 401);
    if (err.name === "TokenExpiredError") return new AppError("Token expired", 401);

    if (typeof err.statusCode === "number") {
        return new AppError(err.message || "Error", err.statusCode, err.details);
    }

    return err;
}

// Export not found route error
export function notFound(req, res, next) {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
}

// Export error handler function
export function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    const shouldLog = !err.isOperational || process.env.LOG_LEVEL !== "silent";

    if (shouldLog) {
        console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}]`, err);
    }

    let normalized = normalizeErrors(err);

    if (!(normalized instanceof AppError)) {
        normalized = new AppError(normalized?.message || "Internal Server Error", 500);
    }

    const status = normalized.statusCode || 500;
    res.status(status).json(formatError(normalized));
}
