import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [50, "Title cannot exceed 50 characters"],
      required: true,
      trim: true,
    },
    description: {
      type: String,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [200, "Description cannot exceed 200 characters"],
      trim: true,
      default: "No description provided",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return !v || v >= Date.now();
        },
        message: (props) =>
          `${props.value} is not a valid date! It cannot be in the past.`,
      },
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