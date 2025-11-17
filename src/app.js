import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import tasksRouter from "./routes/tasks.js";
import connectionToDatabase from "./utils/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

//Connect to database
connectionToDatabase();

app.use(express.json());
async function MongoConnect() {
  const client = new MongoClient(URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    // connect the client to the server
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged  your deployement. you successfully connected to MongoDB!"
    );

    // store the db in app.locals
    app.locals.db = client.db("taskflowdb");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // exit the process with failure
  }
}
// import your routes here and use them

// app.use("/api/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.send("✅TaskFlow API is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the TaskFlow API at http://localhost:${PORT}`);
});
