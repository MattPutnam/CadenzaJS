const electron = require('electron');
const app = electron.app;
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680, webPreferences: {nodeIntegration: false, preload: __dirname + '/preload.js'}});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => mainWindow = null);

  mainWindow.on('close', e => {
      if (mainWindow.isDocumentEdited()) {
        const choice = dialog.showMessageBoxSync(mainWindow, {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Confirm',
            message: 'Are you sure you want to close? Unsaved changes will be lost.'
        })
        if (choice === 1) {
            e.preventDefault()
        }
      }
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
