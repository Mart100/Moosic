


class Song {
  image: string
  youtubeID: string
  title: string
  author: string
  liked?: boolean
  duration?: number
  saved?: boolean
  order?: number
  lastPlayed?: number
  saveDate?: number
  isDownloadedBool?: boolean
  playedTimes?: number[]
  views?: number

  constructor(data?) {

    if(data == undefined || Object.values(data).length == 0) return
    
    this.image = data.image
    this.youtubeID = data.youtubeID
    this.title = data.title
    this.author = data.author
    this.liked = data.liked
    this.duration = data.duration
    this.saved = data.saved
    if(this.liked == undefined) this.liked = false
    this.order = data.order
    this.lastPlayed = data.lastPlayed
    this.playedTimes = data.playedTimes
    if(!this.playedTimes) this.playedTimes = []
    this.saveDate = data.saveDate
    this.isDownloadedBool = data.isDownloadedBool
    this.views = data.views

    if(data.fillData) this.fillSongDataWithID()

    return this
  }

  get id():string {
    return this.youtubeID 
  }

  get timestamp():string {
    let minutesNum:number = Math.floor(this.duration/60)
    let secondsNum:number = this.duration-minutesNum*60

    let minutesStr:string = minutesNum.toString()
    let secondsStr:string = secondsNum.toString()

    if(secondsNum < 10) secondsStr = '0'+secondsStr


    return `${minutesStr}:${secondsStr}`
  }

  get prettyViews():string {
    if(this.views == undefined) return ""
    let prettyViews:string = this.views.toString()

    if(prettyViews.length > 9) prettyViews = prettyViews.substring(0, ((prettyViews.length-1)%3)+1) + 'b'
    else if(prettyViews.length > 6) prettyViews = prettyViews.substring(0, ((prettyViews.length-1)%3)+1) + 'm'
    else if(prettyViews.length > 3) prettyViews = prettyViews.substring(0, ((prettyViews.length-1)%3)+1) + 'k'

    return prettyViews
  }

  get smartTitle() {
    let newTitle = (this.title+'')

    if(newTitle.includes('-')) {
      let titleSplit = newTitle.split('-')
      
      let simularity0 = stringSimilarity.compareTwoStrings(titleSplit[0], this.author)
      if(titleSplit[0].trim().includes(this.author.trim())) simularity0 = 1
      if(this.author.trim().includes(titleSplit[0].trim())) simularity0 = 1

      let simularity1 = stringSimilarity.compareTwoStrings(titleSplit[1], this.author)
      if(titleSplit[1].trim().includes(this.author.trim())) simularity1 = 1
      if(this.author.trim().includes(titleSplit[1].trim())) simularity1 = 1

      let treshhold = 0.50
      if(simularity0 > simularity1 && simularity0 > treshhold) newTitle = titleSplit[1]
      if(simularity1 > simularity0 && simularity1 > treshhold) newTitle = titleSplit[0]
    
    }

    if(newTitle.includes('(')) newTitle = newTitle.split('(')[0]
    if(newTitle.includes('[')) newTitle = newTitle.split('[')[0]

    newTitle = newTitle.trim()

    return newTitle
  }

  async fillSongDataWithID(options?) {
    let YTsongData = await this.getVideoDataFromYoutube()
    await this.importFromYoutube(YTsongData)
    if(options && options.save) await this.save()
    return
  }

  async fillSongDataWithYTSearch() {
    return new Promise((resolve, reject) => {
      let songID = this.youtubeID

      ipcRenderer.send('getSongInfo', songID)
      ipcRenderer.once('getSongInfoReply', async (event, songData) => {

        if(songData == undefined) resolve(false)
    
        console.log(songData)
        this.image = `https://i.ytimg.com/vi/${songID}/default.jpg`
        this.duration = songData.duration
        this.title = songData.title
        this.author = songData.author
        this.views = songData.views

        resolve(true)
    
      })
    })
  }
  
  getVideoDataFromYoutube() {
    console.trace()
    console.log(this)
    return new Promise((resolve, reject) => {
      let request = gapi.client.youtube.videos.list({
        id: this.youtubeID,
        part: 'snippet',
        type: 'video',
        maxResults: 1
      })
      request.execute((response) => {
        console.log(this.youtubeID, response)
        if(!response.items) return resolve(true)
        resolve(response.items[0])
      })
    })
  }
  async importFromYoutube(video) {
    if(video == undefined || video.snippet == undefined) return
    this.image = video.snippet.thumbnails.default.url
    this.youtubeID = video.kind == 'youtube#playlistItem' ? (video.snippet.resourceId.videoId) : (video.id.videoId ? (video.id.videoId) : (video.id))
    this.title = video.snippet.title
    this.author = video.snippet.channelTitle
    this.liked = this.liked != undefined ? this.liked : false
    this.saved = false
    this.isDownloadedBool = false
    this.order = video.snippet.position ? video.snippet.position : 0

    let DBsong = await getSongByID(this.youtubeID)
    if(DBsong != undefined) {
      this.saveDate = this.saveDate || DBsong.saveDate || undefined
      this.saved = DBsong.saved || this.saved
      this.isDownloadedBool = DBsong.isDownloadedBool || this.isDownloadedBool
      this.liked = DBsong.liked || this.liked
    }

    if(currentSongList.includes(this)) {
      refreshCurrentSongList()
      showSongs(currentSongList, {refresh: true})
    }

    //if(this.liked) this.like()
    

    return this
  }
  play() {
    musicPlayer.play(this)
    setCurrentSong(this)
  }
  async like() {
    this.liked = true
    await this.save()
    this.download({})
    return
  }
  async dislike() {
    this.liked = false
    await this.save()
    //this.removeDownload()
    return
  }
  async save() {
    if(this.saveDate == undefined) this.saveDate = Date.now()
    this.saved = true
    await saveData1((database) => {
      database.songs[this.youtubeID] = this.getObject()
      return database
    })
  }
  async removeDownload() {
    console.log("Undownload: ", this.title)
    console.trace()
    return new Promise((resolve, reject) : void => {
      let downloadPos = this.getDownloadLocation()
      console.log(downloadPos)
      fs.remove(downloadPos, async (err) => {
        if(err) console.error(err)
        this.isDownloadedBool = false
        await this.save()
        resolve(true)
      })
    })
  }
  async download(options:any) {

    let isDownloaded = await this.isDownloaded() 
    if(isDownloaded && !options.redownload) return

    let songPos = this.getDownloadLocation()
    let redownload = false
    if(isDownloaded && options.redownload && fs.existsSync(songPos)) redownload = true


    let res = await songDownloader.queueNewDownload(this.youtubeID, options)
    if(res.res == "ERROR") return res

    if(redownload) {
      console.log('Unloading Howler Because redownloaded song')
      Howler.unload()
      await sleep(100)
      musicPlayer.play(musicPlayer.currentSong)
    }

    this.isDownloadedBool = true

    if(this.saved) await this.save()
    return res
  }
  getDownloadLocation() {
    return songStoragePos+'/'+this.youtubeID+'.mp3'
  }
  async isDownloaded() {
    if(this.isDownloadedBool) return this.isDownloadedBool
    else {
      let songLoc = await this.getDownloadLocation()
      let mp3Exists = await fs.pathExists(songLoc)

      this.isDownloadedBool = mp3Exists
      if(this.saved) this.save()
      return mp3Exists
    }
  }
  async deleteSave() {
    await saveData1((database) => {
      console.log('DELETE: '+ this.youtubeID)
      delete database.songs[this.youtubeID]
      return database
    })

    return
  }
  async delete() {

    if(await this.isDownloaded()) await this.removeDownload()
    await saveData1((database) => {
      delete database.songs[this.youtubeID]
      return database
    })

    return
  }
  getObject() {
    return JSON.parse(JSON.stringify(this))
  }
  getHTML() {

    let html = `
    <div class="song" id="song-${this.youtubeID}">
      <div class="image"><img src="${this.image}"/></div>
      <div class="buttons">
        <img class="like" src="./images/heart.png"/>
        <img class="more" src="./images/options.png"/>
      </div>
      <div class="title">${this.smartTitle}</div>
      <br>
      <div class="channel">${this.author}</div>
      <div class="additionalInfo">${this.timestamp} <span class="playstext">${this.prettyViews} plays</span></div>
    </div>
    `

    return html
  }
}