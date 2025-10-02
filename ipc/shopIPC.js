// ipc/shopIPC.js
const { ipcMain } = require("electron");
const shopDB = require("../database/shop"); // adjust path if needed

// Add Shop
ipcMain.handle("shop:add", (event, shop) => {
  try {
    return shopDB.addShop(shop);
  } catch (err) {
    console.error("Error adding shop:", err);
    return { error: err.message };
  }
});

// Get Shop by ID
ipcMain.handle("shop:getById", (event, id) => {
  try {
    return shopDB.getShopById(id);
  } catch (err) {
    console.error("Error getting shop by ID:", err);
    return { error: err.message };
  }
});

// Update Shop
ipcMain.handle("shop:update", (event, { id, shop }) => {
  try {
    return shopDB.updateShop(id, shop);
  } catch (err) {
    console.error("Error updating shop:", err);
    return { error: err.message };
  }
});

// Get Theme Color
ipcMain.handle("shop:getThemeColor", () => {
  try {
    return shopDB.getThemeColor();
  } catch (err) {
    console.error("Error fetching theme color:", err);
    return { error: err.message };
  }
});
