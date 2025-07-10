'use strict';
// Enforces strict mode for cleaner, more secure JavaScript behavior.

const bcrypt = require('bcrypt');
// Used to hash and compare passwords securely.

const jwt = require('jsonwebtoken');
// Used to generate and verify JSON Web Tokens for user authentication.

const userSchema = (sequelize, DataTypes) => {
  // This function defines the Sequelize model for the User table.
  // It takes the Sequelize instance and the DataTypes helper as input.

  const userModel = sequelize.define('User', {
    // Defines the fields/columns for the User table:

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    // The username must be present and unique.

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // The password will be hashed before storing.

    token: {
      type: DataTypes.VIRTUAL,
      // This is a virtual field (not stored in the DB).

      get() {
        // Generates a JWT token signed with the username and a secret key from .env
        return jwt.sign({ username: this.username }, process.env.SECRET);
      }
    }
  });

  // 🔐 Hook: Hash the password before saving to the database
  userModel.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
    // The original password is replaced with the hashed version.
  });

  // 📦 Method: Authenticate using username + password (Basic Auth)
  userModel.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username } });
    // Finds the user by username in the database.

    const valid = await bcrypt.compare(password, user.password);
    // Compares the provided password with the hashed password stored.

    if (valid) {
      return user;
    }

    throw new Error('Invalid User');
    // Throws an error if the password is incorrect or user doesn't exist.
  };

  // 🔑 Method: Authenticate using a JWT token (Bearer Auth)
  userModel.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, process.env.SECRET);
      // Verifies and decodes the token using the secret.

      const user = await this.findOne({ where: { username: parsedToken.username } });
      // Looks up the user based on the decoded token's username.

      if (user) {
        return user;
      }

      throw new Error("User Not Found");

    } catch (e) {
      throw new Error(e.message);
      // Handles invalid token or DB errors.
    }
  };

  return userModel;
  // Returns the completed model so it can be used in Sequelize and across the app.
};

module.exports = userSchema;
// Exports the schema so it can be used in the database setup file.

/*
🧠 Summary of Logic:
This file defines the User model using Sequelize with built-in security features:

1. Fields: It includes a username, a hashed password, and a virtual token that returns a signed JWT.

2. Password Security: It uses bcrypt to hash passwords before storing them in the DB.

3. Authentication Methods:

  authenticateBasic: Validates a username and password.

  authenticateToken: Validates a Bearer token using JWT.

4. These methods and the model are returned for use in routes and middleware.
*/