const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
const useSsl =
    process.env.DB_SSL === "true" ||
    process.env.NODE_ENV === "production" ||
    (connectionString && connectionString.includes("neon.tech"));

const poolConfig = connectionString
    ? {
        connectionString,
        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    };

const pool = new Pool(poolConfig);

pool.query("SELECT 1")
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Connection error", err));

module.exports = pool;
