let $ = require('jquery')

const { dialog } = require('electron')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut
const ipcMain = electron.ipcMain

const { autoUpdater } = require("electron-updater")

require('v8-compile-cache')

try {
  require('electron-reload')(__dirname, {
    ignored: /node_modules|storage|[\/\\]\./
  })
}
catch(e) {}


app.on('ready', () => {

  // Create the browser window.
  let window = new BrowserWindow({
    width: 400,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    },
    icon: './icon.ico'
  })

  window.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({responseHeaders: Object.fromEntries(Object.entries(details.responseHeaders).filter(header => !/x-frame-options/i.test(header[0])))});
  });
  
  window.setMenu(null)
  window.setMaximizable(false)
  window.setResizable(false)

  window.loadFile('./src/index.html')

  if(isDev()) {
    window.webContents.once('dom-ready', () => {
      window.webContents.openDevTools()
    })
  }

  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify()
  }, 2000)


  window.on('closed', () => { win = null })

  // set up media globalShortcuts
  globalShortcut.register('MediaPlayPause', () => {
    window.webContents.executeJavaScript(`onMediaPlayPause()`)
  })
  globalShortcut.register('MediaPreviousTrack', () => {
    window.webContents.executeJavaScript(`onMediaPreviousTrack()`)
  })
  globalShortcut.register('MediaNextTrack', () => {
    window.webContents.executeJavaScript(`onMediaNextTrack()`)
  })
})

function isDev() {
  try { require('electron-builder')}
  catch(e) { return false }
  return true
}