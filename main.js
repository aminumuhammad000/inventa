// main.js
// import { app, BrowserWindow } from "electron";
// import path from "path";
const { app, BrowserWindow } = require("electron");
const path = require("path");

// Add electron-reload for development
try {
  require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
  });
} catch (_) {
  // electron-reload not installed, continue without it
  console.log('electron-reload not available - running in production mode');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "assets", "icon.png"), // Add your app icon here
    title: "Inventa Store - Browse Products",
  });

  // Load storefront.html from theme_0.1 folder
  win.loadFile(path.join(__dirname, "theme_0.1", "storefront.html"));

  // Open DevTools automatically in development
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
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
