const authService = require("../services/authService");

const authController = {

    // REGISTER
    register: (req, res) => {

        const { name, email, password } = req.body || {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const user = {
            name: name.trim(),
            email: email.trim(),
            password
        };

        authService.registerUser(user, (err, result) => {

            if (err) {

                if (err.type === "EMAIL_EXISTS") {
                    return res.status(409).json({
                        message: err.message
                    });
                }

                console.error("Registration failed:", err.message);
                return res.status(500).json({
                    message: "Registration failed"
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

        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        authService.loginUser(email.trim(), password, (err, user) => {

            if (err) {

                if (err.type === "INVALID_CREDENTIALS") {
                    return res.status(401).json({
                        message: err.message
                    });
                }

                console.error("Login failed:", err.message);
                return res.status(500).json({
                    message: "Login failed"
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