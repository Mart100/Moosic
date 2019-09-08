const EventEmitter = require('events')

class MusicPlayer extends EventEmitter {
  constructor() {
    super()
    this.YTplayer
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


  }
  async play(song) {

    this.stop()

    // search if in database
    let database = await getData()
    let songs = database.songs
    let songDB = songs[song.youtubeID]

    // check if song is is queue
    let queueIDlist = Array.from(this.queue, s => s.youtubeID)

    let idx = queueIDlist.indexOf(song.youtubeID)
    if(idx != -1) this.queuePosition = idx

    this.currentSong = song
    this.isPaused = false
    this.emit('play')

    if(this.currentSong.saved) {
      this.currentSong.lastPlayed = Date.now()
      this.currentSong.save()
    }

    let songLoc = songStoragePos+'/'+song.youtubeID+'.mp3'
    let mp3Exists = await song.isDownloaded()

    console.log(songLoc)

    if(songDB != undefined && mp3Exists) this.playMp3(songLoc)
    else this.playYT(song.youtubeID)

    setTimeout(() => {
      this.setVolume(this.volume)
      scrollToCurrentSong()
    }, 100)

  }
  setQueue(newQueue) {
    this.queue = []
    newQueue = JSON.parse(JSON.stringify(newQueue))
    for(let song of newQueue) this.queue.push(new Song(song))
    this.queuePosition = 0
    this.isShuffled = false
    showSongs(this.queue)
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

    if(this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.setVolume) this.YTplayer.setVolume(volume)
    if(this.currentPlayer == 'MP3' && this.HowlSound) this.HowlSound.volume(volume/100)

  }
  pause() {
    this.isPaused = true
    
    if(this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.pauseVideo) this.YTplayer.pauseVideo()
    if(this.currentPlayer == 'MP3' && this.HowlSound) this.HowlSound.pause()
    this.emit('pause')
  }
  unpause() {
    this.isPaused = false

    if(this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.playVideo) this.YTplayer.playVideo()
    if(this.currentPlayer == 'MP3' && this.HowlSound) this.HowlSound.play()
    this.emit('unpause')
  }
  shuffleQueue() {
    this.isShuffled = true
    this.unShuffledQueue = this.queue.slice(0)
    this.queue = this.queue.sort((a, b) => Math.random()-0.5)
    this.emit('shuffle')
    
  }
  unShuffleQueue() {
    this.isShuffled = false
    this.queue = this.unShuffledQueue.slice(0)
    this.emit('unshuffle')
  }
  stop() {
    if(this.YTplayer != undefined && this.YTplayer.stopVideo != undefined) this.YTplayer.stopVideo()
    if(this.HowlSound != undefined) this.HowlSound.stop()

    this.YTplayer = undefined
    this.HowlSound = undefined
    this.currentSong = undefined
    this.emit('stop')
  }
  getDuration() {
    if(this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.getDuration) return this.YTplayer.getDuration()
    if(this.currentPlayer == 'MP3' && this.HowlSound) return this.HowlSound.duration()
  } 
  setCurrentTime(to) {
    if(this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.seekTo) return this.YTplayer.seekTo(to)
    if(this.currentPlayer == 'MP3' && this.HowlSound) return this.HowlSound.seek(to)
  }
  getCurrentTime() {
    if(this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.getCurrentTime) return this.YTplayer.getCurrentTime()
    if(this.currentPlayer == 'MP3' && this.HowlSound) return this.HowlSound.seek()
  }
  playMp3(url) {
    this.HowlSound = new Howl({ src: [url] })
    this.HowlSound.play()
    this.currentPlayer = 'MP3'

    this.onEndListenerMp3()
  }
  playYT(videoID) {
    if($('#player')[0] != undefined) $('#player').remove()
    $('html').append('<div id="player"></div>')

    this.YTplayer = new YT.Player('player', {
      height: '1',
      width: '1',
      videoId: videoID,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      widget_referrer: 'https://martve.me',
      events: {
        'onError': (e) => { this.onYTerror(e) },
        'onReady': (e) => { this.onYTready(e) },
        'onStateChange': (e) => { this.onPlayerStateChangeYT(e) }
      }
    })
    this.currentPlayer = 'YT'

  }
  onYTready(e) {
    e.target.playVideo()
    this.setVolume(this.volume)
  }
  async onYTerror(e) {
    console.log('ERROR', e)

    if(e.data == 150) {
      if(this.currentSong) {
        await this.currentSong.download()
        musicPlayer.play(this.currentSong)
      }
    }
  }
  onEndListenerMp3() {
    this.HowlSound.on('end', () => {
      this.nextInQueue()
      this.emit('end')
    })
  }
  onPlayerStateChangeYT(event) {
    // video end
    if(event.data == 0) {
      this.nextInQueue()
      this.emit('end')
    }
  }
}