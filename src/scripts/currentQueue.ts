let progressBarInterval

$(() => {
  $('#currentSong').on('click', () => {
    $('#currentQueue').fadeIn()
    updateSongFocus()
  })

  musicPlayer.on('play', () => { updateSongFocus() })

  // on progress bar click
  $('#currentQueue .currentSong .progressBackground').on('click', (event) => {
    let x = event.offsetX
    let duration = musicPlayer.getDuration()
    let newTime = (x / event.target.clientWidth) * duration
    musicPlayer.setCurrentTime(newTime)
    $('#currentQueue .currentSong .progress').css('width', `${(newTime/duration)*100}%`)
  })

  $('#currentQueue .currentSong .exit').on('click', () => {
    $('#currentQueue').animate({'top': '125%'}, 500, () => {
      $('#currentQueue').hide()
      $('#currentQueue').css('top', '0px')
      $('#queue').html('')
      $('#queue').hide()
    })
  })
})

// music controls
$(() => {
  $('#musicControls .play').on('click', () => { musicPlayer.unpause() })
  $('#musicControls .pause').on('click', () => { musicPlayer.pause() })
  $('#musicControls .next').on('click', () => { musicPlayer.nextInQueue() })
  $('#musicControls .previous').on('click', () => { musicPlayer.previousInQueue() })
  $('#musicControls .shuffle').on('click', () => {
    if(musicPlayer.isShuffled) musicPlayer.unShuffleQueue()
    else musicPlayer.shuffleQueue() 
  })
  $('#musicControls .repeat').on('click', () => {
    let a = !musicPlayer.repeat
    musicPlayer.repeat = a
    if(a) $('#musicControls .repeat').addClass('on')
    else $('#musicControls .repeat').removeClass('on')
  })
  $('#musicControls .volume .volume_input').on('input', () => {
    musicPlayer.setVolume($('#musicControls .volume .volume_input').val())
  })
})

function updateSongFocus() {
  $('#currentQueue .songs').show()
  let song = musicPlayer.currentSong
  if(song == undefined) return
  $('#currentQueue .currentSong .image').attr('src', song.image)

  // keep setting the progress bar
  clearInterval(progressBarInterval)
  progressBarInterval = setInterval(() => {
    let progress = musicPlayer.getCurrentTime()/musicPlayer.getDuration()
    $('#currentQueue .currentSong .progress').css('width', `${progress*100}%`)
  }, 1000)

  // set queue
  $('#queue').html('')
  let queue = musicPlayer.queue
  showSongs(queue, {topBar: false, sort: false, songFocusID: song.youtubeID})
}