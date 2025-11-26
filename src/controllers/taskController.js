import taskModel from "../models/task.model.js";
import AppError from "../utils/appError.js";

/**
 * @desc Create a new task
 * @route POST/api/tasks
 * @access Public for now, will be protected later
 */
export const createTask = async (req, res, next) => {
  try {
    // Check if a task with the same title already exists
    const existingTask = await taskModel.findOne({ title: req.body.title });
    if (existingTask) {
      return next(new AppError("A task with this title already exists.", 400));
    }
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
    /**
     * @Filter
     * 1. Build Filtering object
     */
    //create a copy of the query object to manipulate it
    const queryObj = { ...req.query };

    //define fields to exclude from filtering ( these are for sorting, pagination, etc. )
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //Transform query operators (gte, gt, lte, lt) for Mongoose
    let filter = {};
    for (const key in queryObj) {
      const value = queryObj[key];

      //check if the key contains an operator like [gte]
      const operatorMatch = key.match(/\[(gte|gt|lte|lt|ne|in|nin)\]$/);
      if (operatorMatch) {
        const fieldName = key.replace(operatorMatch[0], ""); //eg 'duration'
        const operator = `$${operatorMatch[1]}`; //eg '$gte'
        //Ensure number conversion for numeric fields to avoid string comparisons
        filter[fieldName] = {
          ...filter[fieldName], // Merge if multiple operators for same field (e.g., [gte] and [lte])
          [operator]:
            key.includes("duration") || key.includes("priority")
              ? Number(value)
              : value,
        };
      } else {
        // Simple direct mach filter.
        // You could add case-insensitivity here for sorting fields like 'status'
        // if (key === "status" || key === "priority") {
        //   filter[key] = new RegExp(`^${value}$`, "i"); // Case-insensitive exact match
        // } else {
        filter[key] = value;
        // }
      }
    }

    //Count documents based on the filter *before* applying pagination to get total results
    const totalTasks = await taskModel.countDocuments(filter);

    //start building the mongoose query
    let query = taskModel.find(filter);

    /**
     * @Sort
     * 2. Sorting
     */
    if (req.query.sort) {
      //Convert comma-separated sort fields to space-separated for Mongoose
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      //Default sort: newest tasks first
      query = query.sort(`-createdAt`);
    }

    /**
     * @FieldSelection
     * 3. Filed Selection - (Projection)
     */
    if (req.query.fields) {
      //convert comma-separated fields to space-separated for Mongoose
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      //Exclude Mongoose's internal version key by default
      query = query.select("-__v");
    }

    /**
     * @Pagination
     * 4. Pagination
     */
    const page = parseInt(req.query.page, 10) || 1; //deffault page is 1
    const limit = parseInt(req.query.limit, 10) || 10; //default limit is 10
    const skip = (page - 1) * limit; //calculate documents to skip

    //apply skip and limit to the query
    query = query.skip(skip).limit(limit);

    //Execute the query
    // const tasks = await taskModel.find();
    const tasks = await query;

    //send the response with tasks and pagination metadata
    res.status(200).json({
      success: true,
      results: tasks.length, //number of tasks in the current page
      total: totalTasks, //total number of tasks retrieved
      count: tasks.length, //tasks in the current page
      pagination: {
        totalTasks, //Total tasks matching filters
        totalPages: Math.ceil(totalTasks / limit), //total number of pages
        currentPage: page,
        limit,
        nextPage: page * limit < totalTasks ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        firstPage: 1,
        lastPage: Math.ceil(totalTasks / limit),
      },
      data: { tasks },
    });
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
      rawResult: true,
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
