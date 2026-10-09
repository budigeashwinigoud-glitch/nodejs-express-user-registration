const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Registration API is running successfully"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Test database
app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1", (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database connection failed",
                error: err.message
            });
        }

        res.json({
            message: "Database connected successfully"
        });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});