
onmessage = async function(e) {

  let songID = e.data.songID
  let storagePos = e.data.storagePos

  let ytdl = require('ytdl-core')
  let ffmpeg = require('fluent-ffmpeg')


  let stream = ytdl(`http://www.youtube.com/watch?v=${songID}`, {
    quality: 'highestaudio',
    filter: 'audio',
  })

  let downloadLoc = storagePos + `/songs/${songID}.mp3`

  await ffmpeg(stream)
    .save(downloadLoc)
    .on('end', () => {
      postMessage('1')
    })

}