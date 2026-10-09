const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const authService = {

    // Registration
    registerUser: (user, callback) => {

        User.findByEmail(user.email, async (err, results) => {

            if (err) {
                return callback(err);
            }

            if (results.length > 0) {
                return callback({
                    type: "EMAIL_EXISTS",
                    message: "Email already registered"
                });
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);

            const newUser = {
                name: user.name,
                email: user.email,
                password: hashedPassword
            };

            User.create(newUser, callback);
        });
    },

    // Login
    loginUser: (email, password, callback) => {

        User.findByEmail(email, async (err, results) => {

            if (err) {
                return callback(err);
            }

            // User not found
            if (results.length === 0) {
                return callback({
                    type: "INVALID_CREDENTIALS",
                    message: "Invalid email or password"
                });
            }

            const user = results[0];

            // Compare entered password with hashed password
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return callback({
                    type: "INVALID_CREDENTIALS",
                    message: "Invalid email or password"
                });
            }

            callback(null, user);
        });
    }

};

module.exports = authService;