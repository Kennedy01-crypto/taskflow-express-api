import AppError from "../utils/appError.js";

//gloabl error handling
const handleCastErrorDB = (err) => {
  const message = `CastError: Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  //by mapping the err.errors object we can extract all validation messages
  //and present them in a coincise client friendly format
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data; ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // Extract value from the error
  const value = err.keyValue[Object.keys(err.keyValue)[0]];
  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming or other unknown error: don't leak error details
    console.log(`Error 💥`, err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // sendErrorDev(err, res);
    let error = {
      ...err,
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = {
      // create a mutable copy and ensure properties
      ...err,
      message: err.message,
      name: err.name,
      code: err.code,
    };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    //MongoDB duplicate key error has code 11000
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
