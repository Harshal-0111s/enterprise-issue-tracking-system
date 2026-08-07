const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "issue_tracking_db",
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