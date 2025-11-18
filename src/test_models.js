import mongoose from "mongoose";
import Task from "./models/task.model.js";
import { MongoMemoryServer } from "mongodb-memory-server";

const testModels = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);

  const task1 = new Task({
    title: "Task 1",
    description: "This is the first task",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const task2 = new Task({
    title: "Task 2",
    description: "This is the second task",
    priority: 5,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    assignedTo: "John Doe",
  });

  const invalidTask = new Task({
    title: "Invalid Task",
    description: "This task has a due date in the past",
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  });

  console.log("--- Instantiated Documents ---");
  console.log("Task 1:", task1);
  console.log("Task 2:", task2);
  console.log("Invalid Task:", invalidTask);

  console.log("\n--- Validating Invalid Task ---");
  try {
    await invalidTask.validate();
  } catch (error) {
    console.error("Validation Error:", error.message);
  }

  
  await mongoose.disconnect();
  await mongoServer.stop();
};

testModels();
