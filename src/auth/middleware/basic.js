'use strict'; 
// Enforces stricter parsing and error handling for better security and fewer silent errors.

const base64 = require('base-64');
// Imports the base-64 package to decode base64-encoded strings (used for decoding username:password from headers).

const { users } = require('../models/index.js');
// Destructures the `users` model from the database models. This will allow us to call custom methods like authenticateBasic.

module.exports = async (req, res, next) => {
  // Exporting an asynchronous middleware function for Express.
  // It will intercept the request and try to authenticate the user before proceeding.

  try {
    // Start of the authentication logic.

    if (!req.headers.authorization) {
      // If the 'Authorization' header is missing, trigger an auth error.
      return _authError(); 
    }

    let basic = req.headers.authorization.split(' ').pop();
    // The 'Authorization' header looks like: "Basic dXNlcm5hbWU6cGFzc3dvcmQ="
    // This splits by space and takes the base64 part (the encoded credentials).

    let [username, pass] = base64.decode(basic).split(':');
    // Decodes the base64 string back into the original "username:password" format,
    // then splits it into individual variables.

    req.user = await users.authenticateBasic(username, pass);
    // Calls a custom method (probably defined in the User model) to check if the username/password are valid.
    // If valid, attaches the user object to the request for use in other routes.

    next();
    // If authentication succeeds, move on to the next middleware or route handler.

  } catch (e) {
    _authError();
    // If anything goes wrong (invalid credentials, DB error, etc.), send a 403.
  }

  function _authError() {
    res.status(403).send('Invalid Login');
    // Central function to handle failed authentication attempts.
  }

};
/*
🧠 Summary of Logic:
This file creates middleware for handling Basic Authentication using base64-encoded credentials. The process:

1. Checks for the Authorization header.

2. Decodes the base64 string to get the username and password.

3. Validates them using a method from the users model.

4. If successful, attaches the user to req.user and calls next().

5. If any part fails, sends back a 403 Forbidden.
 */