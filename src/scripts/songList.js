let currentSongList = []
let filters = {}
resetFilters()

async function showSongs(songs, options) {

  if(!options) options = {}

  songs = await refreshSongs(songs)

  let songsElem = getCurrentSongsElement()

  if(songsElem == undefined) return console.log('ERR: 564')

  if(songsElem.find('.topBar')[0] == undefined) {
    songsElem.append(`    
      <div class="topBar">
        <input class="search" placeholder="Search songs"></input>
        <img class="filterButton" src="images/filter.png"/>
        <div class="filters">
          <div class="sortBy">
            <span class="title">Sort by:</span>
            <hr>
            <div id="sortby-lastadded" class="button2">Last added</div>
            <div id="sortby-alphabetic" class="button2">Alphabetic</div>
            <div id="sortby-lastplayed" class="button2">Last played</div>
          </div>
          <div class="filter">
            <span class="title">Filter:</span>
            <hr>
            <div id="filter-downloaded" class="button2">Downloaded</div>
            <div id="filter-liked" class="button2">Liked</div>
          </div>
        </div>
      </div>
    `)
    $('.button2').each((i, a) => {
      let b = a.id.split('-')
      let c = filters[b[0]][b[1]]
      if(c) $(a).addClass('selected')
    })
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

  // shuffle songs
  songs.sort((a, b) => Math.random()-0.5)

  // sort songs 
  if(filters.sortby.lastadded) songs.sort((a,b) => a.saveDate - b.saveDate)
  if(filters.sortby.lastplayed) songs.sort((a,b) => a.lastPlayed - b.lastPlayed)
  if(filters.sortby.alphabetic) {
    let alphabet = 'abcdefghijklmnopqrstuvxyz'
     songs.sort((a,b) => {
      if(a.title > b.title) return 1
      if(b.title > a.title) return -1
      return 0
    })
  }

  let searchTxt = songsElem.find('.topBar .search').val()
  if(searchTxt) searchTxt = searchTxt.toLowerCase()
  let searchFilter = (searchTxt != undefined) && (searchTxt != "")

  let songsHtml = ''
  for(let songObj of songs) {
    let song = new Song(songObj)
    let filterOut = false

    if(searchFilter) {
      let songTxt = (song.title + ' ' + song.author).toLowerCase()
      if(songTxt.includes(searchTxt) == false) filterOut = true
    }

    if(filters.filter.liked) if(!song.liked) continue
    if(filters.filter.downloaded) if(song.downloadLocation == undefined) continue

    if(filterOut) continue
    songsHtml += song.getHTML()
  }

  songListElem.append(songsHtml)

  for(let song of songs) {
    if(song.liked) $(`.songs #song-${song.youtubeID} .buttons .like`).attr('src', './images/red-heart.png')
  }

  scrollToCurrentSong()

  let topBar = songsElem.find('.topBar')

  topBar.find('.search').off().on('input', () => {
    showSongs(songs)
  })

  $('.button2').off().on('click', (e) => {
    $(e.target).toggleClass('selected')

    let a = e.target.id.split('-')[0]
    let b = e.target.id.split('-')[1]

    if($(e.target).hasClass('selected')) {
      filters[a][b] = true

      if(a == 'sortby') {
        $('.sortby .button2').removeClass('selected')
        $(e.target).addClass('selected')
        filters.sortby.alphabetic = false
        filters.sortby.lastplayed = false
        filters.sortby.lastadded = false
        filters[a][b] = true
      }

    }
    else {
      filters[a][b] = false

      if(a == 'sortby') {
        $(e.target).trigger('click')
      }
    }

    showSongs(songs)
  })

  let filterButton = topBar.find('.filterButton')
  let filtersDiv = topBar.find('.filters')
  filterButton.off().on('click', () => {
    filtersDiv.toggleClass('expanded')
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

function resetFilters() {
  filters = {
    filter: {
      downloaded: false,
      liked: false,
    },
    sortby: {
      lastadded: true,
      alphabetic: false,
      lastplayed: false
    }
  }
}

function getCurrentSongsElement() {
  return $(Object.values($('.songs')).filter(e => $(e).hasClass('songs') && $(e).css('display') != 'none')[0])
}

function scrollToCurrentSong() {
  let currentSong = musicPlayer.currentSong
  if(currentSong == undefined) return
  let songElem = $(`#song-${currentSong.youtubeID}`)
  let songHeight = $(`#song-${currentSong.youtubeID}`).scrollTop()
  let songsContainer = getCurrentSongsElement().find('.songList')
  songsContainer.animate({
    scrollTop: songElem.offset().top - songsContainer.offset().top + songsContainer.scrollTop()
  })
}