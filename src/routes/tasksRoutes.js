import express from "express";
const router = express.Router();
import * as taskController from "../controllers/taskController.js";

router.post("/", taskController.createTask);
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.patch("/:id", taskController.updateTask);


export default router;
