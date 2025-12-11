import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "User with this username already exists"],
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be longer than 8 characters"],
    },
  },
  { timestamps: true }
);

//Presave function to hash password
userSchema.pre("save", async function (next) {
  //check if the password has been modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    //use a cost factor of 10
    // The salt is generated and included in the hash automatically
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("User", userSchema);
