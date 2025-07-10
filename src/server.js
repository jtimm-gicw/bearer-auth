'use strict';

// 🧠 Express Server Setup: Initializes the Express app, applies middleware, loads routes, and sets up error handling.

// 📦 3rd Party Middleware
const express = require('express');      // Core Express framework
const cors = require('cors');            // Enables Cross-Origin Resource Sharing
const morgan = require('morgan');        // HTTP request logger for development

// 🛠 Custom Error Handlers & Routes
const errorHandler = require('./error-handlers/500.js'); // Handles server errors
const notFound = require('./error-handlers/404.js');     // Handles 404 not found
const authRoutes = require('./auth/router/index.js');    // Import authentication routes

// 🚀 Initialize Express app
const app = express();

// 🌐 Global Middleware
app.use(cors());                // Allows cross-origin requests
app.use(morgan('dev'));         // Logs incoming requests to the console
app.use(express.json());        // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// 🔐 Application Routes
app.use(authRoutes); // Mount all authentication-related routes (e.g., /signup, /signin, etc.)

// ❌ Catch-all Error Handlers (order matters)
app.use(notFound);     // Catches unmatched routes (404)
app.use(errorHandler); // Catches and logs internal server errors (500)

// 📤 Export the app and start function
module.exports = {
  server: app, // Export the Express instance
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
/*
✅ Summary:
This file sets up and exports the main Express server for your authentication API. It includes:

✅ Middleware for CORS, JSON parsing, and logging.

✅ Mounted authentication routes (/signup, /signin, etc.).

✅ Custom 404 and 500 error handlers.

✅ A start(port) function to run the server on a specific port.
*/