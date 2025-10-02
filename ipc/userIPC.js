// ipc/userIPC.js
const { ipcMain } = require("electron");
const userDB = require("../database/user");

// ✅ Add user
ipcMain.handle("add-user", (event, user) => {
  return userDB.addUser(user); // returns { id: ... }
});

// ✅ Update user
ipcMain.handle("update-user", (event, { id, user }) => {
  return userDB.updateUser(id, user); // returns { changes: ... }
});

// ✅ Delete user
ipcMain.handle("delete-user", (event, id) => {
  return userDB.deleteUser(id); // returns { changes: ... }
});

// ✅ Check login
ipcMain.handle("login", (event, { email, password }) => {
  const user = userDB.checkLogin(email, password);
  if (user) {
    return { success: true, user };
  } else {
    return { success: false, message: "Invalid credentials" };
  }
});
