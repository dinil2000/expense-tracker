// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db"); // Correctly importing the connectDB function
const path = require('path');

// Import route files
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect to the database
connectDB(); // This will now work correctly

// Middleware for Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/user", userRoutes);


// Health check route for server status
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running successfully!" });
});

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "An internal server error occurred" });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = app;
