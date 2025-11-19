import taskModel from "../models/task.model.js";

/**
 * @desc Create a new task
 * @route POST/api/tasks
 * @access Public for now, will be protected later
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, completed, dueDate, priority, tags } = req.body;
    const newTask = await taskModel.create({
      title,
      description,
      completed: completed || false,
      dueDate,
      priority,
      tags,
    });
    res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      console.log(err.message);
      return res
        .status(400)
        .json({ message: `Validation Error ${err.message}` });
    }

    console.error(`Error occured ${err.message}`);
    res.status(500).json({
      success: false,
      message: `Error occured ${err.message}`,
      error: err.message,
    });
  }
};

/**
 * @desc Get all tasks
 * @routes GET/api/tasks
 * @access Public */
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskModel.find();
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    console.error(`Error occured ${err.message}`);
    res
      .status(500)
      .json({ success: false, message: `Failed to retrive Tasks` });
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
      return res.status(404).json({
        success: false,
        message: `Task Not Found`,
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    if (err.name == "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
        error: err.message,
      });
    }
    console.error(`Error Fetching task by ID`);
    res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
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
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: `Task Not Found`,
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
        error: err.message,
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        error: err.message,
      });
    }
    console.error(`Error occured ${err.message}`);
    res.status(500).json({
      success: false,
      message: `Error occured ${err.message}`,
    });
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
      return res.status(404).json({
        sucess: false,
        message: `Task not Found`,
      });
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
        error: err.message,
      });
    }
    console.error(`Error occured ${err.message}`);
    res.status(500).json({
      success: false,
      message: `Error occured ${err.message}`,
    });
  }
};
