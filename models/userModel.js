const db = require("../config/db");

const User = {

    // Find user by email
    findByEmail: (email, callback) => {
        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], callback);
    },

    // Create new user
    create: (user, callback) => {
        const sql = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        const values = [
            user.name,
            user.email,
            user.password
        ];

        db.query(sql, values, callback);
    }

};

module.exports = User;