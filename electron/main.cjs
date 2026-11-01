const { app, BrowserWindow, shell, ipcMain, screen } = require('electron');
const path = require('path');
const InputDriver = require('./inputDriver.cjs');
const ScreenCaptureDriver = require('./screenCaptureDriver.cjs');

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: 'NETRIX Remote — Enterprise Remote Desktop & Support',
    backgroundColor: '#080C14',
    icon: path.join(__dirname, '../public/favicon.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: false, // Required for desktopCapturer & Koffi IPC
    },
    autoHideMenuBar: true,
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle external links safely via default OS browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

// IPC Handlers for Screen Capture & Input Injection
ipcMain.handle('netrix:get-screen-sources', async () => {
  return await ScreenCaptureDriver.getScreenSources();
});

ipcMain.handle('netrix:get-primary-display', () => {
  const primary = screen.getPrimaryDisplay();
  return {
    width: primary.size.width,
    height: primary.size.height,
    scaleFactor: primary.scaleFactor,
  };
});

ipcMain.on('netrix:inject-mouse-move', (_event, { x, y }) => {
  InputDriver.setCursorPos(x, y);
});

ipcMain.on('netrix:inject-mouse-action', (_event, { type, button, delta }) => {
  InputDriver.mouseAction(type, button, delta);
});

ipcMain.on('netrix:inject-keyboard-action', (_event, { type, keyCode }) => {
  InputDriver.keyboardAction(type, keyCode);
});

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    if (!app.isDefaultProtocolClient('netrix')) {
      app.setAsDefaultProtocolClient('netrix');
    }

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
