let searchResults = []

$(() => {

  // load youtube api
  setTimeout(async () => {
    gapi.client.load('youtube', 'v3', async () => {
      let data = await getData()
      let apiKey = data.settings.apiKey
      if(!apiKey) {
        apiKey = ["A", "I", "z", "a", "S", "y", "C", "U", "Z", "Q", "R", "3", "2", "G", "k", "e", "E", "X", "h", "9", "Z", "A", "9", "W", "a", "p", "v", "T", "P", "E", "l", "a", "w", "h", "T", "c", "r", "R", "4"].join("")
      }
      gapi.client.setApiKey(apiKey)
    })
  }, 1000)


  $('#search .input').on('change', async () => {

    $('#search .results').html('')

    searchResults = []

    if($('#search .input').val() == '') return

    let results: any = await getYoutubeResults()

    console.log(results)

    for(let video of results) {
      let song = await new Song().importFromYoutube(video)
      searchResults[song.youtubeID] = song
    }
    setSortByNone()
    showSongs(searchResults, {topBar: false, scrollCurrentSong: false, refresh: true})
    $('#queue').hide()
  })
})

function getYoutubeResults() {
  return new Promise((resolve, reject) => {
    let q = $('#search .input').val()
    let request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet',
      type: 'video',
      topicId: '/m/04rlf',
      maxResults: 50
    })

    request.execute((response) => {
      if(!response.result) {
        console.error(response)
        return resolve({})
      }
      resolve(response.result.items)
    })
  })
}