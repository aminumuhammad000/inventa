const { app, BrowserWindow, ipcMain  } = require("electron");
const path = require("path");
const db = require("./database/db");
require("./ipc/userIPC");
require("./ipc/shopIPC");
require("./ipc/productIPC");
require("./ipc/orderIPC");

try {
  require("electron-reload")(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`),
  });
} catch (_) {
  console.log("electron-reload not available - running in production mode");
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "assets", "icon.png"),
    title: "Inventa Store - Browse Products",
  });

  win.loadFile(path.join(__dirname, "theme_0.1", "login.html"));

  if (process.env.NODE_ENV === 'development') {
  win.webContents.openDevTools();
}
}

ipcMain.on('load-dashboard', (event) => {
  const win = BrowserWindow.getFocusedWindow(); // get the current window
  if (win) {
    win.loadFile(path.join(__dirname, "theme_0.1", 'dashboard.html'));
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});



app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
