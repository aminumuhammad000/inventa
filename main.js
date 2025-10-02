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
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "assets", "icon.png"),
    title: "Inventa Store - React App",
  });

  if (process.env.NODE_ENV === 'development') {
    // Load Vite dev server
    win.loadURL('http://localhost:5173/');
    // win.webContents.openDevTools();
  } else {
    // Load React build output
    win.loadFile(path.join(__dirname, 'src', 'dist', 'index.html'));
  }
}


app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});



app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
