let searchResults = []

$(() => {

  // load youtube api
  setTimeout(() => {
    gapi.client.load('youtube', 'v3', () => {
      gapi.client.setApiKey('AIzaSyCIM4EzNqi1in22f4Z3Ru3iYvLaY8tc3bo') //AIzaSyC_aHKYFGGEZ_dShlVukoYmlR1ZufAIbzA
    })
  }, 1000)


  $('#search .input').on('change', async () => {

    $('#search .results').html('')

    console.log('HMMM')

    searchResults = []

    if($('#search .input').val() == '') return

    let results = await getYoutubeResults()

    for(let video of results) {
      let song = new Song().importFromYoutube(video)
      searchResults[song.youtubeID] = song
    }
    setSortByNone()
    showSongs(searchResults, {topBar: false})
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
      resolve(response.result.items)
    })
  })
}