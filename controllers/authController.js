const authService = require("../services/authService");

const authController = {

    // REGISTER
    register: (req, res) => {

        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const user = {
            name,
            email,
            password
        };

        authService.registerUser(user, (err, result) => {

            if (err) {

                if (err.type === "EMAIL_EXISTS") {
                    return res.status(409).json({
                        message: err.message
                    });
                }

                return res.status(500).json({
                    message: "Registration failed",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Registration successful",
                userId: result.insertId
            });
        });
    },

    // LOGIN
    login: (req, res) => {

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        authService.loginUser(email, password, (err, user) => {

            if (err) {

                if (err.type === "INVALID_CREDENTIALS") {
                    return res.status(401).json({
                        message: err.message
                    });
                }

                return res.status(500).json({
                    message: "Login failed",
                    error: err.message
                });
            }

            res.status(200).json({
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        });
    }

};

module.exports = authController;