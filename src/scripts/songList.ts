let currentSongList = []
let filters:any = {}
resetFilters()

async function showSongs(songs, options) {

  if(!options) options = {}

  songs = await refreshSongs(songs, {})

  let songsElem = getCurrentSongsElement()

  if(songsElem == undefined) return console.log('ERR: 564')

  if(songsElem[0].parentElement.id == 'search') options.topBar = false

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

  let database:any = await getData()

  currentSongList = songs

  // shuffle songs
  /*
  if(!filters.sortby.none) songs.sort((a, b) => Math.random()-0.5)*/

  let refinedSongs = []

  
  let searchTxtVal = songsElem.find('.topBar .search').val()
  let searchTxt:string
  if(searchTxtVal) searchTxt = searchTxtVal.toString().toLowerCase()
  let searchFilter = (searchTxt != undefined) && (searchTxt != "")


  // construct refinedSongs
  for(let s of songs) {
    //if(s.image == undefined) console.log(s)
    let song: Song = new Song(s)
    let filterOut = false

    if(searchFilter) {
      let songTxt = (song.title + ' ' + song.author).toLowerCase()
      if(songTxt.includes(searchTxt) == false) filterOut = true
    }

    if(filters.filter.liked) if(!song.liked) continue
    if(filters.filter.downloaded) if(song.isDownloaded() == undefined) continue

    if(filterOut) continue
    
    refinedSongs.push(song)
  }
  // first sort by order
  refinedSongs.sort((a,b) => a.order - b.order)
  // sort songs 
  if(filters.sortby.lastadded) {
    refinedSongs.sort((a,b) => {
      return b.saveDate - a.saveDate
    })
  }
  if(filters.sortby.lastplayed) {
    refinedSongs.sort((a,b) => {

      let lastA = a.lastPlayed
      if(!lastA) a.lastPlayed = 0

      let lastB = b.lastPlayed
      if(!lastB) b.lastPlayed = 0

      return lastB - lastA
    })
  }
  if(filters.sortby.alphabetic) {
    let alphabet = 'abcdefghijklmnopqrstuvxyz'
     refinedSongs.sort((a,b) => {
      if(a.title > b.title) return 1
      if(b.title > a.title) return -1
      return 0
    })
  }



  let songsHtml = ''
  for(let s of refinedSongs) songsHtml += `<div class="song" id="song-${s.youtubeID}"></div>`

  songListElem[0].innerHTML = songsHtml

  songListElem.on('scroll', () => {
    let songNum = Math.floor(songListElem.scrollTop()/82)
    for(let i=-2;i<10;i++) loadSong(songNum+i, refinedSongs, songListElem)
  })

  songListElem.trigger('scroll')

  scrollToCurrentSong()

  let topBar = songsElem.find('.topBar')

  topBar.find('.search').off().on('input', () => {
    showSongs(songs, options)
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

    showSongs(songs, options)
  })

  let filterButton = topBar.find('.filterButton')
  let filtersDiv = topBar.find('.filters')
  filterButton.off().on('click', () => {
    filtersDiv.toggleClass('expanded')
  })

  console.log('SHUW SONGS')
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
      lastplayed: false,
      none: false
    }
  }
}

function setSortByNone() {
  filters.lastadded = false
  filters.alphabetic = false
  filters.lastplayed = false
  filters.none = true
}
function getCurrentSongsElement() {
  return $(Object.values($('.songs')).filter(e => $(e).hasClass('songs') && $(e).css('display') != 'none')[0])
}

function scrollToCurrentSong() {
  let currentSong = musicPlayer.currentSong
  if(currentSong == undefined) return
  let songElem = $(`#song-${currentSong.youtubeID}`)
  if(songElem == undefined) return
  let songsContainer = getCurrentSongsElement().find('.songList')
  if(songsContainer.offset() == undefined) return
  if(songElem.offset() == undefined) return
  songsContainer.animate({
    scrollTop: songElem.offset().top - songsContainer.offset().top + songsContainer.scrollTop()
  })
}


function loadSong(idx:number, songs:Song[], songListElem:JQuery) {

  let song = songs[idx]

  if(song == undefined) return

  let songHTML = $(song.getHTML())

  if(song.liked) songHTML.find(` .buttons .like`).attr('src', './images/red-heart.png')

  songListElem.find(`#song-${song.youtubeID}`).replaceWith(songHTML)

  // on song click. Play song
  songHTML.on('click', (e) => { onSongClick(e, songs) })

  // like button
  songHTML.find('.like').on('click', async (e) => {
    let song = songs.find(s => s.youtubeID == e.target.parentElement.parentElement.id.replace('song-', ''))
    if(song.liked) {
      await song.dislike()
      e.target.src = './images/heart.png'
    }
    else {
      await song.like()
      e.target.src = './images/red-heart.png'
    }
  })

  songHTML.find('.more').on('click', async (event) => {
    showTooltipForSong(song)
  })
}

async function showTooltipForSong(song:Song) {
  console.log('teststst')

  let database = await getData()
  let songsElem = getCurrentSongsElement()
  let songElem = songsElem.find('#song-'+song.youtubeID)

  let tooltipHTML = $(`
  <div class="tooltip">
    <button class="download">Download</button>
    <button class="openInYoutube">Open in youtube</button>
    <button class="addToCollection">Add to collection</button>
    <button class="playSimularSongs">Play simular songs</button>
    <button class="deleteSong">Delete songs</button>
  </div>
  `)

  // if part of collection
  let currentColl = database.collections.find(c => c.name == currentCollection)
  let showRemoveFromColl = currentColl && currentColl.songs.includes(song.youtubeID)
  if(showRemoveFromColl) tooltipHTML.append('<button class="removeFromColl">Remove from this collection</button>')

  songElem.append(tooltipHTML)

  let parent = songElem.parent()
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

  tooltip.find('.deleteSong').on('click', async (e) => {
    await song.delete()
    showSongs(currentSongList, {})
  })

  tooltip.find('.playSimularSongs').on('click', async (e) => {
    let relatedVideos: any = await getRelatedVideosYT(song.youtubeID)
    let relatedSongs: Song[] = []
    for(let vid of relatedVideos) relatedSongs.push(new Song().importFromYoutube(vid))
    $('#songsPopup').fadeIn()
    $('#songsPopup .songs').fadeIn()
    setSortByNone()
    musicPlayer.setQueue(relatedSongs)
    musicPlayer.nextInQueue()
  })
  tooltip.find('.download').on('click', async (e) => {
    song.download({})
  })
  tooltip.find('.openInYoutube').on('click', async (e) => {
    openURL(`https://youtube.com/watch?v=${song.youtubeID}`)
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
        addSongToCollection(song, collectionNum)
      })
    }

  })
}