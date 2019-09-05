let ytdl = require('ytdl-core')
let fs = require('fs-extra')

onmessage = async function(e) {

  let start = Date.now()

  let songID = e.data.songID
  let storagePos = e.data.storagePos

  let stream = ytdl(`http://www.youtube.com/watch?v=${songID}`, {
    filter: 'audio',
  })

  let downloadLoc = storagePos + `/songs/${songID}.mp3`

  let ws = fs.createWriteStream(downloadLoc)
  stream.pipe(ws)
  ws.on('finish', () => { postMessage('1') })

}