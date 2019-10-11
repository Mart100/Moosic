let player
let songDurationInterval

async function onSongClick(event, queue) {
  let id = event.target.id.replace('song-', '')
  if(id == undefined || id == '') return
  let database = await getData()
  let songs = database.songs
  let song = new Song(songs[id])

  if(song.youtubeID == undefined) song = new Song(searchResults[id])


  if(queue != undefined) {
    musicPlayer.setQueue(queue)
  }
  song.play()


}

async function getSongByID(id) {
  let database = await getData()
  let songs = database.songs
  console.log(songs, id, songs[id])
  let song = new Song(songs[id])
  return song
}

$(() => {
  musicPlayer.on('pause', () => {
    $('#currentSong .play').fadeIn()
    $('#currentSong .pause').fadeOut()
    $('#musicControls .play').fadeIn()
    $('#musicControls .pause').fadeOut()
    console.log('HALLO')
  })

  musicPlayer.on('unpause', () => {
    $('#currentSong .play').fadeOut()
    $('#currentSong .pause').fadeIn()
    $('#musicControls .play').fadeOut()
    $('#musicControls .pause').fadeIn()
  })

  musicPlayer.on('shuffle', () => {
    updateSongFocus()
    $('#musicControls .shuffle').addClass('on')
  })
  musicPlayer.on('unshuffle', () => {
    updateSongFocus()
    $('#musicControls .shuffle').removeClass('on')
  })
  musicPlayer.on('play', () => {
    setCurrentSong(musicPlayer.currentSong)
  })
})

function setCurrentSong(song) {
  $('#currentSong .image').attr('src', song.image)
  $('#currentSong .title').html(song.title)
  $('#currentSong .play').fadeOut()
  $('#currentSong .pause').fadeIn()

  $('#currentSong .play').on('click', () => { 
    musicPlayer.unpause()
    return false
    
  })

  $('#currentSong .pause').on('click', () => { 
    musicPlayer.pause()
    return false
  })


  if(songDurationInterval != undefined) clearInterval(songDurationInterval)

  songDurationInterval = setInterval(() => {
    let dur = musicPlayer.getDuration()
    let elap = musicPlayer.getCurrentTime()
    $('#currentSong #progress').css('width', `${(elap/dur) * 100}%`)
  }, 1000)
}