
const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong on the server";

  // Handle PostgreSQL foreign key violations
  if (err.code === "23503") {
    statusCode = 409;
    message = "This operation conflicts with related records";
  }

  // Handle PostgreSQL unique constraint violations
  if (err.code === "23505") {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
