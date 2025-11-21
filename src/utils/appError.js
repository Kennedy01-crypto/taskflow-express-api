class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "Client fail" : "Server error";
    this.isOperational = true;

    //capture sstack trace, excluding the constructor call from the stack
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
