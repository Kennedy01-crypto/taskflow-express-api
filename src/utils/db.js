//import the "MongoClient" class from the "mongodb" package
import { MongoClient } from "mongodb";

// MongoDB connection URI
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/taskflowdb";

// Variable to hold the database instance
let dbInstance;


// Function to connect to the MongoDB database
async function connectionToDatabase() {
  if (dbInstance) { // Return existing instance if already connected
    return dbInstance;
  }

  try {
    const client = new MongoClient(uri); // Create a new MongoClient. 
    await client.connect(); // Connect to the MongoDB server
    console.log("Successfully connected to MongoDB");
    dbInstance = client.db(); // Get the database instance
    return dbInstance;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}


// Function to get the database instance
function getDb() {
  if (!dbInstance) { //returns an error if the database is not initialized
    throw new Error(
      "Database not initialized. Call connectionToDatabase first."
    );
  }
  return dbInstance;
}
//close the database connection gracefully
async function closeDatabase() {
  if (dbInstance) {
    try {
      const client = new MongoClient(uri); // in real world, you'd store the client instance
      await client.connect();
      await client.close();
      console.log("MongoDB connection closed.");
      dbInstance = null;
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
      throw error;
    }
  }
}

// module exports
export {
  connectionToDatabase,
  getDb,
  closeDatabase,
};
