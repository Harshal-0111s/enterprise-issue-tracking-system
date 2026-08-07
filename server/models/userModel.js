const db = require("../config/db");

const createUser = (user, callback) => {
  const sql = `
    INSERT INTO users (full_name, email, mobile_number, password)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user.full_name, user.email, user.mobile_number, user.password],
    callback
  );
};

const findUserByEmail = (email, callback) => {
  const sql = `
    SELECT * FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], callback);
};

const findUserByMobileNumber = (mobile_number, callback) => {
  const sql = `
    SELECT * FROM users
    WHERE mobile_number = ?
  `;

  db.query(sql, [mobile_number], callback);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByMobileNumber
};