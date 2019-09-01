const fs = require('fs-extra')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const FileSaver = require('file-saver')
const jsonfile = require('jsonfile')
const remote = require('electron').remote
const open = require('open')
const Spotify = require('spotify-web-api-js')
const spotifyApi = new Spotify()
const spotify_clientID = '11063f81cfec4398aeb571cff3bb819d'
const globalShortcut = remote.globalShortcut
const ipc = require('electron').ipcRenderer
const musicPlayer = new MusicPlayer()

// storage position
let storagePos = './storage'
if(isDev()) storagePos = './src/storage'

spotifyApi.setAccessToken('cd17a520fcd8414da0099ffe45ea73fa')


const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function isDev() {
  try { require('electron-builder')}
  catch(e) { return false }
  return true
}

$(() => {
	$(document).on("keydown", (e) => {
		if(e.keyCode === 123) remote.getCurrentWindow().toggleDevTools()
		else if (e.keyCode === 116) location.reload()
	})
})
