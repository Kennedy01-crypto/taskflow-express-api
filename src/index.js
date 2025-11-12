// app.js

import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

// Import our database utility functions
import { connectionToDatabase, getDb, closeDatabase } from "../src/utils/db.js";
import tasksRouter from "./routes/tasks.js";

// Use the tasks router for task-related endpoints
app.use("/api/tasks", tasksRouter);


// Basic middleware to parse JSON requests
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("TaskFlow API is running!");
});

// New route to check MongoDB connection status
app.get("/api/db-status", (req, res) => {
  try {
    const db = getDb(); // Attempt to get the database instance
    res.status(200).json({
      message: "MongoDB connection is active.",
      databaseName: db.databaseName, // Display the connected DB name
    });
  } catch (error) {
    console.error("Error accessing DB instance:", error);
    res.status(500).json({
      message: "MongoDB connection is NOT active or accessible.",
      error: error.message,
    });
  }
});

// Start the server only AFTER successfully connecting to the database
async function startServer() {
  try {
    await connectionToDatabase();
    // Database connection is successful, now start listening for requests
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access the TaskFlow API at http://localhost:${PORT}`);
      console.log(`Check DB status at http://localhost:${PORT}/api/db-status`);
    });
  } catch (error) {
    console.error(
      "Failed to start server due to database connection error:",
      error
    );
    process.exit(1); // Exit the process with an error code
  }
}

// Call the function to start the server
startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log(
    "Received SIGINT. Shutting down server and closing database connection..."
  );
  await closeDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log(
    "Received SIGTERM. Shutting down server and closing database connection..."
  );
  await closeDatabase();
  process.exit(0);
});
