// user.js
const db = require("./db");

// ✅ Add new user
function addUser(user) {
  const { name, role, email, password } = user;
  const stmt = db.prepare(
    `INSERT INTO admins (name, role, email, password) VALUES (?, ?, ?, ?)`
  );
  const result = stmt.run(name, role, email, password);
  return { id: result.lastInsertRowid };
}

// ✅ Update user
function updateUser(id, user) {
  const { name, role, email, password } = user;
  const stmt = db.prepare(
    `UPDATE admins SET name = ?, role = ?, email = ?, password = ? WHERE id = ?`
  );
  const result = stmt.run(name, role, email, password, id);
  return { changes: result.changes }; // number of rows updated
}

// ✅ Delete user
function deleteUser(id) {
  const stmt = db.prepare(`DELETE FROM admins WHERE id = ?`);
  const result = stmt.run(id);
  return { changes: result.changes }; // number of rows deleted
}

// ✅ Check login (email + password)
function checkLogin(email, password) {
  const stmt = db.prepare(
    `SELECT * FROM admins WHERE email = ? AND password = ?`
  );
  const row = stmt.get(email, password);
  return row || null; // return user object or null
}

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  checkLogin,
};
