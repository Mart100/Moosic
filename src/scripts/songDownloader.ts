class SongDownloader {
  pending: string[]
  inProgress: string[]
  finished: string[]
  downloadWidth: number

  constructor() {

    this.pending = []
    this.inProgress = []
    this.finished = []

    this.downloadWidth = 10
  }

  async queueNewDownload(songID, options:any={}) {

    // check if song is already in queue / downloading
    let duplicateStatus = this.getSongDownloadStatus(songID)
    if(duplicateStatus == 0 || duplicateStatus == 1) return
    
    // push song to downloads queue
    this.pending.push(songID)

    // if less then 6 downloads are in progress. Download song immediatly
    if(this.inProgress.length < this.downloadWidth) return await this.startDownloadingSong(songID)

    // if priority, start download
    if(options.priority) return await this.startDownloadingSong(songID)

    // wait until song is finished downloading
    await this.waitSongFinished(songID)

    // finished with download
    return

  }

  async waitSongFinished(songID) {
    return new Promise(async (resolve, reject) => {

      // check status interval
      let checkStatusInterval = setInterval(() => {

        let status = this.getSongDownloadStatus(songID)

        // if status == 2. Finished downloading. return
        if(status == 2) resolve()

      }, 5000)

    })
  }

  getSongDownloadStatus(songID) {
    // pending
    if(this.pending.includes(songID)) return 0

    // in progress
    if(this.inProgress.includes(songID)) return 1

    // is finished
    if(this.finished.includes(songID)) return 2

    return -1

  }
  async moveQueue() {
    if(this.pending.length == 0) return

    if(this.inProgress.length > this.downloadWidth) return
    
    this.startDownloadingSong(this.pending[0])
  }

  async startDownloadingSong(songID) {
    return new Promise(async (resolve, reject) => {
      // remove from pending
      this.pending.splice(this.pending.indexOf(songID), 1)

      // add to downloads in progress
      this.inProgress.push(songID)

      // start worker
      let downloadWorker = new Worker('./scripts/downloadSong.js')
      downloadWorker.postMessage({
        songID: songID, 
        songStoragePos: songStoragePos
      })

      // when worker returns finished download
      downloadWorker.onmessage = async () => {

        // remove from in progress
        this.inProgress.splice(this.inProgress.indexOf(songID), 1)

        // add to download to finished
        this.finished.push(songID)

        // move queue
        this.moveQueue()

        resolve() 
      } 

      // stop after x seconds
      setTimeout(() => {
        if(this.finished.includes(songID)) return
        this.inProgress.splice(this.inProgress.indexOf(songID), 1)
        this.moveQueue()
        resolve()
      }, 10000)
    })
  }

}

