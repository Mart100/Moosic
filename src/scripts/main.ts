const fs = require('fs-extra')
const ytdl = require('ytdl-core')
const FileSaver = require('file-saver')
const eprompt = require('electron-prompt')
declare const Howl:any
declare const Howler:any
declare const YT:any
declare let gapi:any
const _ = require('lodash')
const url = require('url')
const http = require('http')
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
  if(isDev() == false) checkForUpdates()

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

function requestPlaylistVideos(playlistID, pageToken?) {
  return new Promise((resolve, reject) => {
    let options:any = {
      playlistId: playlistID,
      part: 'snippet',
      maxResults: 50
    }

    if(pageToken) options.pageToken = pageToken
    let request = gapi.client.youtube.playlistItems.list(options)
  
    request.execute((response) => {
      resolve(response)
    })
  })
}

async function parseArrayToSongs(unparsedSongs) {

  unparsedSongs = Object.values(unparsedSongs)

  let songs:Song[] = []

  for(let unparsedSong of unparsedSongs) {
    let song:Song
    if(unparsedSong.kind && unparsedSong.kind.includes('youtube')) song = await new Song().importFromYoutube(unparsedSong)
    else song = new Song(unparsedSong)
    if(songs.find((s) => s.youtubeID == song.youtubeID)) continue
    songs.push(song)
  }

  return songs
}

function beutifySeconds(seconds) {

  let songTimeSeconds = Math.floor(seconds % 60).toString()
  if(songTimeSeconds.length == 1) songTimeSeconds = '0'+songTimeSeconds
  let songTimeMinutes = Math.floor(seconds / 60).toString()
  if(songTimeMinutes.length == 1) songTimeMinutes = '0'+songTimeMinutes

  let beutifiedSongTime = `${songTimeMinutes}:${songTimeSeconds}`

  return beutifiedSongTime
}


const DiscordRPC = require('discord-rpc')
const DiscordClientId = '647590804503789578'
DiscordRPC.register(DiscordClientId)
const DiscordRPCclient = new DiscordRPC.Client({ transport: 'ipc' })

DiscordRPCclient.on('ready', async () => {
  console.log('YOINKS')

  let database = await getData()
  if(database.settings.discordRPC == false) return

  setRPCactivity()
})

async function setRPCactivity(options?) {
  let database = await getData()
  if(database.settings.discordRPC == false) return
  if(!options) options = {}
  DiscordRPCclient.setActivity({
    details: 'Listening to:',
    state: options.state || 'Nothing',
    startTimestamp: options.startTimestamp,
    largeImageKey: 'logo',
    largeImageText: 'Download at martve.me/Moosic',
    instance: true,
  })
}
try {
  DiscordRPCclient.login({ clientId: DiscordClientId })
} catch(e) {
  throw e
}

$(() => {

  let dragEnterTime = 0
  $('html').on('drag dragstart dragend dragover dragenter dragleave drop', (e) => {
    e.preventDefault()
  }).on('dragenter', (event:any) => {
    dragEnterTime = new Date().getTime()
    console.log('Enter')
    if($('#dropToImportDiv')[0]) return
    $('body').append(`
<div id="dropToImportDiv" style="width: 100%; height: 100%; background-color: rgb(10, 10, 10); color: white; position: absolute; z-index: 1000;">
  <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);">
  Drop to import song
  </span>
</div>
    `)
  }).on('dragleave', () => {
    if(dragEnterTime > new Date().getTime()-10) return
    console.log('Leave')
    $('#dropToImportDiv').remove()
  }).on('drop', (event:any) => {
    let text = event.originalEvent.dataTransfer.getData("text/plain")
    $('#dropToImportDiv').remove()
    if(!text.includes('youtube.com/watch')) return
    let youtubeID = text.split('?v=')[1]
    if(youtubeID.length != 11) return
    new Song({youtubeID: youtubeID, fillData: true, liked: true}).like()
  })
})