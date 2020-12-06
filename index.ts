#!/usr/bin/env node

const electron = require('electron')
const dialog = electron.dialog
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut
const ipcMain = electron.ipcMain

const fs_ = require('fs-extra')
const signInUserWebserver = require('./scripts/signInUserWebserver.js')

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
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      nativeWindowOpen: true,
      worldSafeExecuteJavaScript: true
    },
    icon: './icon.ico'
  })
  
  mainWindow.setMenu(null)
  mainWindow.setMaximizable(false)
  mainWindow.setResizable(false)

  mainWindow.loadFile('./build/src/index.html')

  if(isDevv()) {
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.webContents.openDevTools()
    })
  }

  let backedUpDatabase = false
  mainWindow.on('close', (e) => {

    if(!backedUpDatabase) e.preventDefault()
    else return
    
    let storagePos = process.env.APPDATA+'/moosic'+'/storage'
    let databasePos = storagePos+'/'+'database.json'

    console.log('Tried closing: ', databasePos)
    fs_.readFile(databasePos, 'utf8', (err, obj) => {
      try {
        let parsedObj = JSON.parse(obj)
      }
      catch(error) {
        err = error
      }
      
      if(err) {
        console.log(err)
        backedUpDatabase = true
        app.quit()
        return
      }
      
      fs_.copyFile(databasePos, storagePos+'/'+'database_backup.json', (err) => {
        if(err) throw err;
        console.log('Successfully backed up database.json')
        backedUpDatabase = true
        app.quit()
      })
    })
  })

  electron.ipcMain.on('saveUserFirestore', (event, arg) => {
    console.log('Yooo, roempompom')
    signInUserWebserver.start(arg)
  })

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


// Connection to Command Line Interface ( CLI.js )
const ipc_mainProc = require('node-ipc')

ipc_mainProc.config.id = 'electron_process'
ipc_mainProc.config.stopRetrying = true

ipc_mainProc.serve(() => ipc_mainProc.server.on('execJS', message => {
  mainWindow.webContents.executeJavaScript(message)
}))
ipc_mainProc.server.start()