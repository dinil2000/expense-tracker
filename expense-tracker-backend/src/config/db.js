// config/db.js
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'expensetracker';

let db, usersCollection, expensesCollection;

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const connection = await client.connect();
    db = connection.db(dbName); // Select the database
    usersCollection = db.collection('users'); // Access the users collection
    expensesCollection = db.collection('expenses'); // Access the expenses collection
    console.log(`Connected to MongoDB: ${dbName}`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

// Function to get the users collection
const getUsersCollection = () => usersCollection;

// Function to get the expenses collection
const getExpensesCollection = () => expensesCollection;

// Export connection functions and collections
module.exports = {
  connectDB,
  getUsersCollection,
  getExpensesCollection,
  ObjectId,
};
