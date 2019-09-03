let currentSongList = []

async function showSongs(songs, options) {

  if(!options) options = {}

  songs = await refreshSongs(songs)

  let songsElem = $(Object.values($('.songs')).filter(e => $(e).hasClass('songs') && $(e).css('display') != 'none')[0])

  if(songsElem == undefined) return console.log('ERR: 564')

  if(songsElem.find('.topBar')[0] == undefined) {
    songsElem.append(`    
      <div class="topBar">
        <input class="search" placeholder="Search songs"></input>
      </div>
    `)
  }

  if(options.topBar == false) {
    songsElem.find('.topBar').remove()
  }

  if(songsElem.find('.songList')[0] == undefined) {
    songsElem.append(`<div class="songList"></div>`)
  }

  let songListElem = songsElem.find('.songList')

  songListElem.html('')

  songs = Object.values(songs)

  let database = await getData()

  currentSongList = songs

  let searchTxt = songsElem.find('.topBar .search').val()
  if(searchTxt) searchTxt = searchTxt.toLowerCase()
  let filter = (searchTxt != undefined) && (searchTxt != "")

  let songsHtml = ''
  for(let songObj of songs) {
    let song = new Song(songObj)
    if(filter) {
      let filterOut = false
      let songTxt = (song.title + ' ' + song.author).toLowerCase()
      if(songTxt.includes(searchTxt) == false) filterOut = true

      if(filterOut) continue
    }
    songsHtml += song.getHTML()
  }

  songListElem.append(songsHtml)

  for(let song of songs) {
    if(song.liked) $(`.songs #song-${song.youtubeID} .buttons .like`).attr('src', './images/red-heart.png')
  }

  songsElem.find('.topBar .search').off().on('input', () => {
    showSongs(songs)
  })

  console.log('SHUW SONGS')

  $('.song').off().on('click', (e) => { onSongClick(e, songs) })
  $('.song .like').off().on('click', async (e) => {
    let song = new Song(songs.find(s => s.youtubeID == e.target.parentElement.parentElement.id.replace('song-', '')))
    if(song.liked) {
      await song.dislike()
      e.target.src = './images/heart.png'
    }
    else {
      await song.like()
      e.target.src = './images/red-heart.png'
    }
  })

  $('.song .more').off().on('click', async (event) => {

    if($(event.target.parentElement).find('.tooltip')[0] != undefined) return

    let song = new Song(songs.find(s => s.youtubeID == event.target.parentElement.parentElement.id.replace('song-', '')))

    let html1 = $(`
    <div class="tooltip">
      <button class="download">Download</button>
      <button class="openInYoutube">Open in youtube</button>
      <button class="addToCollection">Add to collection</button>
    </div>
    `)

    // if part of collection
    let currentColl = database.collections.find(c => c.name == currentCollection)
    let showRemoveFromColl = currentColl && currentColl.songs.includes(song.youtubeID)
    if(showRemoveFromColl) html1.append('<button class="removeFromColl">Remove from this collection</button>')

    $(event.target.parentElement).append(html1)

    let parent = $(event.target.parentElement)
    let tooltip = parent.find('.tooltip')
    let moreButton = parent.find('.more')

    tooltip.on('mouseleave', () => {
      tooltip.remove()
    })
    moreButton.on('mouseleave', () => {
      if(parent.find('.tooltip:hover').length != 0) return
      tooltip.remove()
    })
    if(showRemoveFromColl) {
      tooltip.find('.removeFromColl').on('click', async () => {
        await saveData1((data) => {
          let currentColl1 = data.collections.find(c => c.name == currentCollection)
          let idx = currentColl1.songs.indexOf(song.youtubeID)
          currentColl1.songs.splice(idx, 1)
          return data
        })
        parent[0].parentElement.remove()
      })
    }

    tooltip.find('.download').on('click', async (e) => {
      let song = new Song(songs.find(s => s.youtubeID == e.target.parentElement.parentElement.parentElement.id.replace('song-', '')))
      song.download()
    })
    tooltip.find('.openInYoutube').on('click', async (e) => {
      let song = new Song(songs.find(s => s.youtubeID == e.target.parentElement.parentElement.parentElement.id.replace('song-', '')))
      open(`https://youtube.com/watch?v=${song.youtubeID}`)
    })
    tooltip.find('.addToCollection').on('click', async (e) => {
      tooltip.html('')
      database = await getData()
      let collections = database.collections
      
      for(let collectionNum in collections) {
        let collection = collections[collectionNum]
        tooltip.append(`<button id="addTo-coll-${collectionNum}">Add to "${collection.name}"</button>`)
        let addToCollButt = $(`#addTo-coll-${collectionNum}`)
        addToCollButt.off().on('click', async (e1) => {
          let song = new Song(songs.find(s => s.youtubeID == e1.target.parentElement.parentElement.parentElement.id.replace('song-', '')))
          addSongToCollection(song, collectionNum)
        })
      }

    })
  })
}