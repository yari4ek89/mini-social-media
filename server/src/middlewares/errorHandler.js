// Import neccessary library
import AppError from "../utils/AppError.js";

// Check logging mode
const isProd = process.env.NODE_ENV === "production";

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
  if (err.name === "CastError") {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
    return new AppError("Validation failed", 400, details);
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || {});
    return new AppError(`Duplicate value for: ${fields.join(", ")}`, 409);
  }

  if (err.name === "JsonWebTokenError")
    return new AppError("Invalid token", 401);
  if (err.name === "TokenExpiredError")
    return new AppError("Token expired", 401);

  return err;
}

// Export not found route error
export function notFound(req, res, next) {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
}

// Export error handler function
export function errorHandler(err, req, res, next) {
  if (!err.isOperational || process.env.LOG_LEVEL !== "silent") {
    console.error(`[${new Date().toISOString()}]`, err);
  }

  let normalized = normalizeErrors(err);

  if (!(normalized instanceof AppError)) {
    normalized = new AppError(
      normalized.message || "Internal Server Error",
      500
    );
  }

  const status = normalized.statusCode || 500;
  res.status(status).json(formatError(normalized));
}
