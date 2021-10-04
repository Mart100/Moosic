#!/usr/bin/env node

const yts = require('yt-search')
const path = require('path')

const electron = require('electron')
const dialog = electron.dialog
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut
const ipcMain = electron.ipcMain

require('@electron/remote/main').initialize()

const fs_ = require('fs-extra')
const signInUserWebserver = require('./scripts/signInUserWebserver.js')

require('v8-compile-cache')

let mainWindow

try {
  require('electron-reload')(__dirname, {
    ignored: /node_modules|storage|[\/\\]\./,
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  })
}
catch(e) {}

app.on('certificate-error', function(event, webContents, url, error, certificate, callback) {
  console.log(url)
  event.preventDefault();
  callback(true);
});

app.on('ready', () => {

  let title = "Moosic"

  if(isDevv()) title = "Moosic Dev"

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 800,
    frame: false,
    title,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      nativeWindowOpen: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: false,
      allowRunningInsecureContent: true,
      webSecurity: false,
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
    signInUserWebserver.start(signInUserWebserver.actions.save, arg)
  })
  
  electron.ipcMain.on('loadUserFirestore', (event, arg) => {
    signInUserWebserver.start(signInUserWebserver.actions.load, null, (data) => {
      console.log('RESPONSE')
      event.reply('loadUserFirestoreReply', data)
    })
  })

  electron.ipcMain.on('getSongInfo', async (event, youtubeID) => {

    let songData:any

    console.log(youtubeID)

    try {
      songData = await yts( { videoId: youtubeID } )
    } catch(e) {
      console.log(e)
      event.reply('getSongInfoReply', undefined)
      return
    }

    let neededSongData = {
      duration: songData.seconds,
      views: songData.views,
      id: youtubeID,
      author: songData.author.name,
      title: songData.title
    }
    
    event.reply('getSongInfoReply', neededSongData)

  })

  electron.ipcMain.on('getSongsQuery', async (event, searchQuery) => {

    let result:any

    try {
      result = await yts( searchQuery )
    } catch(e) {
      console.log(e)
      event.reply('getSongsQueryReply', undefined)
      return
    }

    let songsList = []

    for(let video of result.videos) {
      songsList.push({
        duration: video.seconds,
        views: video.views,
        id: video.videoId,
        author: video.author.name,
        title: video.title
      })
    }
    
    event.reply('getSongsQueryReply', songsList)

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