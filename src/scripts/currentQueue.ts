let progressBarInterval

$(() => {
  $('#currentSong').on('click', () => {
    $('#currentQueue').fadeIn()
    updateSongFocus()
  })

  musicPlayer.on('play', () => {
    let songElem = getCurrentSongsElement()
    if(songElem.attr('id') != 'queue') return
    updateSongFocus() 
  })

  let mouseDown:boolean = false

  $('#currentQueue .currentSong .progressBackground').on('mousedown', (event) => { 
    mouseDown = true
    updateCurrentSongProgressBarWhenMoving(event)
  })
  $(document).on('mouseup', (event) => { mouseDown = false })

  // on progress bar click
  $(document).on('mousemove', (event) => {
    if(mouseDown) updateCurrentSongProgressBarWhenMoving(event)
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

function updateCurrentSongProgressBarWhenMoving(event) {
  let x = event.offsetX
  let duration = musicPlayer.getDuration()
  let newTime = (x / event.target.clientWidth) * duration
  musicPlayer.setCurrentTime(newTime)
  $('#currentQueue .currentSong .progress').css('width', `${(newTime/duration)*100}%`)
}

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
  $('#musicControls .volume .low_volume').on('click', () => {
    $('#musicControls .volume .volume_input').val(0)
    $('#musicControls .volume .volume_input').trigger('input')
  })
  $('#musicControls .volume .high_volume').on('click', () => {
    $('#musicControls .volume .volume_input').val(100)
    $('#musicControls .volume .volume_input').trigger('input')
  })
  $('#musicControls .volume .volume_input').on('input', () => {
    musicPlayer.setVolume($('#musicControls .volume .volume_input').val())
  })
})

function updateSongFocus() {
  $('#currentQueue .songs').show()
  let song = musicPlayer.currentSong
  if(song == undefined) return
  $('#currentQueue .currentSong .image').attr('src', song.image.replace('mq', '').replace('default', 'hqdefault'))

  // set queue
  let queue = musicPlayer.queue
  showSongs(queue, {topBar: false, sort: false, refresh: false})
}