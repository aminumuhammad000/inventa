const { app, BrowserWindow, ipcMain } = require("electron");
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

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "assets", "icon.png"),
    title: "Inventa Store - React App",
  });

//   if (process.env.NODE_ENV === "development") {
//     // Development -> load Vite server
//     win.loadURL("http://localhost:5173/");
//     console.log("Loading Dev Server: http://localhost:5173/");
//   } else {
//     // Production -> load built React files
//     // In production mode
// win.loadFile(path.join(__dirname, "src", "dist", "index.html"));
// console.log("Loading File:", path.join(__dirname, "src", "dist", "index.html"));

//   }


  if (!app.isPackaged) {
    // ✅ Development mode -> use React dev server
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
    console.log("Running in development mode, loading React dev server...");
  } else {
    // ✅ Production mode -> use built React files
    win.loadFile(path.join(__dirname, "dist", "index.html"));
    console.log("Running in production mode, loading dist/index.html...");
  }

  win.webContents.openDevTools();
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
