import taskModel from "../models/task.model.js";
import AppError from "../utils/appError.js";

/**
 * @desc Create a new task
 * @route POST/api/tasks
 * @access Public for now, will be protected later
 */
export const createTask = async (req, res, next) => {
  try {
    const newTask = await taskModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Task Created Successfully",
      data: { task: newTask },
    });
  } catch (err) {
    // Mongoose ValidationErrors or Duplicate Key Errors will ne caught here
    // Our global error handler will transform these into appropriate 400 Bad Request errors
    next(err);
  }
};

/**
 * @desc Get all tasks
 * @routes GET/api/tasks
 * @access Public */
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskModel.find();
    res
      .status(200)
      .json({ success: true, count: tasks.length, data: { tasks } });
  } catch (err) {
    //if any error ocurs during find(), its likely a programming error
    next(err);
  }
};

/**
 * @desc Get a single task by ID
 * @route GET/api/tasks/:id
 * @access Public
 */
export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      // if a task is null, means no document wads found with that ID
      // This is an operational error (404 Not Found)
      return next(new AppError(`No Task Found! with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    // If req.params.id is not a valid MongoDB _id format, Mongoose throws a CastError
    // Our global error handler will transform this into a 400 Bad Request
    next(err);
  }
};

/**
 * @desc Update an existing task
 * @route PUT/api/tasks/:id
 * @route PATCH /api/tasks/:id
 * @access Public
 */
export const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const updateData = req.body;

    const updatedTask = await taskModel.findByIdAndUpdate(taskId, updateData, {
      new: true, //Return the modified document rather than the original
      runValidators: true, //Run Mongoose validators on update
      rawResult: true
    });

    if (!updatedTask) {
      return next(new AppError(`No task found with Id ${taskId}`, 404));
    }

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (err) {
    // Handle CastErrors, ValidationErrors here
    next(err);
  }
};

/**
 * @desc mark task as complete/incomplete
 * @route PATCH /api/tasks/:id/complete
 * @access public
 */
export const markTaskComplete = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    //check if the task exists
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found`,
      });
    }
    console.log(`Completed: ${task.isCompleted}`);
    //update only the isCompleted: set it to tue if false, set it to false if true
    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      { isCompleted: !task.isCompleted },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: `Updated complete status to ${updatedTask.isCompleted}`,
    });
    console.log(`Updated Task: ${updatedTask.isCompleted}`);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: `Invalid task ID format` });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: `Validation Error` });
    }

    res.status(500).json({ message: `Error occured ${err.message}` });
  }
};

/**
 * @desc Delete an existing task
 * @route DELETE /api/tasks/:id
 * @access Public
 */
export const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await taskModel.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return next(new AppError(`No task found with that Id ${taskId}`, 404));
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
