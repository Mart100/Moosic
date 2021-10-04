let searchResults:Song[] = []

$(() => {

  $('#search .input').on('change', async () => {

    $('#search .results').html('')

    searchResults = []

    if($('#search .input').val() == '') return

    let searchQuery = $('#search .input').val()

    let results:Song[] = await getYoutubeSearchResults(searchQuery)
    if(results) searchResults = results

    /*
    let results: any = await getYoutubeResults()
    for(let video of results) {
      let song = await new Song().importFromYoutube(video)
      searchResults[song.youtubeID] = song
    }*/

    setSortByNone()
    showSongs(searchResults, {topBar: false, scrollCurrentSong: false, refresh: true})
    $('#queue').hide()
  })
})

function loadYoutubeAPI() {
  // load youtube api
  gapi.client.load('youtube', 'v3', async () => {
    let data = await getData()
    let apiKey = data.settings.apiKey
    if(!apiKey) {
      apiKey = ["A", "I", "z", "a", "S", "y", "C", "U", "Z", "Q", "R", "3", "2", "G", "k", "e", "E", "X", "h", "9", "Z", "A", "9", "W", "a", "p", "v", "T", "P", "E", "l", "a", "w", "h", "T", "c", "r", "R", "4"].join("")
    }
    gapi.client.setApiKey(apiKey)
  })
}

function getYoutubeSearchResults(searchQuery):Promise<Song[]> {
  return new Promise((resolve, reject) => {

    ipcRenderer.send('getSongsQuery', searchQuery)
    ipcRenderer.once('getSongsQueryReply', async (event, songsData) => {

      if(songsData == undefined) resolve([])

      let songs:Song[] = []

      for(let songData of songsData) {
        let song = new Song() 
        song.duration = songData.duration
        song.title = songData.title
        song.author = songData.author
        song.views = songData.views
        song.image = `https://i.ytimg.com/vi/${songData.id}/default.jpg`
        song.youtubeID = songData.id
        songs.push(song)
      }
  
      resolve(songs)
  
    })

  })
}
