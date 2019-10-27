const fs = require('fs-extra')
const ytdl = require('ytdl-core')
const FileSaver = require('file-saver')
declare const Howl:any
declare const YT:any
declare const gapi:any
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
  checkForUpdates()

  setTimeout(() => {
    $('#navigator .mySongs').trigger('click')
  }, 100)

})

async function checkForUpdates() {

  let thisVersion = remote.app.getVersion()
  let latestVersion = await getLatestRelease() //'1.2.9'

  if(thisVersion == latestVersion) return

  let confirmMessage = 
`
There seems to be a new update for Moosic:
Your version: ${thisVersion}
Latest version: ${latestVersion}

Do you want to install this update?
`

  let response = await window.confirm(confirmMessage)

  if(response) {
    downloadFileFromURL(`https://github.com/Mart100/Moosic/releases/download/v${latestVersion}/moosic-Setup-${latestVersion}.exe`)
  }

}

async function awaitWindowLoad(win) {
  return new Promise((resolve, reject) => {
    win.webContents.on('did-finish-load', () => {
      resolve()
    })
  })
}
async function downloadFileFromURL(file_url) {

  // some things
  let file_name = file_url.split('/').pop()
  let downloadLoc = storagePos + '\\installers'

  // prepare download window
  let win = remote.getCurrentWindow()
  win.setBounds({ width: 400, height: 200 })

  // make sure downloadLoc is avaible
  await fs.ensureDir(downloadLoc)

  // remove moosic window stuffs
  $('#index').remove()
  $('#currentSong').remove()
  $('#navigator').remove()
  $('iframe').remove()

  $('body').append(`
<div id="loadingWin">
<div class="title">Downloading ${file_name}...</div>
<div class="progressBar"><div class="progress"></div></div>
<div class="waitingTime">Estemaited waiting time: 0s</div>
</div>
  `)

  // start actual download
  let proc = cp.exec(`wget ${file_url} -P ${downloadLoc}`, (err, stdout, stderr) => {
    if (err) throw err
    else {
      console.log(`Setup ${file_url.split('/').pop()} installed`)
      console.log(`${downloadLoc}\\${file_name}`)
      win.close()
      cp.exec(`${downloadLoc}\\${file_name}`, (err, stdout, stderr) => {
        if(err) throw err
      })
    }
  })
  proc.stderr.on('data', (data) => {
    if(!data.includes('%')) return

    if(Math.random() < 0.9) return

    data = data.replace(/\./g, '').replace('\n', '')

    let progressProcent = data.match(/[0-9]{1,3}%/g) //data.split('%')[0].split(' ')[1]
    let waitingTime = data.match(/[0-9]{1,5}s/g) //.substring(data.indexOf('s')-2, data.indexOf('s'))
    
    //console.log(data, progressProcent, waitingTime)
    if(progressProcent) $('#loadingWin .progressBar .progress').css('width', `${progressProcent}`)
    if(waitingTime) $('#loadingWin .waitingTime').html(`Estimated waiting time: ${waitingTime}`)
  })
}

async function getLatestRelease() {
  return new Promise((resolve, reject) => {
    $.ajax('https://api.github.com/repos/Mart100/Moosic/releases/latest',{
      success(data) {
        let tagName = data.tag_name
        let version = tagName.replace('v', '')
        resolve(version)
      }
    })
  })
}

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