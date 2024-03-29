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
const remote = require('@electron/remote')
const stringSimilarity = require("string-similarity")
const openURL = require('open')
const Spotify = require('spotify-web-api-js')
const spotifyApi = new Spotify()
const spotify_clientID = '11063f81cfec4398aeb571cff3bb819d'
//const globalShortcut = remote.globalShortcut
const ipc = require('electron').ipcRenderer
const musicPlayer = new MusicPlayer()
const songDownloader = new SongDownloader()
let songHeight = 80

// storage position
let storagePos:string
let songStoragePos:string
let databaseFileLoc:string

spotifyApi.setAccessToken('cd17a520fcd8414da0099ffe45ea73fa')

$(async () => {

	if(isDev()) storagePos = remote.app.getAppPath() + '/storage'
	else process.env.APPDATA+'/moosic'+'/storage'

	songStoragePos = await getSongStoragePos()
	databaseFileLoc = storagePos + '/database.json'
	console.log(storagePos, databaseFileLoc)

	$(document).on("keydown", (e) => {
		if(e.keyCode === 123) remote.getCurrentWindow().toggleDevTools()
		else if (e.keyCode === 116) location.reload()
	})


	if(isDev() == false) checkForUpdates()

	setTimeout(() => {
		$('#navigator .mySongs').trigger('click')
	}, 100)
	
	started()

	let win = remote.getCurrentWindow()
	win.setBounds({ width: 400, height: 800 })

})


async function started() {
	let database = await getData()
	if(database.settings.songTileSize) songHeight = database.settings.songTileSize
	
	loadYoutubeAPI()

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
		largeImageText: 'Download at martvenck.com/Moosic',
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
		if($('#dropToImportDiv')[0]) return
		$('body').append(`
<div id="dropToImportDiv" style="width: 100%; height: 100%; background-color: rgb(10, 10, 10); color: white; position: absolute; z-index: 1000;">
	<span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);">
	Drop to import song
	</span>
</div>
		`)
		$('#dropToImportDiv').off().on('click', () => {
			$('#dropToImportDiv').remove()
		})
	}).on('dragleave', () => {
		if(dragEnterTime > new Date().getTime()-10) return
		console.log('Leave')
		$('#dropToImportDiv').remove()
	}).on('drop', async (event:any) => {
		let text = event.originalEvent.dataTransfer.getData("text/plain")
		$('#dropToImportDiv').remove()
		if(!text.includes('youtube.com/watch')) return
		let isPlaylist = text.includes('list=')
		if(isPlaylist) return importYoutubePlaylist(text)
		let youtubeID = text.split('?v=')[1]
		if(youtubeID.includes("&")) youtubeID = youtubeID.split("&")[0]
		if(youtubeID.length != 11) return
		await new Song({youtubeID: youtubeID, fillData: true, liked: true}).like()
		await sleep(500)
		let song = await getSongByID(youtubeID)
		currentSongList.push(song)
		refreshCurrentSongList()
		showSongs(currentSongList, {refresh: true})
	})
})

async function importYoutubePlaylist(playlistLink:string) {
	if(playlistLink == null || playlistLink == undefined) return
	let playlistID = playlistLink.split('list=')[1].split('&')[0].split('&index')[0]
	let playlistVideoLength = 1
	let playlistLastResponse:any
	let playlistNextPageToken:any = undefined
	let playlistVideos:Song[] = []
	console.log(playlistLink, playlistID || playlistNextPageToken == 0)
	while(playlistVideoLength > playlistVideos.length) {
		let response:any = await requestPlaylistVideos(playlistID, playlistNextPageToken)
		console.log(response)
		playlistVideoLength = response.pageInfo.totalResults
		playlistNextPageToken = response.nextPageToken
		if(playlistNextPageToken == undefined) playlistNextPageToken = 0
		playlistLastResponse = response
		for(let vid of response.items) playlistVideos.push(vid)
	}
	let playlistSongs = await parseArrayToSongs(playlistVideos)
	console.log(playlistSongs)
	let newPlaylist = new Playlist('Youtube playlist')
	await newPlaylist.save()
	await newPlaylist.setSongs(playlistSongs)
	$("#navigator .mySongs").trigger("click")
}