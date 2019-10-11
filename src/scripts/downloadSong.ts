let ytdl = require('ytdl-core')
let fs = require('fs-extra')

onmessage = async function(e) {

  let start = Date.now()

  let songID = e.data.songID
  let songStoragePos = e.data.songStoragePos

  let songLoc = songStoragePos + `\\${songID}.mp3`

  if(await fs.pathExists(songLoc)) return postMessage('1')

  let stream = ytdl(`https://www.youtube.com/watch?v=${songID}`, {
    filter: 'audio',
  })

  let ws = fs.createWriteStream(songLoc)
  stream.pipe(ws)
  ws.on('finish', () => { 
    postMessage('1')
  })

}