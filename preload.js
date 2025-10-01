const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  login: (email, password) => ipcRenderer.invoke('login', { email, password }),

  // shop
  getShop: () => ipcRenderer.invoke('get-shop'),
  addShop: (shop) => ipcRenderer.invoke('add-shop', shop),
  updateShop: (shop) => ipcRenderer.invoke('update-shop', shop),
});
