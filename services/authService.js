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

            try {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                const newUser = {
                    name: user.name,
                    email: user.email,
                    password: hashedPassword
                };

                User.create(newUser, (createErr, result) => {
                    if (createErr && createErr.code === "ER_DUP_ENTRY") {
                        return callback({
                            type: "EMAIL_EXISTS",
                            message: "Email already registered"
                        });
                    }

                    return callback(createErr, result);
                });
            } catch (hashErr) {
                return callback(hashErr);
            }
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
            let passwordMatch;

            try {
                passwordMatch = await bcrypt.compare(password, user.password);
            } catch (compareErr) {
                return callback(compareErr);
            }

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