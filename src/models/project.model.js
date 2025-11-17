import mongoose from "mongoose";
import { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: [5, "Project name must be at least 5 characters long"],
      maxlength: [100, "Project name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: [500, "Project description cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["active", "completed", "on-hold", "cancelled"],
        message: "{VALUE} is not supported",
      },
      required: true,
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return v > Date.now();
        },
        message: (props) => `End date must be in the future!`,
      },
    },
    members: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
