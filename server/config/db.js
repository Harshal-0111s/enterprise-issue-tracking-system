require("dotenv").config();

const mysql = require("mysql2");

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
} = process.env;

if (!DB_USER || !DB_PASSWORD || !DB_NAME) {
    console.error("❌ Database environment variables are missing.");
    console.error("DB_HOST:", DB_HOST || "(missing)");
    console.error("DB_USER:", DB_USER || "(missing)");
    console.error("DB_NAME:", DB_NAME || "(missing)");
    process.exit(1);
}

const pool = mysql.createPool({
    host: DB_HOST || "localhost",
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err.message);
        return;
    }

    console.log("✅ MySQL Connected Successfully");
    connection.release();
});

pool.on("error", (err) => {
    console.error("❌ MySQL Pool Error:", err.message);
});

module.exports = pool;
