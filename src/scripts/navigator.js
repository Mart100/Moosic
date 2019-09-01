$(() => {
  $('#navigator li').on('click', (event) => {
    $('#navigator li').removeClass('selected')
    $(event.target).addClass('selected')

    let name = event.target.className.split(' ')[0]

    $('#search').hide()
    $('#mySongs').hide()
    $('#settings').hide()
    $('#currentQueue').hide()
    $('.songs').hide()


    if(name == 'search') {
      $('#search .songs').show()
      $('#search').fadeIn()
      $('#search .input').focus()
      if(searchResults) showSongs(searchResults)
    }

    if(name == 'mySongs') {
      $('#mySongs .songs').hide()
      $('#mySongsMenu').show()
      $('#mySongs').fadeIn()
      loadCollections()
    }

    if(name == 'settings') {
      $('#settings').fadeIn()
    }
  })
})