// routes/authRoutes.js
const express = require("express");
const { register, login , checkUserNameExists} = require("../controllers/authController");
const router = express.Router();

// Route to handle user registration
router.post("/register", register);

// Route to handle user login
router.post("/login", login);
// Route to check if username exists
router.get("/check-username", checkUserNameExists);


module.exports = router;
