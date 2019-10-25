//let $ = require('jquery')

const electron = require('electron')
const dialog = electron.dialog
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut
const ipcMain = electron.ipcMain

const log = require('electron-log')
const { autoUpdater } = require("electron-updater")

// logging
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

require('v8-compile-cache')

try {
  require('electron-reload')(__dirname, {
    ignored: /node_modules|storage|[\/\\]\./
  })
}
catch(e) {}


app.on('ready', () => {

  autoUpdater.checkForUpdatesAndNotify()

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
  
  window.setMenu(null)
  window.setMaximizable(false)
  window.setResizable(false)

  window.loadFile('./compiled/src/index.html')

  if(isDevv()) {
    window.webContents.once('dom-ready', () => {
      window.webContents.openDevTools()
    })
  }


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

function isDevv() {
  try { require('electron-builder')}
  catch(e) { return false }
  return true
}