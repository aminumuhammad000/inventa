const { ipcMain } = require('electron');
const shopDB = require('../database/shop');

// Add shop
ipcMain.handle('add-shop', (event, shop) => new Promise((resolve, reject) => {
  shopDB.addShop(shop, (err, result) => err ? reject(err) : resolve(result));
}));

// Get all shops
ipcMain.handle('get-shops', () => new Promise((resolve, reject) => {
  shopDB.getShops((err, rows) => err ? reject(err) : resolve(rows));
}));

// Get one shop
ipcMain.handle('get-shop', (event, id) => new Promise((resolve, reject) => {
  shopDB.getShopById(id, (err, row) => err ? reject(err) : resolve(row));
}));

// Update shop
ipcMain.handle('update-shop', (event, { id, shop }) => new Promise((resolve, reject) => {
  shopDB.updateShop(id, shop, (err, result) => err ? reject(err) : resolve(result));
}));

// Delete shop
ipcMain.handle('delete-shop', (event, id) => new Promise((resolve, reject) => {
  shopDB.deleteShop(id, (err, result) => err ? reject(err) : resolve(result));
}));

// Get theme color
ipcMain.handle('get-theme-color', () => new Promise((resolve, reject) => {
  shopDB.getThemeColor((err, color) => err ? reject(err) : resolve(color));
}));
