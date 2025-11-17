import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [50, "Title cannot exceed 50 characters"],
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"],
      trim: true,
      default: "No description provided",
    },
    priority: {
      type: Number,
      required: true,
      min: [1, "Priority must be at least 1"],
      max: [5, "Priority cannot exceed 5"],
      default: 3,
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v > Date.now();
        },
        message: (props) => `Due date must be in the future!`,
      },
    },
    assignedTo: {
      type: String,
      default: "Unassigned",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in progress", "completed"],
        message: "{VALUE} is not supported",
      },
      default: "pending",
      lowercase: true,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
