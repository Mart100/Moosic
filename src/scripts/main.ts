const fs = require('fs-extra')
const ytdl = require('ytdl-core')
const FileSaver = require('file-saver')
declare const Howl:any
declare const YT:any
declare const gapi:any
const cp = require('child_process')
const worker = require('worker_threads')
const remote = require('electron').remote
const openURL = require('open')
const Spotify = require('spotify-web-api-js')
const spotifyApi = new Spotify()
const spotify_clientID = '11063f81cfec4398aeb571cff3bb819d'
//const globalShortcut = remote.globalShortcut
const ipc = require('electron').ipcRenderer
const musicPlayer = new MusicPlayer()
const songDownloader = new SongDownloader()

// storage position
let storagePos:string = process.env.APPDATA+'\\moosic'+'\\storage'

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

  setTimeout(() => {
    $('#navigator .mySongs').trigger('click')
  }, 100)
})

async function getSongs() {
  let database = await getData()
  let rawSongs:Song[] = Object.values(database.songs)
  let songs = {}
  for(let rawSong of rawSongs) {
    let song = new Song(rawSong)
    songs[song.youtubeID] = song
  }
  return songs
}