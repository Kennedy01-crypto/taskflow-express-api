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
      type: String,
      enum: ["low", "medium", "high"],
      lowercase: true,
      trim: true,
      default: "medium",
    },
    tags: {
      type: [String],
      default: [],
      lowercase: true,
      trim: true,
    },
    subtasks: [
      {
        title: {
          type: String,
          required: true,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      validate: {
        validator: function (v) {
          if (this.isNew) {
            return v > Date.now();
          }
          return true;
        },
        message: (props) => `Due date for new tasks must be in the future!`,
      },
    },
    assignedTo: {
      type: String,
      default: "Unassigned",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "completed"],
        message: "{VALUE} is not supported",
      },
      default: "pending",
      lowercase: true,
      trim: true,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// A Virtual field to indicate if a task is overdue
taskSchema.virtual("isOverdue").get(function () {
  return !this.isCompleted && this.deuDate && this.dueDate < Date.now();
});

export default mongoose.model("Task", taskSchema);
