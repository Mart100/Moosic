const EventEmitter = require('events')

interface durationUpdateEventPacket { time:number; duration: number }

class MusicPlayer extends EventEmitter {
	YTplayer: any
	HowlSound: any
	currentPlayer: string
	volume: number
	isPaused: boolean
	currentSong: Song
	queue: Song[]
	queuePosition: number
	repeat: boolean
	unShuffledQueue: Song[]
	isShuffled: boolean
	durationUpdateInterval: any

	constructor() {
		super()
		this.HowlSound
		this.currentPlayer = 'none'
		this.volume = 50
		this.isPaused = true
		this.currentSong
		this.queue = []
		this.queuePosition = 0
		this.repeat = false
		this.unShuffledQueue = []
		this.isShuffled = false
		this.durationUpdateInterval


	}
	async play(song:Song) {

		if(song.youtubeID == undefined) return

		this.stop()

		console.log("PLAYING NOW:\n", song)
		if(!song.title) await song.fillSongDataWithID({save: true})

		if(song.title == undefined) return
		
		// check if song is is queue
		let queueIDlist = Array.from(this.queue, s => s.youtubeID)

		let idx = queueIDlist.indexOf(song.youtubeID)
		if(idx != -1) this.queuePosition = idx

		this.currentSong = song
		this.isPaused = false
		this.emit('play')

		let songQueueIDX = this.queue.indexOf(this.queue.find(s => s.youtubeID == song.youtubeID))
		if(songQueueIDX > -1) this.queuePosition = songQueueIDX

		if(this.currentSong.saved) {
			this.currentSong.lastPlayed = Date.now()
			this.currentSong.save()
		} 

		let songLoc = songStoragePos+'/'+song.youtubeID+'.mp3'
		let mp3Exists = await song.isDownloaded()


		console.log(songLoc, mp3Exists)

		if(mp3Exists) this.playMp3(songLoc) 
		else { 
			let res = await this.currentSong.download({priority: true})
			if(res.res == "ERROR") {
				if(res.err = "IN_PROGRESS") return
			}
			musicPlayer.play(this.currentSong)
		}

		setTimeout(() => {
			scrollToCurrentSong()
		}, 10)

		let songDuration:number = 0
		
		setRPCactivity({state: song.title, startTimestamp: new Date() })

		clearInterval(this.durationUpdateInterval)
		this.durationUpdateInterval = setInterval(() => {
			let currentTime = this.getCurrentTime()
			if(isNaN(currentTime)) currentTime = 0
			if(songDuration == 0) songDuration = Math.round(this.getDuration())

			let eventPacket:durationUpdateEventPacket = {time: currentTime, duration: songDuration}

			this.emit('durationUpdate', eventPacket)
		}, 100)

		return this

	}
	setQueue(newQueue) {
		this.queue = []
		newQueue = JSON.parse(JSON.stringify(newQueue))
		for(let song of newQueue) this.queue.push(new Song(song))
		//this.queuePosition = 0
		this.isShuffled = false
	}
	nextInQueue() {
		if(!this.repeat) this.queuePosition++
		if(this.queuePosition > this.queue.length) this.queuePosition = 0
		this.play(this.queue[this.queuePosition])
	}
	previousInQueue() {
		if(!this.repeat) this.queuePosition--
		if(this.queuePosition < 0) this.queuePosition = this.queue.length
		this.play(this.queue[this.queuePosition])
	}
	setVolume(volume) {
		this.volume = volume
		if(this.currentPlayer == 'MP3' && this.HowlSound) this.HowlSound.volume(volume/100)

	}
	pause() {
		this.isPaused = true
		if(this.currentPlayer == 'MP3' && this.HowlSound) this.HowlSound.pause()
		this.emit('pause')
	}
	unpause() {
		this.isPaused = false
		if(this.currentPlayer == 'MP3' && this.HowlSound) this.HowlSound.play()
		this.emit('unpause')
	}
	shuffleQueue() {
		this.isShuffled = true
		this.unShuffledQueue = this.queue.slice(0)
		this.queue = this.queue.sort((a, b) => Math.random()-0.5)
		showSongs(musicPlayer.queue, {refresh: true, scrollCurrentSong: true, topBar: false, sort: false})
		this.emit('shuffle')
		
	}
	unShuffleQueue() {
		this.isShuffled = false
		this.queue = this.unShuffledQueue.slice(0)
		this.emit('unshuffle')
	}
	stop() {
		if(this.HowlSound != undefined) this.HowlSound.stop()
		clearInterval(this.durationUpdateInterval)

		this.currentSong = undefined

		this.emit('stop')

		for(let howl of Howler._howls) {
			howl.stop()
		}

	}
	getDuration() {
		if(this.currentPlayer == 'MP3' && this.HowlSound) return this.HowlSound.duration()
	} 
	setCurrentTime(to) {
		if(this.currentPlayer == 'MP3' && this.HowlSound) return this.HowlSound.seek(to)
	}
	getCurrentTime() {
		if(this.currentPlayer == 'MP3' && this.HowlSound && this.currentSong && this.HowlSound.state() == 'loaded') return this.HowlSound.seek()
	}
	playMp3(url) {
		//if(this.HowlSound != undefined) this.HowlSound.stop()
		this.HowlSound = new Howl({ src: url, html5: true })
		this.HowlSound.play()
		this.currentPlayer = 'MP3'

		// on song play start
		this.HowlSound.on('play', () => {
			
			// set volume
			this.setVolume(this.volume)

			// Make sure to clear any other music when this song starts playing
			for(let howl of Howler._howls) {
				if(howl._src.includes(this.currentSong.youtubeID)) continue
				howl.stop()
			}
		})

		this.HowlSound.on('loaderror', async (err) => {
			// Redownload song if error
			console.log('Howl ERR: 190', err)
			await this.currentSong.download({priority: true, redownload: true})

			this.currentSong.play()
		})

		this.onEndListenerMp3()
	}
	onEndListenerMp3() {
		this.HowlSound.on('end', () => {

			// add timestamp to playedTimes
			let minuteDate = Math.floor(Date.now()/1000/60)
			let playedTimes = this.currentSong.playedTimes
			let lastPlayedDate = playedTimes[playedTimes.length-1]
			if(lastPlayedDate == undefined) lastPlayedDate = 0
			if(minuteDate > lastPlayedDate) {
				playedTimes.push(minuteDate)
				this.currentSong.save()
			}

			console.log(playedTimes, minuteDate)


			this.nextInQueue()
			this.emit('end')
		})
	}
}