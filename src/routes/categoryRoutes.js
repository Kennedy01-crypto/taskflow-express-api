import express from "express";
import * as categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getACategoryById);
router.put("/:id", categoryController.updateCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategories);

export default router;
