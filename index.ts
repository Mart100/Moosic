//let $ = require('jquery')

const electron = require('electron')
const dialog = electron.dialog
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut
const ipcMain = electron.ipcMain

const log = require('electron-log')

require('v8-compile-cache')

let mainWindow

try {
  require('electron-reload')(__dirname, {
    ignored: /node_modules|storage|[\/\\]\./
  })
}
catch(e) {}

app.on('ready', () => {


  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    },
    icon: './icon.ico'
  })
  
  mainWindow.setMenu(null)
  mainWindow.setMaximizable(false)
  mainWindow.setResizable(false)

  mainWindow.loadFile('./compiled/src/index.html')

  if(isDevv()) {
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.webContents.openDevTools()
    })
  }


  mainWindow.on('closed', () => { win = null })

  // set up media globalShortcuts
  globalShortcut.register('MediaPlayPause', () => {
    mainWindow.webContents.executeJavaScript(`onMediaPlayPause()`)
  })
  globalShortcut.register('MediaPreviousTrack', () => {
    mainWindow.webContents.executeJavaScript(`onMediaPreviousTrack()`)
  })
  globalShortcut.register('MediaNextTrack', () => {
    mainWindow.webContents.executeJavaScript(`onMediaNextTrack()`)
  })
})

function isDevv() {
  try { require('electron-builder')}
  catch(e) { return false }
  return true
}

const ipc_mainProc = require('node-ipc')

ipc_mainProc.config.id = 'electron_process'
ipc_mainProc.config.retry = 1500

ipc_mainProc.serve(() => ipc_mainProc.server.on('execJS', message => {
  mainWindow.webContents.executeJavaScript(message)
}))


ipc_mainProc.server.start()