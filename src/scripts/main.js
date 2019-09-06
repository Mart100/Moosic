const fs = require('fs-extra')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const FileSaver = require('file-saver')
const cp = require('child_process')
const worker = require('worker_threads')
const jsonfile = require('jsonfile')
const remote = require('electron').remote
const open = require('open')
const Spotify = require('spotify-web-api-js')
const pj = require('../package.json')
const spotifyApi = new Spotify()
const spotify_clientID = '11063f81cfec4398aeb571cff3bb819d'
const globalShortcut = remote.globalShortcut
const ipc = require('electron').ipcRenderer
const musicPlayer = new MusicPlayer()
const songDownloader = new SongDownloader()

// storage position
let storagePos = __dirname + '\\storage'
if(isDev()) storagePos = __dirname + '\\storage'

spotifyApi.setAccessToken('cd17a520fcd8414da0099ffe45ea73fa')

let songStoragePos = storagePos+'\\songs'

async function getSongStoragePos() {
  let database = await getData()
  if(database.songStoragePos != undefined) {
    songStoragePos = database.songStoragePos
  }
}

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

  getSongStoragePos()
})

async function getSongs() {
  let database = await getData()
  let rawSongs = Object.values(database.songs)
  let songs = {}
  for(let rawSong of rawSongs) {
    let song = new Song(rawSong)
    songs[song.youtubeID] = song
  }
  return songs
}