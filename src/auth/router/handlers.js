'use strict';

// 🧠 User Controller: Handles user registration, login, retrieval, and access to a protected route.
// Works with Sequelize User model and authentication middleware (basic and bearer auth).

const { users } = require('../models/index.js'); // Import the Sequelize User model

// 🔐 Signup: Create a new user and return their data + JWT
async function handleSignup(req, res, next) {
  try {
    let userRecord = await users.create(req.body); // Auto-hashes password via beforeCreate hook
    const output = { user: userRecord, token: userRecord.token }; // Attach virtual token from model
    res.status(201).json(output); // Send user and token in response
  } catch (e) {
    console.error(e);
    next(e); // Pass error to global error handler
  }
}

// 🔑 Signin: Return authenticated user and their token (set by middleware)
async function handleSignin(req, res, next) {
  try {
    const user = { user: req.user, token: req.user.token }; // req.user comes from basic auth middleware
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

// 📋 Get All Users: Return a list of all usernames in the system
async function handleGetUsers(req, res, next) {
  try {
    const userRecords = await users.findAll({}); // Get all user records
    const list = userRecords.map(user => user.username); // Extract just usernames
    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

// 🔒 Secret Route: Protected content (requires valid token)
function handleSecret(req, res, next) {
  res.status(200).send("Welcome to the secret area!"); // Protected route message
}

// Export all controller functions
module.exports = {
  handleSignup,
  handleSignin,
  handleGetUsers,
  handleSecret
};
