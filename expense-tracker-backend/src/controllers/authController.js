const { getUsersCollection } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.register = async (req, res) => {
  const { name, userName, email, mobile, password, confirmPassword } = req.body;

  if (!name || !userName || !email || !mobile || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const users = getUsersCollection();

    const existingUser = await users.findOne({
      $or: [{ email }, { userName: userName.toLowerCase() }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email or Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      userName: userName.toLowerCase(),
      email,
      mobile,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await users.insertOne(newUser);

    res.status(201).json({
      message: "User registered successfully.",
      user: { name, userName, email, mobile },
    });
  } catch (err) {
    res.status(500).json({ error: "Error registering user.", details: err.message });
  }
};


// Check if Username Exists
exports.checkUserNameExists = async (req, res) => {
  const { userName } = req.query;

  if (!userName) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const users = getUsersCollection();
    const existingUser = await users.findOne({ userName: { $regex: `^${userName.trim()}$`, $options: "i" } });

    console.log("Query result:", existingUser); // Debugging log

    if (existingUser) {
      return res.status(200).json({ exists: true, message: "Username already exists." });
    }

    res.status(200).json({ exists: false, message: "Username is available." });
  } catch (err) {
    console.error("Error checking username:", err); // Debugging log
    res.status(500).json({ error: "Error checking username.", details: err.message });
  }
};


// User Login
exports.login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const users = getUsersCollection();

    const user = await users.findOne({ userName: userName.toLowerCase() });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, userName: user.userName },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login successful.",
      user: { id: user._id, name: user.name, userName: user.userName, email: user.email, mobile: user.mobile },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Error logging in.", details: err.message });
  }
};
