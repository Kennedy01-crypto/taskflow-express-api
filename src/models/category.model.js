import mongoose from "mongoose";
import { Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    maxlength: [200, "Description cannot exceed 200 characters"],
    trim: true,
  },
  colorCode: {
    type: String,
    validate: {
        //example: #RRGGBB
        validator: function (v) {
            return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: (props) => `${props.value} is not a valid color code!`,
    }, 
    default: "#FFFFFF",
  }
}, {timestamps: true});

export default mongoose.model("Category", categorySchema);
