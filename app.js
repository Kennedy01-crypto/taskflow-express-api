const express = require("express");

const app = express();

// define port number
const PORT = process.env.PORT || 3000;

// basic route
app.get("/", (req, res) => {
  res.send(`Welcome to TaskFlow API`);
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
