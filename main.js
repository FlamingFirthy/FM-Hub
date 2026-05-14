const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let splashWindow;
let mainWindow;

function createWindow() {
  Menu.setApplicationMenu(null);

  // Splash screen
  splashWindow = new BrowserWindow({
    width: 460,
    height: 320,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    backgroundColor: '#050507',
    show: true
  });

  splashWindow.loadFile('splash.html');

  // Main app window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'FM Hub',
    backgroundColor: '#050507',
    icon: path.join(__dirname, 'icon.ico'),
    autoHideMenuBar: true,
    show: false,
    opacity: 0,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');

  // Smooth transition
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      fadeOutSplashThenShowMain();
    }, 1500);
  });
}

// Fade out splash
function fadeOutSplashThenShowMain() {
  let splashOpacity = 1;

  const splashFade = setInterval(() => {
    if (!splashWindow || splashWindow.isDestroyed()) {
      clearInterval(splashFade);
      showMainWindowSmooth();
      return;
    }

    splashOpacity -= 0.08;
    splashWindow.setOpacity(Math.max(splashOpacity, 0));

    if (splashOpacity <= 0) {
      clearInterval(splashFade);
      splashWindow.close();
      showMainWindowSmooth();
    }
  }, 25);
}

// Fade in main window
function showMainWindowSmooth() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  mainWindow.show();

  let mainOpacity = 0;

  const mainFade = setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      clearInterval(mainFade);
      return;
    }

    mainOpacity += 0.08;
    mainWindow.setOpacity(Math.min(mainOpacity, 1));

    if (mainOpacity >= 1) {
      clearInterval(mainFade);
    }
  }, 25);
}

// 🔥 IMAGE SAVE HANDLER (THIS FIXES YOUR ISSUE)
ipcMain.handle('save-image', async (event, file) => {
  const buffer = Buffer.from(file.data);
  const fileName = Date.now() + "_" + file.name;

  const dir = path.join(app.getPath('userData'), 'images');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, buffer);

  return filePath;
});

// App ready
app.whenReady().then(createWindow);

// Quit app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// macOS reopen
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});