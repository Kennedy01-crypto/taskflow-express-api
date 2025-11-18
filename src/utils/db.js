//import the "MongoClient" class from the "mongodb" package
import mongoose from "mongoose";

// MongoDB connection URI
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/taskflowdb";

// Function to connect to the MongoDB database
async function connectionToDatabase() {
  try {
    await mongoose.connect(uri); // Connect to the MongoDB via mongoose
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
    process.exit(1);
  }
}
export default connectionToDatabase;
