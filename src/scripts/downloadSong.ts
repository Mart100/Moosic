let fs1 = require("fs-extra")
let ytdl1 = require("ytdl-core")

onmessage = async function(e) {

  let start = Date.now()

  let songID = e.data.songID
  let songStoragePos = e.data.songStoragePos

  let songLoc = songStoragePos + `\\${songID}.mp3`

  console.log(songLoc)

  if(await fs1.pathExists(songLoc)) return postMessage('1', undefined)

  let stream = ytdl1(`https://www.youtube.com/watch?v=${songID}`, {
    filter: 'audio',
  })

  let ws = fs1.createWriteStream(songLoc)
  stream.pipe(ws)
  ws.on('finish', () => { 
    postMessage('1', undefined)
  })

}
