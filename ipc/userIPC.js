const { ipcMain } = require('electron');
const userDB = require('../database/user');

// ✅ Add user
ipcMain.handle('add-user', (event, user) => {
  return new Promise((resolve, reject) => {
    userDB.addUser(user, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
});

// ✅ Update user
ipcMain.handle('update-user', (event, { id, user }) => {
  return new Promise((resolve, reject) => {
    userDB.updateUser(id, user, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
});

// ✅ Delete user
ipcMain.handle('delete-user', (event, id) => {
  return new Promise((resolve, reject) => {
    userDB.deleteUser(id, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
});

// ✅ Check login
ipcMain.handle('login', (event, { email, password }) => {
  return new Promise((resolve, reject) => {
    userDB.checkLogin(email, password, (err, user) => {
      if (err) reject(err);
      else if (user) resolve({ success: true, user });
      else resolve({ success: false, message: 'Invalid credentials' });
    });
  });
});
