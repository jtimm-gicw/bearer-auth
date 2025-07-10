'use strict';
// Enforces strict mode to catch errors and improve JavaScript behavior.

require('dotenv').config();
// Loads environment variables from a .env file into process.env (e.g., DATABASE_URL, NODE_ENV).

const { Sequelize, DataTypes } = require('sequelize');
// Imports Sequelize and its DataTypes, which are used to define database models.

const userSchema = require('./users.js');
// Imports the user schema definition, which will be used to create the User model.

const environment = process.env.NODE_ENV;
// Grabs the current environment mode: 'development', 'test', or 'production'.

let DATABASE_URL = process.env.DATABASE_URL;
// Gets the database connection string from environment variables.

let db_config = {
  logging: false,
};
// Base config object for Sequelize. Logging is disabled by default.

// Dynamically modify config based on environment
switch (environment) {
  case 'test':
    // If running tests, use an in-memory SQLite database.
    DATABASE_URL = 'sqlite::memory';
    break;

  case 'production':
    // If in production, configure SSL for remote databases (e.g., Render, Heroku).
    db_config.dialectOptions = {
      ssl: true,
      rejectUnauthorized: false, // Required for self-signed or managed certs.
    };
    break;

  case 'development':
    // If in development, enable SQL logging for debugging.
    db_config.logging = true;
    break;

  default:
    // If no NODE_ENV is set, print out the config used.
    console.log('Connecting to ' + DATABASE_URL, db_config);
}

// Create a Sequelize instance using the final URL and config.
const sequelize = new Sequelize(DATABASE_URL, db_config);

// Export the Sequelize instance and the defined `users` model.
module.exports = {
  db: sequelize, // Sequelize instance used to sync and interact with the DB
  users: userSchema(sequelize, DataTypes), // User model created from userSchema definition
};
/*
🧠 Summary of Logic:
This file sets up the Sequelize database connection using environment-specific configurations:

1. Loads environment variables (e.g. DATABASE_URL, NODE_ENV).

2. Applies custom settings based on the environment:

3. Test: Uses in-memory SQLite.

4. Production: Enables SSL for secure remote DBs.

5. Development: Turns on SQL logging.

6. Initializes Sequelize with the final configuration.

7. Builds and exports the users model and the db connection for use elsewhere in the app.
*/