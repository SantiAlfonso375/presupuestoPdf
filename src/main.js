const { app, BrowserWindow } = require("electron");
const path = require("path");
const started = require("electron-squirrel-startup");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// The following command line switches disable GPU acceleration and related features
// to prevent GPU-related error messages like "EGL Driver message (Error) eglQueryDeviceAttribEXT: Bad attribute"
// This may improve stability on systems with problematic graphics drivers
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-software-rasterizer');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    title: "Generador de presupuesto",
    icon: path.join(__dirname, "../assets/iconGenerator.webp"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Verificar qué ruta se está cargando
  let htmlPath;
  if (process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    htmlPath = process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL;
    console.log("Cargando desde Vite Dev Server:", htmlPath);
    mainWindow.loadURL(htmlPath);
  } else {
    // In production, files are processed by Vite and placed in the dist directory
    htmlPath = path.join(__dirname, "../dist/index.html");

    console.log("Cargando archivo HTML:", htmlPath);
    mainWindow.loadFile(htmlPath).catch((err) => {
      console.error("Error al cargar el archivo HTML:", err);
    });
  }

  // Open the DevTools (para ver errores)
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished initialization.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
