'use strict';
// Enforces strict mode to catch common coding bugs and unsafe actions.

const { users } = require('../models/index.js');
// Imports the `users` model, which should include a method to validate tokens.

module.exports = async (req, res, next) => {
  // Exporting this as an async middleware function for Express.
  // Its job is to verify a Bearer Token sent in the Authorization header.

  try {

    if (!req.headers.authorization) {
      // If the Authorization header is missing, deny access.
      _authError();
    }

    const token = req.headers.authorization.split(' ').pop();
    // The header looks like: "Bearer <token>"
    // This splits the string and takes the token part.

    const validUser = await users.authenticateToken(token);
    // Calls a custom method to validate the token and return the user it belongs to.

    req.user = validUser;
    // Attaches the user object to the request so future middleware or routes can use it.

    req.token = validUser.token;
    // Optionally attaches the token itself to the request (useful for logging or response headers).

    next();
    // Everything is valid — proceed to the next middleware or route handler.

  } catch (e) {
    _authError();
    // Any failure (invalid/missing token, DB error) results in a 403 Forbidden.
  }

  function _authError() {
    res.status(403).send('Invalid Login');
    // Sends a 403 Forbidden status when authentication fails.
  }
};
/* 
🧠 Summary of Logic:
This file defines Express middleware for handling Bearer Token Authentication:

1. It looks for a token in the Authorization header ("Bearer <token>").

2. It extracts the token and uses the users.authenticateToken method to verify it.

3. If valid, it attaches the authenticated user and token to the req object.

4. If the token is missing or invalid, it sends a 403 Forbidden response.
*/