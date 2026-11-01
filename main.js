const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// >>> CHANGE THIS to your live website address if it is different <<<
const SITE_URL = 'https://balwa-car-cool.vercel.app';

if (!app.requestSingleInstanceLock()) app.quit();

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 900, minHeight: 600,
    title: 'Balwa Car Cool',
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  Menu.setApplicationMenu(null);
  win.loadURL(SITE_URL);
  win.webContents.on('did-fail-load', (e, code, desc, url, isMain) => {
    if (isMain) win.loadFile(path.join(__dirname, 'offline.html'));
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(SITE_URL)) return { action: 'allow' };
    shell.openExternal(url); return { action: 'deny' };
  });
}
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
