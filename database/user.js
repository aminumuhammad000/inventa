const db = require('./db');

// ✅ Add new user
function addUser(user, callback) {
  const { name, role, email, password } = user;
  const sql = `INSERT INTO admins (name, role, email, password) VALUES (?, ?, ?, ?)`;
  db.run(sql, [name, role, email, password], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID }); // return new user's id
  });
}

// ✅ Update user
function updateUser(id, user, callback) {
  const { name, role, email, password } = user;
  const sql = `UPDATE admins SET name = ?, role = ?, email = ?, password = ? WHERE id = ?`;
  db.run(sql, [name, role, email, password, id], function (err) {
    if (err) return callback(err);
    callback(null, { changes: this.changes }); // how many rows updated
  });
}

// ✅ Delete user
function deleteUser(id, callback) {
  const sql = `DELETE FROM admins WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) return callback(err);
    callback(null, { changes: this.changes }); // how many rows deleted
  });
}

// ✅ Check login (email + password)
function checkLogin(email, password, callback) {
  const sql = `SELECT * FROM admins WHERE email = ? AND password = ?`;
  db.get(sql, [email, password], (err, row) => {
    if (err) return callback("error", err);
    callback(null, row);
  });
}

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  checkLogin
};
