


class Song {
  image: string
  youtubeID: string
  title: string
  author: string
  liked?: boolean
  saved?: boolean
  order?: number
  lastPlayed?: number
  saveDate?: number
  isDownloadedBool?: boolean

  constructor(data?) {

    if(data == undefined || Object.values(data).length == 0) return
    
    this.image = data.image
    this.youtubeID = data.youtubeID
    this.title = data.title
    this.author = data.author
    this.liked = data.liked
    this.saved = data.saved
    if(this.liked == undefined) this.liked = false
    this.order = data.order
    this.lastPlayed = data.lastPlayed
    this.saveDate = data.saveDate
    this.isDownloadedBool = data.isDownloadedBool

    if(data.fillData) this.fillSongDataWithID()

    return this
  }
  async fillSongDataWithID() {
    let YTsongData = await this.getVideoDataFromYoutube()
    await this.importFromYoutube(YTsongData)
    return
  }
  getVideoDataFromYoutube() {
    return new Promise((resolve, reject) => {
      let request = gapi.client.youtube.videos.list({
        id: this.youtubeID,
        part: 'snippet',
        type: 'video',
        maxResults: 1
      })
      request.execute((response) => {
        resolve(response.items[0])
      })
    })
  }
  async importFromYoutube(video) {

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
      this.saveDate = DBsong.saveData || undefined
      this.saved = DBsong.saved || this.saved
      this.isDownloadedBool = DBsong.isDownloadedBool || this.isDownloadedBool
      this.liked = DBsong.liked || this.liked
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
    this.removeDownload()
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
    return new Promise((resolve, reject) => {
      let downloadPos = this.getDownloadLocation()
      console.log(downloadPos)
      fs.remove(downloadPos, async err => {
        if(err) console.error(err)
        this.isDownloadedBool = false
        await this.save()
        resolve()
      })
    })
  }
  async download(options:any) {

    if(await this.isDownloaded() && !options.redownload) return

    await songDownloader.queueNewDownload(this.youtubeID, options)

    this.isDownloadedBool = true

    if(this.saved) await this.save()

    return
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
    let title = this.title

  /*
    if(title == undefined) return ''

    if(title.length > 50) title = title.split('').splice(0, 20).join('') + '...'

    let channel = this.author
    if(channel.length > 50) channel = channel.split('').splice(0, 20).join('') + '...'*/

    let html = `
    <div class="song" id="song-${this.youtubeID}">
      <div class="image"><img src="${this.image}"/></div>
      <div class="buttons">
        <img class="more" src="./images/options.png"/>
        <img class="like" src="./images/heart.png"/>
      </div>
      <div class="title">${title}</div>
      <br>
      <div class="channel">${this.author}</div>
    </div>
    `

    return html
  }
}