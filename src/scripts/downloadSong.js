let ytdl = require('ytdl-core')
let fs = require('fs-extra')

onmessage = async function(e) {

  let start = Date.now()

  let songID = e.data.songID
  let songStoragePos = e.data.songStoragePos

  let stream = ytdl(`http://www.youtube.com/watch?v=${songID}`, {
    filter: 'audio',
  })

  let songLoc = songStoragePos + `\\${songID}.mp3`

  let ws = fs.createWriteStream(songLoc)
  stream.pipe(ws)
  ws.on('finish', () => { postMessage('1') })

}