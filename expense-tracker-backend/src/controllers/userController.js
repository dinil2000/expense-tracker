const { getUsersCollection, ObjectId } = require("../config/db");
const bcrypt = require("bcryptjs");

// Update User Profile
exports.updateProfile = async (req, res) => {
  const { userId } = req.params; // Get userId from URL parameter
  const { name, email, mobile, password, confirmPassword } = req.body;
  const profileImage = req.file ? req.file.filename : null; // Check if profile image is uploaded

  // Validate password and confirm password
  if (password && password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const users = getUsersCollection(); // Get the users collection
    const updateFields = { name, email, mobile };

    // If password is provided, hash it and add to update fields
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    // If profile image is uploaded, add it to update fields
    if (profileImage) {
      updateFields.profileImage = profileImage;
    }

    // Convert userId to ObjectId
    const objectId = new ObjectId(userId);

    // Update the user in the database
    const result = await users.updateOne(
      { _id: objectId }, // Find the user by ObjectId
      { $set: updateFields } // Update the user's details
    );

    // If no user was found or no changes were made
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "No changes were made." });
    }

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Error updating profile.", details: err.message });
  }
};
