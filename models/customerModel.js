const db = require("../config/db");

const Customer = {

    getAll: (callback) => {
        const sql = "SELECT * FROM customers";

        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = "SELECT * FROM customers WHERE id = ?";

        db.query(sql, [id], callback);
    },

    create: (customer, callback) => {
        const sql = `
            INSERT INTO customers 
            (name, email, phone, company)
            VALUES (?, ?, ?, ?)
        `;

        const values = [
            customer.name,
            customer.email,
            customer.phone,
            customer.company
        ];

        db.query(sql, values, callback);
    },

    update: (id, customer, callback) => {
        const sql = `
            UPDATE customers
            SET name = ?, email = ?, phone = ?, company = ?
            WHERE id = ?
        `;

        const values = [
            customer.name,
            customer.email,
            customer.phone,
            customer.company,
            id
        ];

        db.query(sql, values, callback);
    },

    delete: (id, callback) => {
        const sql = "DELETE FROM customers WHERE id = ?";

        db.query(sql, [id], callback);
    }

};

module.exports = Customer;