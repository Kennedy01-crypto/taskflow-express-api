import express from "express";
const router = express.Router();
import { ObjectId } from "mongodb"; //correctly query with _id

//show db status
router.get("/status", async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      throw new Error("Database not initialized");
    }
    res.status(200).json({
      message: "MongoDB connection is active",
      databaseName: db.databaseName,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error accessing DB instance", error: error.message });
  }
});

//Insert into MongoDB database
router.post("/new", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const tasksCollection = db.collection("tasks");

    const newTask = {
      title: req.body.title,
      description: req.body.description || "No Description Provided",
      completed: false,
      createdAt: new Date(),
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
    };
    //Insert the new task into the collection
    const result = await tasksCollection.insertOne(newTask);
    res.status(201).json({
      message: "New task created",
      taskId: result.insertedId,
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating new task:", error);
    res
      .status(500)
      .json({ message: "Failed to create task", error: error.message });
  }
});

// InsertMany
router.post("/bulk-new", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const tasksCollection = db.collection("tasks");

    const newTasks = req.body.tasks; //array of tasks from request body

    // data validation
    if (!Array.isArray(newTasks) || newTasks === 0) {
      return res.status(400).json({
        message: "Invalid request body. 'tasks' should be a non-empty array.",
      });
    }

    // new individual tasks array from request body
    const tasksToInsert = newTasks.map((task) => ({
      //use spread operator to get task properties
      ...task,
      completed: false,
      createdAt: new Date(),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
    }));

    // insert multiple tasks into the collection
    const InsertManyResult = await tasksCollection.insertMany(tasksToInsert);
    res.status(201).json({
      message: `${InsertManyResult.insertCount} Bulk tasks created`,
      inserteIds: InsertManyResult.insertedIds,
      tasks: tasksToInsert,
    });
  } catch (error) {
    console.error("Error creating bulk tasks:", error);
    res.status(500).json({
      message: "Failed to create bulk tasks",
      error: error.message,
    });
  }
});

// FindOne - Read Operation - One task only
// db.collection('collectionName').findOne(query, options)

router.get("/gettask/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const taskCollection = db.collection("tasks");
    const taskId = req.params.id;

    //convert string ID to Mongo ObjectID
    let taskObjectID;
    try {
      taskObjectID = new ObjectId(taskId);
    } catch (error) {
      return res.status(400).json({ message: "Invalid Task ID format" });
    }

    //find a single task matching the id
    const task = await taskCollection.findOne({
      _id: taskObjectID,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    console.error("Error finding task:", error);
    res
      .status(500)
      .json({
        message: `Failed to find task with id ${taskId}`,
        error: error.message,
      });
  }
});

export default router;
