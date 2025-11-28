import express from "express";
const router = express.Router();
import * as taskController from "../controllers/taskController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the task
 *           example: 60d0fe4f5ae75e001f2f0c7a
 *         description:
 *           type: string
 *           description: The description of the task
 *           example: "Learn Node.js"
 *         completed:
 *           type: boolean
 *           description: Whether the task is completed
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was created
 *           example: "2023-10-26T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was last updated
 *           example: "2023-10-26T11:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management API
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minlength: 3
 *                 maxlength: 200
 *                 description: Title of the task
 *                 example: "Go to the supermarket"
 *               description:
 *                 type: string
 *                 minlength: 5
 *                 description: The description of the task
 *                 example: "Buy groceries"
 *               isCompleted:
 *                 type: boolean
 *                 default: false
 *                 optional: true
 *                 description: Whether the task is completed
 *                 example: false
 *             required:
 *               - description
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", taskController.createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve a list of tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter tasks by completion status (true/false)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum number of tasks to return (for pagination)
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of tasks to skip (for pagination)
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */
router.get("/", taskController.getAllTasks);

router.get("/sorted-examples", taskController.getSortedTasks);
/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$' # Regex for MongoDB ObjectId
 *         required: true
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.get("/:id", taskController.getTaskById);
/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         required: true
 *         description: The ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title of the task
 *                 example: "Go to Naivas Supermarket"
 *               description:
 *                 type: string
 *                 description: New description for the task
 *                 example: "Buy organic groceries"
 *               completed:
 *                 type: boolean
 *                 description: New completion status for the task
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input or update field
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.put("/:id", taskController.updateTask);
/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         required: true
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully"
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", taskController.deleteTask);
router.patch("/:id/complete", taskController.markTaskComplete);
/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         required: true
 *         description: The ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: New description for the task
 *                 example: "Buy organic groceries"
 *               completed:
 *                 type: boolean
 *                 description: New completion status for the task
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input or update field
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", taskController.updateTask);

export default router;
