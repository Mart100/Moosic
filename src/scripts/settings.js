$(() => {
  $('#exportData-button').on('click', () => {
    // beutify json file
    let filename = storagePos + '/database.json'
    let codeStr = fs.readFileSync(filename).toString()
    let formattedCode = JSON.stringify(JSON.parse(codeStr), null, 2)
    fs.writeFileSync(filename, formattedCode)
    FileSaver.saveAs(filename, "Moosic-Data.json")
  })

  $('#importData-button').on('click', () => {
    $('#settings-main').fadeOut(250, () => {
      $('#importData').fadeIn(250)
    })
  })

  // import from spotify
  $('#importData-spotify-button').on('click', async () => {
    let accessToken = await getSpotifyAccessToken()
    fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(res => res.json())
      .then(info => {
        console.log(info)
      })

  })

  // import likes from headset
  $('#importData-headset-button').on('click', () => {
    $('body').append('<input id="fileInput" type="file" accept=".json"/>')
    let input = $('#fileInput')

    input.trigger('click')

    input.on('change', (event) => {
      let url = $('#fileInput').prop('files')[0].path

      // read file
      jsonfile.readFile(url, async (err, obj) => {
        if (err) console.error(err)
        if (obj == undefined) return
        if (obj.collections == undefined) return
        if (obj.collections.likes == undefined) return
        let tracks = obj.collections.likes.tracks

        console.log(tracks)

        let songs = {}

        for (let trackID in tracks) {
          let track = tracks[trackID]

          let trackData = {
            youtubeID: trackID,
            image: track.thumbnail,
            title: track.title,
            author: track.artist,
            liked: false,
            saveDate: Date.now()
          }
          let song = new Song(trackData)
          songs[trackID] = song.getObject()
        }

        let database = await getData()
        let mergedSongs = {
          ...database.songs,
          ...songs
        }
        database.songs = mergedSongs
        saveData(database)
        console.log('Done importing songs')

      })
    })
  })

  $('#deleteData-button').on('click', async () => {
    let confirm = window.confirm('Are you sure you want to delete all your data?')

    if(!confirm) return
    await createEmptyDatabase()

    musicPlayer.stop()

    fs.emptyDir(storagePos + '/songs')
  })
})