class Song {
  constructor(data) {

    if(data == undefined) return
    
    this.image = data.image
    this.youtubeID = data.youtubeID
    this.downloadLocation = data.downloadLocation
    this.title = data.title
    this.author = data.author
    this.liked = data.liked
    this.saved = true
    if(this.liked == undefined) this.liked = false
    this.order = 0
    this.lastPlayed = data.lastPlayed

    return this
  }

  importFromYoutube(video) {

    this.image = video.snippet.thumbnails.default.url
    this.youtubeID = video.id.videoId
    this.downloadLocation = undefined
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
    this.saveDate = Date.now()
    await saveData1((database) => {
      database.songs[this.youtubeID] = this.getObject()
      return database
    })
  }
  async removeDownload() {
    let downloadLoc = storagePos + `/songs/${this.youtubeID}.mp3`
    fs.remove(downloadLoc, err => {
      if(err) console.error(err)
      return
    })
  }
  async download(options) {
    return new Promise(async (resolve, reject) => {

      await songDownloader.queueNewDownload(this.youtubeID, options)

      return
    })
  }
  async delete() {
    console.log('TEST-TEST')
    console.log(this)

    if(this.downloadLocation) await this.removeDownload()
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
    if(this.title == undefined) return console.log('WHAT: ', this)
    let title = this.title
    if(title.length > 50) title = title.split('').splice(0, 50).join('') + '...'

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