import express from "express";
import mongoose from "mongoose";
//db import
import connectionToDatabase from "./utils/db.js";
//routes import
import tasksRouter from "./routes/tasksRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
//others
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
app.use("/api/categories", categoryRouter);


//post to categories
// app.post("/api/categories", async (req, res) => {
//   try {
//     const newCategory = new categoryModel({
//       name: req.body.name,
//       description: req.body.description,
//       colorCode: req.body.colorCode,
//     });
//     const savedCategory = await newCategory.save();
//     res.status(201).json(savedCategory);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: `Error posting category ${err.message}` });
//   }
// });

app.get("/", (req, res) => {
  res.send("✅TaskFlow API is running!");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the TaskFlow API at http://localhost:${PORT}`);
});
