$(() => {
  $('#exportData-button').on('click', () => {
    // beutify json file
    let filename = storagePos + '/database.json'
    let codeStr = fs.readFileSync(filename).toString()
    let formattedCode = JSON.stringify(JSON.parse(codeStr), null, 2)
    fs.writeFileSync(filename, formattedCode)
    FileSaver.saveAs(filename, "Moosic-Data.json")
  })

  $('#appearance-button').on('click', () => {
    $('#settings-main').fadeOut(250, async () => {
      let database = await getData()
      $('#appearanceSettings').fadeIn(250)
      console.log('yatta yeet', database.settings.songTileSize)
      $('#appearanceSettings-songSize input').val(database.settings.songTileSize)
      
    })
  })

  $('#appearanceSettings-songSize input').on('input', async () => {
    let v = $('#appearanceSettings-songSize input').val()
    songHeight = Number(v)
    $('#appearanceSettings .songs').show()
    let songs = await getSongs()
    showSongs(songs, {refresh: true})
  })

  $('#appearanceSettings-songSize input').on('change', async () => {
    let v = $('#appearanceSettings-songSize input').val()
    saveData1((database) => {
      database.settings.songTileSize = v
      return database
    })
  })

  $('#importData-button').on('click', () => {
    $('#settings-main').fadeOut(250, () => {
      $('#importData').fadeIn(250)
    })
  })

  // import from spotify
  $('#importData-spotify-button').on('click', async () => {
    let accessToken: string = await getSpotifyAccessToken()
    await loadPlaylists(accessToken)
    $('#settings').hide()
    $('#playlistImportSpotify').fadeIn()
  })

  // import from youtube playlist 
  $('#importData-youtubePlaylist-button').on('click', async () => {
    eprompt('Youtube Playlist Import', 'Fill in youtube playlist link').then(async (userInput) => {
      let playlistLink = userInput
      let playlistID = userInput.split('list=')[1].split('&')[0]
      let playlistVideoLength = 1
      let playlistLastResponse:any
      let playlistNextPageToken:any = undefined
      let playlistVideos:Song[] = []
      console.log(playlistLink, playlistID || playlistNextPageToken == 0)
      while(playlistVideoLength > playlistVideos.length) {
        let response:any = await requestPlaylistVideos(playlistID, playlistNextPageToken)
        console.log(response)
        playlistVideoLength = response.pageInfo.totalResults
        playlistNextPageToken = response.nextPageToken
        if(playlistNextPageToken == undefined) playlistNextPageToken = 0
        playlistLastResponse = response
        for(let vid of response.items) playlistVideos.push(vid)
      }
      let playlistSongs = parseArrayToSongs(playlistVideos)
      console.log(playlistSongs)
      let collName = await createNewCollection('Youtube playlist')
      addSongsToCollection(playlistSongs, collName)
    })
  })

  $('#setStoragePos-button').on('click', () => { 
    let elem = $('<input type="file" webkitdirectory directory/>')

    elem.on('change', async (event) => {
      let newStoragePos = elem.prop('files')[0].path
      newStoragePos = newStoragePos.replace(/\\/g, '/')

      fs.copy(songStoragePos, newStoragePos, async (err) => {
        if (err) return console.error(err)
        console.log('success!')

        await saveData1((database) => {
          database.songStoragePos = newStoragePos
          return database
        })

        songStoragePos = newStoragePos
      })
    })

    elem.trigger('click')
  })

  // import from mp3 folder
  $('#importData-mp3Folder-button').on('click', () => {
    let elem = $('<input type="file" webkitdirectory directory/>')

    elem.on('change', async (event) => {
      let pos = elem.prop('files')[0].path
      pos = pos.replace(/\\/g, '/')

      fs.readdir(pos, async (err, files) => { 
        if(err) console.error(err)

        let songs = {}

        for(let idx in files) {
          let file = files[idx]
          let youtubeID = file.split('.')[0]
          let stats = fs.statSync(pos+'\\'+file)
          console.log(stats)
          let creationdate = stats.ctimeMs
          let accessedDate = stats.atimeMs
          let song = new Song({youtubeID: youtubeID, fillData: true, saveDate: creationdate, lastPlayed: accessedDate})
          songs[youtubeID] = song
          await sleep(10)
        }

        let collName = await createNewCollection('MP3 collection')

        await saveData1((database) => {

          let mergedSongs = { ...database.songs, ...songs}
          database.songs = mergedSongs

          database.collections.find(c => c.name == collName).songs = Object.keys(songs)

          return database
        })
        
        console.log('Done importing songs from mp3 folder')

      })

    })

    elem.trigger('click')
  })

  // import from Moosic save
  $('#importData-moosic-button').on('click', () => {
   $('body').append('<input id="fileInput" type="file" accept=".json"/>')
    let input = $('#fileInput')

    input.trigger('click')

    input.on('change', (event) => {
      let url = $('#fileInput').prop('files')[0].path

      // read file
      fs.readJson(url, async (err, obj) => {
        if(err) console.error(err)
        if(obj == undefined || obj.songs == undefined) return window.alert('Not a valid Moosic save file!')
        saveData1((data) => {
          return obj
        })
        songStoragePos = obj.songStoragePos
      })
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
      fs.readJson(url, async (err, obj) => {
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
            order: obj.collections.likes.order[trackID],
            saveDate: Date.now()
          }
          let song = new Song(trackData)
          songs[trackID] = song.getObject()
        }

        let collName = await createNewCollection('Headset save')

        await saveData1((database) => {

          let mergedSongs = { ...database.songs, ...songs}
          database.songs = mergedSongs

          database.collections.find(c => c.name == collName).songs = Object.keys(songs)

          return database
        })
        
        console.log('Done importing songs from headset')

      })
    })
  })

  $('#advanced-button').on('click', async () => {
    $('#settings-main').fadeOut(250, () => {
      $('#advancedSettings').fadeIn(250)
    })
  })

  $('#advancedSettings-repairSave').on('click', async () => {

    let songs = await getSongs()

    // rename youtube ID's with .mp3 in SAVE
    for(let songID in songs) {
      let song = songs[songID]
      if(songID.includes('.mp3')) {
        let newSongID = songID.replace('.mp3', '')
        let newSongData = song
        newSongData.youtubeID = newSongID
        let newSong = new Song(newSongData)
        new Song(song).deleteSave()
        console.log(newSong)
        newSong.save()
      }
    }

    // remove duplicate ID
    let songIDs = []
    for(let songID in songs) {
      let song = songs[songID]
      if(songIDs.includes(songID)) { 
        console.log(songID)
        song.deleteSave()
      }
      songIDs.push(songID)
    }

    // rename files with .mp3.mp3
    fs.readdir(songStoragePos, async (err, files) => { 
      if(err) console.error(err)
      for(let file of files) {
        if(file.includes('.mp3.mp3')) {
          let newFileName = file.replace('.mp3.mp3', '') + '.mp3'
          fs.rename(songStoragePos+'\\'+file, songStoragePos+'\\'+newFileName, (err) => {
            if(err) throw err
          })
        }
      }

    })

    console.log('Done repairing!')

  })

  $('#advancedSettings-addYoutubeData').on('click', async () => {
    let songs = await getSongs()
    let i = 0
    for(let songID in songs) {
      let song = songs[songID]
      if(song.title == undefined) {
        if(i > 0) continue
        let newSong = new Song({youtubeID: song.youtubeID, fillData: true})
        newSong.save()
        i++
      }
    }

    console.log('Tried adding to lost songs')
  })

  

  $('#advancedSettings-deleteLost').on('click', async () => {
    let songs = await getSongs()
    for(let songID in songs) {
      let song = songs[songID]
      if(song.title == undefined) {
        song.delete()
      } 
    }

    console.log('Deleted all lost songs')
  })

  $('#advancedSettings-downloadAllSongs').on('click', async () => {
    let songs = await getSongs()
    for(let songID in songs) {
      songs[songID].download({})
    }
  })

  $('#info-button').on('click', async () => {
    $('#settings-main').fadeOut(250, async () => {
      $('#info').fadeIn(250)

      let appVersion = require('electron').remote.app.getVersion()
      $('#moosicVersion').html('Version: ' + appVersion)
      
      let songs = await getSongs()
      let vSongs = Object.values(songs)

      $('#info-savedSongs').html('Saved Songs: '+vSongs.length)


      // get downloaded amount
      fs.readdir(songStoragePos, (err, files) => { 
        if(err) console.error(err)
        $('#info-downloadedSongs').html('Downloaded Songs: '+files.length)
      })
      
      require('get-folder-size')(songStoragePos, (err, size) => {
        if(err) throw err

        let songStorageSize = (size / 1024 / 1024).toFixed(2)
        $('#info-downloadedSongsStorageSize').html('Downloaded Songs storage size: ' + songStorageSize + ' MB')
      })

      $('#info-songsLocation').html("Songs Location: " + songStoragePos)

    })
  })

  $('#discordRPC-button').on('click', async () => {
    await saveData1((data) => { 
      data.settings.discordRPC = !data.settings.discordRPC
      return data
    })

    let database = await getData()

    if(database.settings.discordRPC) {
      $('#discordRPC-button').html('Disable discord RPC')
      setRPCactivity({state: musicPlayer.currentSong.title, startTimestamp: new Date() })
    }
    else {
      $('#discordRPC-button').html('Enable discord RPC')
      DiscordRPCclient.clearActivity()
    }
  }) 

  $('#deleteData-button').on('click', async () => {
    let confirm = window.confirm('Are you sure you want to delete all your data?')

    if(!confirm) return
    await createEmptyDatabase()

    musicPlayer.stop()

    fs.emptyDir(storagePos + '/songs')
  })

    // set youtube API key
    $('#advancedSettings-apikey').on('click', async () => {
      eprompt('Youtube API key', 'Youtube API key').then(async (userInput) => {
        await saveData1((data) => {
          data.settings.apiKey = userInput
          return data
        })
      })
    })
})

async function removeSongsWithMP3end() {
  await saveData1((data) => {
    let songs = data.songs
    for(let songID in songs) {
      let song = songs[songID]
      if(songID.includes('.mp3')) {
        delete data.songs[songID]
      }
    }

    return data
  })

  console.log('Done')
}