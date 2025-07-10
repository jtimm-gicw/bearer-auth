'use strict';

// 🧠 Auth Router: Defines routes for user authentication and protected access
// Uses middleware for basic and bearer authentication, and connects to controller handlers

const express = require('express');
const authRouter = express.Router(); // Create a router instance for handling auth-related routes

// 🔐 Middleware for authentication
const basicAuth = require('../middleware/basic.js');   // Validates username/password (Basic Auth)
const bearerAuth = require('../middleware/bearer.js'); // Validates token (Bearer Auth)

// 📦 Import handler functions for the routes
const {
  handleSignin,
  handleSignup,
  handleGetUsers,
  handleSecret
} = require('./handlers.js');

// 🔧 Define Routes

authRouter.post('/signup', handleSignup);
// Public route: Accepts user info in req.body and creates a new user

authRouter.post('/signin', basicAuth, handleSignin);
// Protected by Basic Auth middleware: Validates credentials, attaches user to req, then signs in

authRouter.get('/users', bearerAuth, handleGetUsers);
// Protected by Bearer Token: Returns list of all usernames (admin-style route)

authRouter.get('/secret', bearerAuth, handleSecret);
// Protected route: Only accessible if user provides valid token

module.exports = authRouter;
// Exports the router so it can be mounted in the main server/app
/*  
✅ Summary:
This router file defines four routes for user authentication and protected access:

    /signup: Public route to register a new user.

    /signin: Protected by Basic Auth — returns user and token.

    /users: Protected by Bearer Token — returns all usernames.

    /secret: Protected route — only accessible to logged-in users.
*/