import express from "express";
import tasksRouter from "./routes/tasksRoutes.js";
import mongoose from "mongoose";
import categoryModel from "./models/category.model.js";
import taskModel from "./models/task.model.js";
import connectionToDatabase from "./utils/db.js";
import dotenv from "dotenv";

// load env variables
dotenv.config();

const app = express();
const PORT = 3000;
app.use(express.json());

//Connect to database
connectionToDatabase();

// import your routes here and use them
app.use("/api/tasks", tasksRouter);

app.post("/api/tasks", async (req, res) => {
  try {
    const dummyUserId = new mongoose.Types.ObjectId(); // Generate a new ObjectId
    const newTask = new taskModel({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      dueDate: req.body.dueDate,
      isCompleted: req.body.isCompleted,
      priority: req.body.priority,
      userId: req.body.userId || dummyUserId, // Use provided userId or our dummy one
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    // Mongoose validation errors will have a 'name' of 'ValidationError'
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ message: "Validation failed", errors });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//post to categories
app.post("/api/categories", async (req, res) => {
  try {
    const newCategory = new categoryModel({
      name: req.body.name,
      description: req.body.description,
      colorCode: req.body.colorCode,
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error posting category ${err.message}` });
  }
});

app.get("/", (req, res) => {
  res.send("✅TaskFlow API is running!");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the TaskFlow API at http://localhost:${PORT}`);
});
