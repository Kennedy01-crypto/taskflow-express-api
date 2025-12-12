import AppError from "../utils/appError.js";
import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// User Registration Controller
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    //Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User with this email already exists", 409));
    }

    //Create new user
    const newUser = await User.create({ email, password, role });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Basic input validation
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    //Find User by email
    // explicitly select the password because we set select: false in the schema
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      //return a generic error message for security reasons
      //this prevents attackers from knowing if an email exists in the system
      return next(new AppError("Invalid email or password", 401)); //unauthorized
    }

    //Compare provided password with hashed password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return next(new AppError("Invalid email or password", 401)); //unauthorized
    }

    //Generate JWT
    const token = user.createJWT();

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};
