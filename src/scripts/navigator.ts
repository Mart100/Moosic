$(() => {
  $('#navigator li').on('click', async (event) => {
    $('#navigator li').removeClass('selected')
    $(event.target).addClass('selected')

    let name = event.target.className.split(' ')[0]

    $('#cutSong').hide()
    $('#search').hide()
    $('#mySongs').hide()
    $('#settings').hide()
    $('#currentQueue').hide()
    $('#playlistImportSpotify').hide()
    $('.songs').hide()
    $('#songsPopup').hide()
    resetFilters()

    let database = await getData()


    if(name == 'search') {
      $('#search .songs').show()
      $('#search').fadeIn(150)
      $('#search .input').focus()
      if(searchResults) showSongs(searchResults, {topBar: false})
    }

    if(name == 'mySongs') {
      $('#mySongs .songs').hide()
      $('#mySongsMenu').show()
      $('#mySongs').fadeIn(150)
      loadCollections()
    }

    if(name == 'settings') {
      $('#settings').fadeIn(150)
      $('#settings .thing1').hide()
      $('#settings-main').fadeIn(150)

      // enable/disable discord RPC
      if(database.settings.discordRPC) $('#discordRPC-button').html('Disable discord RPC')
      else $('#discordRPC-button').html('Enable discord RPC')
    }
  })
})