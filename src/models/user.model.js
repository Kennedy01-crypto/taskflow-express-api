import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: [true, "User with this username already exists"],
      lowercase: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
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

//Method to compare candidate password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

//Method to generate JWT
//Will be called on a user instance after successful login
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, email: this.email }, //Payload: user ID and email
    process.env.JWT_SECRET, // Secret key from environment variables
    {
      expiresIn: process.env.JWT_LIFETIME, //Token expiration time
    }
  );
};

export default mongoose.model("User", userSchema);
