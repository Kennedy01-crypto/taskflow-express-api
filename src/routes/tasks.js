import express from "express";
const router = express.Router();
import { getDb, connectionToDatabase, closeDatabase } from "../utils/db.js";

//simple endpoint to get db access
router.get("/status", async (req, res) => {
  try {
    const db = getDb();
    res.status(200).json({
      message: "MongoDB connection is active.",
      databaseName: db.databaseName,
    });
  } catch (error) {
    console.error("Error accessing DB instance:", error);
    res.status(500).json({
      message: "MongoDB connection is NOT active or accessible.",
      error: error.message,
    });
  }
});
export default router;