let player

async function onSongClick(event, queue) {
  let id = event.target.id.replace('song-', '')

  if(id == undefined || id == '' || !$(event.target).hasClass("song")) {
    let songsElem = getCurrentSongsElement()
    let filters = songsElem.find('.topBar .filters')
    if(filters.hasClass("expanded")) filters.removeClass("expanded")
    return
    
  }
  console.log("SongClick: "+id)

  let song = await getSongByID(id)

  if(song == undefined || song.youtubeID == undefined) song = new Song(currentSongList.find(s => s.youtubeID == id))
  if(song == undefined || song.youtubeID == undefined) song = new Song(searchResults[id])

  if(queue != undefined) {
    musicPlayer.setQueue(queue)
  }
  song.play()
}



async function getSongByID(id) {
  let database = await getData()
  let songs = database.songs
  let song = songs.find(s => s.youtubeID == id)
  return song
}

$(() => {
  musicPlayer.on('pause', () => {
    $('#currentSong .play').fadeIn()
    $('#currentSong .pause').fadeOut()
    $('#musicControls .play').fadeIn()
    $('#musicControls .pause').fadeOut()
  })

  musicPlayer.on('unpause', () => {
    $('#currentSong .play').fadeOut()
    $('#currentSong .pause').fadeIn()
    $('#musicControls .play').fadeOut()
    $('#musicControls .pause').fadeIn()
  })

  let downloadAnimationInterval

  musicPlayer.on('downloadStart', () => {
    console.log('TESHJRTDSHFADSLFJSDALKFJSVLSMKKFL')
    $('#currentSong .subtitle').css('color', 'red')
    $('#currentSong .subtitle').html('Downloading...')
    let i = 0
    if(!downloadAnimationInterval) clearInterval(downloadAnimationInterval)
    downloadAnimationInterval = setInterval(() => {
      if(downloadAnimationInterval == undefined) return
      $('#currentSong .subtitle').html('Downloading'+(i%3==0 ? "." : (i%3==1 ? ".." : "...")))
      i++
    }, 500)
  })

  musicPlayer.on('downloadFinished', () => {
    clearInterval(downloadAnimationInterval)
    $('#currentSong .subtitle').html('')
    $('#currentSong .subtitle').css('color', '#b4b4b4')
    downloadAnimationInterval = undefined
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
  musicPlayer.on('durationUpdate', (event:durationUpdateEventPacket) => {

    let progress = event.time/event.duration

    // current small bottom song focus update progressbar
    $('#currentSong #progress').css({'width': `${progress * 100}%`})
    
    // Big song focus update progressbar
    $('#currentQueue .currentSong .progress').css({'width': `${progress*100}%`})

    // Update times big song focus
    $('#currentQueue .currentSong .currentTime').html(beutifySeconds(event.time))
    $('#currentQueue .currentSong .songDuration').html(beutifySeconds(event.duration))
  })
})

function setCurrentSong(song) {
  $('#currentSong .image img').attr('src', song.image.replace('mq', '').replace('default', 'mqdefault'))
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
}