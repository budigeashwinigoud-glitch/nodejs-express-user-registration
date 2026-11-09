const mysql = require("mysql2");
require("dotenv").config();

const requiredVariables = ["DB_HOST", "DB_USER", "DB_NAME"];
const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
    throw new Error(
        `Missing required database configuration: ${missingVariables.join(", ")}`
    );
}

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("DB_PORT must be a valid TCP port");
}

const ssl = process.env.DB_SSL_CA
    ? { ca: process.env.DB_SSL_CA }
    : process.env.DB_SSL === "true"
        ? {}
        : undefined;

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    ssl
});

module.exports = db;
