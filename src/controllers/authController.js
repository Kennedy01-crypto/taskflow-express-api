import AppError from "../utils/appError.js";
import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// User Registration Controller
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User with this email already exists", 400));
    }

    //Create new user
    const newUser = await User.create({ email, password });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        userId: newUser._id,
        email: newUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {};
