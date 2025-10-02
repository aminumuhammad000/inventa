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



  // ============================
  // SHOP API (ipcShop)
  // ============================
  addShop: async (shop) => {
    return await ipcRenderer.invoke("shop:add", shop);
  },

  getShopById: async (id) => {
    return await ipcRenderer.invoke("shop:getById", id);
  },

  updateShop: async (id, shop) => {
    return await ipcRenderer.invoke("shop:update", { id, shop });
  },

  deleteShop: async (id) => {
    return await ipcRenderer.invoke("shop:delete", id);
  },

  getThemeColor: async () => {
    return await ipcRenderer.invoke("shop:getThemeColor");
  },


  // ============================
  // PRODUCT API (productIPC)
  // ============================
  addProduct: (product) => ipcRenderer.invoke("add-product", product),
  getProduct: (id) => ipcRenderer.invoke("get-product", id),
  getAllProducts: () => ipcRenderer.invoke("get-all-products"),
  updateProduct: (id, product) => ipcRenderer.invoke("update-product", { id, product }),
  deleteProduct: (id) => ipcRenderer.invoke("delete-product", id),
  searchProducts: (keyword) => ipcRenderer.invoke("search-products", keyword),
  updateStatus: (id, status) => ipcRenderer.invoke("update-status", { id, status }),
  getLowStock: (threshold) => ipcRenderer.invoke("get-low-stock", threshold),
  countLowStock: (threshold) => ipcRenderer.invoke("count-low-stock", threshold),
  getTotalProducts: () => ipcRenderer.invoke("get-total-products"),
  getSomeProducts: (limit) => ipcRenderer.invoke("get-some-products", limit),
});
