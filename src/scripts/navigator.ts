$(() => {
  $('#navigator li').on('click', async (event) => {
    $('#navigator li').removeClass('selected')
    $(event.target).addClass('selected')

    let name = event.target.className.split(' ')[0]

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
      $('#search').fadeIn()
      $('#search .input').focus()
      if(searchResults) showSongs(searchResults, {topBar: false})
    }

    if(name == 'mySongs') {
      $('#mySongs .songs').hide()
      $('#mySongsMenu').show()
      $('#mySongs').fadeIn()
      loadCollections()
    }

    if(name == 'settings') {
      $('#settings').fadeIn()
      $('#settings .thing1').hide()
      $('#settings-main').fadeIn(250)

      // enable/disable discord RPC
      if(database.settings.discordRPC) $('#discordRPC-button').html('Disable discord RPC')
      else $('#discordRPC-button').html('Enable discord RPC')
    }
  })
})