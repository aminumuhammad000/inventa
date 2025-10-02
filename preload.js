const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // ✅ Add user
  addUser: async (user) => {
    return await ipcRenderer.invoke("add-user", user);
  },

  // ✅ Update user
  updateUser: async (id, user) => {
    return await ipcRenderer.invoke("update-user", { id, user });
  },

  // ✅ Delete user
  deleteUser: async (id) => {
    return await ipcRenderer.invoke("delete-user", id);
  },

  // ✅ Login user
  login: async (email, password) => {
    return await ipcRenderer.invoke("login", { email, password });
  },

  // ✅ Get user by id
  getUser: async (id) => {
    return await ipcRenderer.invoke("get-user", id);
  },
});
