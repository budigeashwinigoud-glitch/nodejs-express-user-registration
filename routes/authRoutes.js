const express = require("express");

console.log("AUTH ROUTES LOADED");

const authController = require("../controllers/authController");

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
    res.json({
        message: "Auth route is working"
    });
});

// Registration route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

module.exports = router;