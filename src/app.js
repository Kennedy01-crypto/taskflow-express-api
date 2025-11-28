import express from "express";
import morgan from "morgan";
//db import
import connectionToDatabase from "./utils/db.js";
//routes import
import tasksRouter from "./routes/tasksRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
//others
import dotenv from "dotenv";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig.js";

//1.LOAD ENV VARIABLES
dotenv.config();

//2. APP INSTANCE AND PORT CONFIGURATION
const app = express();
const PORT = process.env.PORT || 3000;

//3. GLOBAL MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json()); // Body json parser

//4. CONECT TO DB
connectionToDatabase();

/**
 * Routes
 * Error handling
 * Other Application Confogurations
 */

//API ROUTES
// ---- Swagger Documentation Setup -----
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// This sets up a route /api-docs that will serve the Swagger UI.
// When you navigate to http://localhost:3000/api-docs, you will see the interactive documentation.


//1. Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅TaskFlow API is running!" });
  console.log("✅TaskFlow API is running!");
});

//2. import your routes here and use them
app.use("/api/tasks", tasksRouter);
app.use("/api/categories", categoryRouter);

//3. Middleware for unhandled route errors
//this will only be reached if no other route has handled the request
app.use("/*path", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//4. GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

//5. Start server
const server =app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the TaskFlow API at http://127.0.0.1:${PORT}`);
});

//6. catch synchronous uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting Down...");
  console.error(err.name, err.message, err.stack);
  //Gracefully close server, then exit process
  server.close(() => {
    process.exit(1);
  });
});

//7. catch asynchronous unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting Down...");
  console.error(err.name, err.message, err.stack);
  //gracefully close server, then exit process
  server.close(() => {
    process.exit(1);
  });
});
