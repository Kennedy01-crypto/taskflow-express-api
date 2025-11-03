import express from "express";

const app = express();

// define port number
const PORT = process.env.PORT || 3000;

// middleware to parse JSON bodies
app.use(express.json());

// inmemory "database" for tasks
let tasks = [
  {
    id: "1",
    title: "Learn Express.js Routing",
    description: "Understand defining API endpoints",
    completed: false,
  },
  {
    id: "2",
    title: "Set up MongoDB",
    description: "Install MongoDB locally or use Atlas",
    completed: false,
  },
  {
    id: "3",
    title: "Build TaskFlow UI",
    description: "Create a simple frontend for TaskFlow",
    completed: true,
  },
];

// helper function to generate unique IDs
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// ----TaskFlow API routes---- //

app.route("/api/tasks")
  .get((req, res) => {
    console.log("GET /api/tasks called");
    res.json(tasks);
  })
  .post((req, res) => {
    console.log("POST /api/tasks called");
    const { title, description } = req.body;
    // basic validation
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newTask = {
      id: generateId(),
      title,
      description,
      completed: false,
    };

    tasks.push(newTask);
    res.status(201).json({ message: "Task created successfully", task: newTask });
  });

// 7. Get Endpoint for task Status
app.get("/api/tasks/completed", (req, res) => {
  console.log("GET /api/tasks/completed called");
  const completedTasks = tasks.filter((t) => t.completed === true);
  res.json(completedTasks);
});

// 8. Get Endpoint for Incomplete Tasks
app.get("/api/tasks/pending", (req, res) => {
  console.log("GET /api/tasks/pending called");
  const pendingTasks = tasks.filter((t) => t.completed === false);
  res.json(pendingTasks);
});

app.route("/api/tasks/:id")
  .get((req, res, next) => {
    console.log(`Request for task id ${req.params.id} received.`);
    next();
  }, (req, res) => {
    const taskID = req.params.id;
    const task = tasks.find((t) => t.id === taskID);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  })
  .put((req, res) => {
    const taskId = req.params.id;
    console.log(`PUT /api/tasks/${taskId} - Updating task`);
    const { title, description, completed } = req.body;
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      // Basic validation
      if (!title || !description || typeof completed !== "boolean") {
        return res.status(400).json({
          message:
            "Title, description, and completed status are required for update.",
        });
      }
      tasks[taskIndex] = {
        id: taskId, // Ensure ID remains the same
        title,
        description,
        completed,
      };
      res.json({ message: "Task updated successfully", task: tasks[taskIndex] });
    } else {
      res.status(404).json({ message: `Task with ID ${taskId} not found.` });
    }
  })
  .patch((req, res) => {
    const taskId = req.params.id;
    console.log(`PATCH /api/tasks/${taskId} - Partially updating task`);
    const updates = req.body;
    // remove id from updates if it exists
    if (updates.id) {
      delete updates.id;
    }
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
      };
      res
        .status(200)
        .json({ message: "Task updated successfully", task: tasks[taskIndex] });
    } else {
      res.status(404).json({ message: `Task with ID ${taskId} not found.` });
    }
  })
  .delete((req, res) => {
    const taskId = req.params.id;
    const initialLength = tasks.length;
    console.log(`DELETE /api/tasks/${taskId} - Deleting task`);
    tasks = tasks.filter((t) => t.id !== taskId);

    if (tasks.length < initialLength) {
      res.json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ message: `Task with ID ${taskId} not found.` });
    }
  });

// -----Users API routes----- //
let users = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

app.route("/api/users")
  .get((req, res) => {
    console.log("GET /api/users called");
    res.json(users);
  })
  .post((req, res) => {
    console.log("POST /api/users called");
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    } else {
      const newUser = {
        id: generateId(),
        name,
      };
      users.push(newUser);
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    }
  });

app.route("/api/users/:id")
  .get((req, res) => {
    const userId = req.params.id;
    console.log(`GET /api/users/${userId} called`);
    const user = users.find((u) => u.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/:id called");
    const userId = req.params.id;
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });

app.get("/api/:param", (req, res) => {
  res.send(`You requested parameter: ${req.params.param}`);
});
app.get("/api/special", (req, res) => {
  res.send("This is a special route.");
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
