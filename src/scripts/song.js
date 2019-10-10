class Song {
  constructor(data) {

    if(data == undefined) return
    
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

    return this
  }

  importFromYoutube(video) {

    this.image = video.snippet.thumbnails.default.url
    this.youtubeID = video.id.videoId
    this.title = video.snippet.title
    this.author = video.snippet.channelTitle
    this.liked = false
    this.saved = false
    this.order = 0

    return this
  }
  play() {
    musicPlayer.play(this)
    setCurrentSong(this)
  }
  async like() {
    this.liked = true
    await this.save()
    this.download()
    return
  }
  async dislike() {
    this.liked = false
    await this.save()
    this.removeDownload()
    return
  }
  async save() {
    //console.trace()
    this.saveDate = Date.now()
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
      fs.remove(downloadPos, err => {
        if(err) console.error(err)
        resolve()
      })
    })
  }
  async download(options) {

    if(await this.isDownloaded()) return

    await songDownloader.queueNewDownload(this.youtubeID, options)

    return
  }
  getDownloadLocation() {
    return songStoragePos+'/'+this.youtubeID+'.mp3'
  }
  async isDownloaded() {
    let songLoc = await this.getDownloadLocation()
    let mp3Exists = await fs.pathExists(songLoc)
    return mp3Exists
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
    if(title.length > 20) title = title.split('').splice(0, 20).join('') + '...'

    let channel = this.author
    if(channel.length > 20) channel = channel.split('').splice(0, 20).join('') + '...'

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