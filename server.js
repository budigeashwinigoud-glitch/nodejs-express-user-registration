const express = require("express");
const path = require("node:path");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (req, res) => {
    db.query("SELECT 1", (err) => {
        if (err) {
            console.error("Health check database query failed:", err.message);
            return res.status(503).json({
                status: "error",
                database: "unavailable"
            });
        }

        return res.status(200).json({
            status: "ok",
            database: "connected"
        });
    });
});

app.use("/api/auth", authRoutes);

app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1", (err, result) => {
        if (err) {
            console.error("Database test query failed:", err.message);
            return res.status(500).json({
                message: "Database connection failed"
            });
        }

        return res.json({
            message: "Database connected successfully"
        });
    });
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API endpoint not found"
    });
});

app.use((err, req, res, next) => {
    console.error("Request failed:", err.stack || err.message);

    if (res.headersSent) {
        return next(err);
    }

    const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 500
        ? err.status
        : 500;

    return res.status(status).json({
        message: status < 500 ? "Invalid request" : "Internal server error"
    });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
});