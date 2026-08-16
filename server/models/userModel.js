const db = require("../config/db");


/* =========================
   CREATE USER
========================= */

const createUser = (user, callback) => {

    const sql = `
        INSERT INTO users
        (full_name, email, mobile_number, password)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user.full_name,
            user.email,
            user.mobile_number,
            user.password
        ],
        callback
    );
};


/* =========================
   FIND USER BY EMAIL
========================= */

const findUserByEmail = (email, callback) => {

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.query(
        sql,
        [email],
        callback
    );
};


/* =========================
   FIND USER BY MOBILE
========================= */

const findUserByMobileNumber = (mobile_number, callback) => {

    const sql = `
        SELECT *
        FROM users
        WHERE mobile_number = ?
    `;

    db.query(
        sql,
        [mobile_number],
        callback
    );
};


/* =========================
   GET ALL USERS
========================= */

const getAllUsers = (callback) => {

    const sql = `
        SELECT
            id,
            full_name,
            email,
            mobile_number,
            role,
            is_verified,
            created_at
        FROM users
        ORDER BY created_at DESC
    `;

    db.query(
        sql,
        callback
    );
};


/* =========================
   GET SUPPORT AGENTS
========================= */

const getAgents = (callback) => {

    const sql = `
        SELECT
            id,
            full_name,
            email,
            role
        FROM users
        WHERE role IN ('Admin', 'Employee')
        ORDER BY full_name ASC
    `;

    db.query(
        sql,
        callback
    );
};


module.exports = {

    createUser,
    findUserByEmail,
    findUserByMobileNumber,
    getAllUsers,
    getAgents

};
