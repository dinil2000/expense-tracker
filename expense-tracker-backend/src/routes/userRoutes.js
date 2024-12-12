const express = require("express");
const multer = require("multer");
const { updateProfile } = require("../controllers/userController");
const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Directory to save images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Route for updating user profile
router.put("/profile/:userId", upload.single("profileImage"), updateProfile);

module.exports = router;
