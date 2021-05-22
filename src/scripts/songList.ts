let currentSongList:Song[] = []
let filters:any = {}
resetFilters()

interface showSongsOptions {
  topBar?:boolean
  sort?:boolean
  refresh?:boolean
  scrollCurrentSong?:boolean
  songFocusID?:string
  extraSubtitle?:object
}

async function showSongs(songs, options:showSongsOptions) {

  if(options.topBar == undefined) options.topBar = true
  if(options.sort == undefined) options.sort = true
  if(options.refresh == undefined) options.refresh = false
  if(options.scrollCurrentSong == undefined) options.scrollCurrentSong = true

  songs = await refreshSongs(songs, {})

  let songsElem = getCurrentSongsElement()

  if(songsElem == undefined || songsElem[0] == undefined) return console.log('ERR: 564')

  if(songsElem[0].parentElement.id == 'search') options.topBar = false

  if(songsElem.find('.topBar')[0] == undefined) songsElem.prepend(`    
    <div class="topBar">
      <input class="search" placeholder="Search songs">
      <img class="clearSearch" src="./images/delete.png">
      </input>
      <img class="filterButton" src="images/filter.png"/>
      <div class="filters">
        <div class="sortBy">
          <span class="title">Sort by:</span>
          <hr>
          <div id="sortby-lastadded" class="button2"><span>Last added</span></div>
          <div id="sortby-alphabetic" class="button2"><span>Alphabetic</span></div>
          <div id="sortby-lastplayed" class="button2"><span>Last played</span></div>
          <div id="sortby-mostplayed" class="button2"><span>Most played</span></div>
        </div>
        <div class="filter">
          <span class="title">Filter:</span>
          <hr>
          <div id="filter-downloaded" class="button2"><span>Downloaded</span></div>
          <div id="filter-liked" class="button2"><span>Liked</span></div>
        </div>
      </div>
    </div>
  `)

  $("#sortby-mostplayed").html('<span>Most played</span>')
  $('.filters .button2').each((i, a) => {
    let b = a.id.split('-')
    let c = filters[b[0]][b[1]]

    if(c) $(a).addClass('selected')
    else $(a).removeClass('selected')

    if(filters['sortby']['mostplayed']) {
      $("#sortby-mostplayed").html(`
      <span>Most played:</span>
      <div class="day">Today</div>
      <div class="week">This week</div>
      <div class="month">This month</div>
      <div class="year">This year</div>
      <div class="alltime">All time</div>
      `)
      $(`#sortby-mostplayed div.${filters.mostplayedmode}`).addClass('selected')
    }
  })

  songsElem.find('.topBar .clearSearch').off().on('click', () => {
    songsElem.find('.topBar .search').val('')
    options.refresh = true
    showSongs(songs, options)
  })

  if(options.topBar == false) songsElem.find('.topBar').remove()

  if(songsElem.find('.songList')[0] == undefined) songsElem.append(`<div class="songList"></div>`)

  let songListElem = songsElem.find('.songList')

  if(songs.length == 0) {
    if(songsElem.parent().attr('id') == 'search') return songListElem.html('^ Use input to search trough youtube ^')
    return songListElem.html('No songs here :(')
  }

  songs = Object.values(songs)

  let database:any = await getData()

  currentSongList = songs

  let refinedSongs = []
  
  let searchTxtVal = songsElem.find('.topBar .search').val()
  let searchTxt:string
  if(searchTxtVal) {
    searchTxt = searchTxtVal.toString().toLowerCase()
    songsElem.find('.topBar .clearSearch').show()
  } else {
    songsElem.find('.topBar .clearSearch').hide()
  }
  let searchFilter = (searchTxt != undefined) && (searchTxt != "")

  //console.log(filters)
  //console.log(options)

  let refreshSongList = (songListElem.html().length < 1 || options.refresh)
  //console.log('refreshSongList: ', refreshSongList)

  if(refreshSongList) {

    // construct refinedSongs
    for(let s of songs) {
      //if(s.image == undefined) console.log(s)
      let song: Song = new Song(s)
      
      let songLikedDB = database.songs.find((s) => s.id == song.youtubeID)?.liked
      if(songLikedDB == true) song.liked = true

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

    if(options.sort != false) {
      // first sort by order
      refinedSongs.sort((a,b) => a.order - b.order)
      
      // sort songs 
      if(filters.sortby.lastadded) {
        refinedSongs.sort((a,b) => {
          return b.saveDate - a.saveDate
        })
      }
      if(filters.sortby.mostplayed) {
        let mode = filters.mostplayedmode
        let now = Date.now()
        refinedSongs.sort((a, b) => {
          let scoreA = countMostPlayedScores(a, mode, now)
          let scoreB = countMostPlayedScores(b, mode, now)
          return scoreB-scoreA
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
    }

    currentSongList = refinedSongs

    let songsHtml = ''
    for(let s of refinedSongs) songsHtml += `<div class="song" style="height: ${songHeight-20}px" id="song-${s.youtubeID}"></div>`
    songListElem[0].innerHTML = songsHtml
  }

  songListElem.on('scroll', () => {
    let songNum = Math.floor(songListElem.scrollTop()/songHeight)
    let loadSize = Math.ceil(songListElem.height()/songHeight)+2
    for(let i=-2;i<loadSize;i++) loadSong(songNum+i, refinedSongs, songListElem)
  })

  songListElem.trigger('scroll')

  if(options.songFocusID) {
    let songFocus = refinedSongs.find(s => s.youtubeID == options.songFocusID)
    let songFocusIDX = refinedSongs.indexOf(songFocus)
    if(songFocusIDX > -1) {
      let songHeight = songFocusIDX*80
      console.log(songFocusIDX, songHeight)
      setTimeout(() => { songListElem[0].scrollTop = songHeight }, 100)
    }
  }
  else {
    if(options.scrollCurrentSong) scrollToCurrentSong()
    else {
      songListElem[0].scrollTop = 0
    }
  }

  let topBar = songsElem.find('.topBar')

  topBar.find('.search').off().on('input', () => {
    console.log('yoinks')
    options.refresh = true
    showSongs(songs, options)
  })

  $('.button2').off().on('click', (e) => {
    $(e.target).toggleClass('selected')


    let elem = e.target
    let subElem = false
    if(!$(elem).parent().hasClass("sortBy") && !$(elem).parent().hasClass("filter")) {
      elem = $(elem).parent()[0]
      subElem = true
    }

    let a = elem.id.split('-')[0]
    let b = elem.id.split('-')[1]

    if($(e.target).hasClass('selected') || subElem) {
      console.log(a, b)
      filters[a][b] = true

      if(a == 'sortby') {
        $('.sortby .button2').removeClass('selected')
        $(e.target).addClass('selected')
        filters.sortby.alphabetic = false
        filters.sortby.lastplayed = false
        filters.sortby.lastadded = false
        filters.sortby.mostplayed = false
        filters[a][b] = true

        if(b == 'mostplayed') {
          if(subElem) {
            console.log(e.target.classList)
            let mode = e.target.classList[0]
            $(e.target).addClass('selected')
            filters.mostplayedmode = mode
          } else {
            $("#sortby-mostplayed").html(`
            <span>Most played:</span>
            <div class="day">Today</div>
            <div class="week">This week</div>
            <div class="month">This month</div>
            <div class="year">This year</div>
            <div class="alltime">All time</div>
            `)
            return
          }
        }
      }
    }
    else {
      filters[a][b] = false

      if(a == 'sortby') {
        $(e.target).trigger('click')
      }
    }

    options.refresh = true
    showSongs(songs, {refresh:true})
    filtersDiv.toggleClass('expanded')
  })

  let filterButton = topBar.find('.filterButton')
  let filtersDiv = topBar.find('.filters')
  let filtersButtonCooldown = Date.now()
  filterButton.off().on('click', () => {
    if(Date.now() - filtersButtonCooldown < 300) return 
    filtersDiv.toggleClass('expanded')
    if(filtersDiv.hasClass('expanded')) {
      let autoHeight = filtersDiv.css('height', 'auto').height()
      filtersDiv.css('height', '0px')
      filtersDiv.animate({'height': autoHeight}, 300, () => {
        filtersDiv.css('height', 'auto')
      })
    } else {
      filtersDiv.animate({'height': '0px'}, 300)
    }

  })
  filtersDiv.parent().on('mouseleave', (event) => {
    console.log("Yes", event)
    if(!filtersDiv.hasClass('expanded')) return
    filtersDiv.removeClass('expanded')
    filtersDiv.css('height', '167px')
    filtersDiv.animate({'height': '0px'}, 200)
  })

  console.log(`SHOW SONGLIST`)
}

async function refreshCurrentSongList() {
  let list:Song[]
  let songs = await getSongs()
  
  for(let song of currentSongList) {
    let song2 = new Song(songs[song.youtubeID])
    list.push(song2)
  }

  return list
}

function countMostPlayedScores(song:Song, mode:string, now:number):number {
  let score = 0
  for(let dateM of song.playedTimes) {
    let dateMs = dateM*60*1000
    if(mode == 'day' && now-dateMs < 1000*60*60*24) score++
    if(mode == 'week' && now-dateMs < 1000*60*60*24*7) score++
    if(mode == 'month' && now-dateMs < 1000*60*60*24*31) score++
    if(mode == 'year' && now-dateMs < 1000*60*60*24*365) score++
    if(mode == 'alltime') score++
  }
  return score
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
      mostplayed: false,
      none: false
    },
    mostplayedmode: 'day'
  }
}

function setSortByNone() {
  filters.sortby.lastadded = false
  filters.sortby.alphabetic = false
  filters.sortby.lastplayed = false
  filters.sortby.mostplayed = false
  filters.sortby.none = true
  filters.mostplayedmode
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

  if(songListElem.find(`#song-${song.youtubeID}`)[0] == undefined) return
  if(songListElem.find(`#song-${song.youtubeID}`).html().length != 0) return

  let songHTML = $(song.getHTML())

  if(song.liked) songHTML.find(` .buttons .like`).attr('src', './images/red-heart.png')

  let SSP = songHeight/5 // Song Style Padding
  let RSH = songHeight-SSP // Real Song Height
  let buttonsHeight = RSH
  let buttonsWidth = 40
  let buttonsPadding = 0
  let likeButtonSize = (RSH-8)/2-10
  let moreButtonSize = (RSH-8)/2
  if((likeButtonSize + 10 + moreButtonSize + 8) < 50) {
    likeButtonSize = (RSH-8)/1.4-10
    moreButtonSize = (RSH-8)/1.4
    buttonsWidth = 80
    buttonsPadding = (RSH - RSH/1.4)/2
    buttonsHeight = RSH-buttonsPadding*2
  }
  songHTML.css({'height': songHeight-SSP, 'padding': SSP/2-1})
  songHTML.find('.like').css({'height': likeButtonSize, 'width':likeButtonSize })
  songHTML.find('.buttons').css({'height': buttonsHeight, 'width': buttonsWidth, 'padding': buttonsPadding})
  songHTML.find('.more').css({'height': moreButtonSize, 'width': moreButtonSize })
  songHTML.find('.image').css({'height': RSH, 'width': RSH})

  songListElem.find(`#song-${song.youtubeID}`).replaceWith(songHTML)

  // on song click. Play song
  songHTML.on('click', (e) => { onSongClick(e, currentSongList) })

  // like button
  songHTML.find('.like').on('click', async (e) => {
    let song = songs.find(s => s.youtubeID == e.target.parentElement.parentElement.id.replace('song-', ''))
    if(song.liked) {
      await song.dislike()
      console.log('test')
      $(e.target).attr('src', './images/heart.png') 
    }
    else {
      await song.like()
      $(e.target).attr('src', './images/red-heart.png') 
    }
  })

  songHTML.find('.more').on('click', async (event) => {
    showTooltipForSong(song)
  })
}

async function showTooltipForSong(song:Song, options?) {
  console.log('tooltip func')

  let database = await getData()
  let songsElem = getCurrentSongsElement()
  let songElem = songsElem.find('#song-'+song.youtubeID)

  let isDownloaded = await song.isDownloaded()
  let downloadText = 'Download'
  if(isDownloaded) downloadText = 'Redownload'

  if(songElem.find('.tooltip')[0]) songElem.find('.tooltip').remove()
  let tooltipHTML = $(`
  <div class="tooltip songtooltip">
    <button class="download">${downloadText}</button>
    <button class="openInYoutube">Open in youtube</button>
    <button class="addToCollection">Add to collection</button>
    <button class="playSimularSongs">Play similar songs</button>
    <button class="saveSongAs">Save song as</button>
    <button class="cut">Cut song</button>
    <button class="songInfo">Song info</button>
    <button class="deleteSong">Delete songs</button>
  </div>
  `)

  // if part of collection
  let currentColl = database.collections.find(c => c.name == currentCollection)
  let showRemoveFromColl = currentColl && currentColl.songs.includes(song.youtubeID)
  if(showRemoveFromColl) tooltipHTML.append('<button class="removeFromColl">Remove from this collection</button>')

  

  let parent = songElem.parent()
  let tooltip
  let moreButton = parent.find('.more')

  if(options && options.pos) {
    $('body').append(tooltipHTML)
    tooltip = $('body').find('.tooltip')
    tooltip.css({
      position: 'absolute',
      left: `${options.pos.x}px`,
      top: `${options.pos.y}px`,
      transform: 'translateX(-100%)'
    })
  } else {
    songElem.prepend(tooltipHTML)
    tooltip = parent.find('.tooltip')
  }

  tooltip.on('mouseleave', () => {
    tooltip.remove()
  })
  moreButton.on('mouseleave', async () => {
    await sleep(100)
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
    let songidx = currentSongList.indexOf(currentSongList.find(s => s.youtubeID == song.youtubeID))
    if(songidx > -1) currentSongList.splice(songidx, 1)
    showSongs(currentSongList, {refresh: true})
  })

  tooltip.find('.cut').on('click', async (e) => {
    openCutSong(song)
  })

  tooltip.find('.playSimularSongs').on('click', async (e) => {
    let relatedVideos: any = await getRelatedVideosYT(song.youtubeID)
    let relatedSongs: Song[] = []
    for(let vid of relatedVideos) relatedSongs.push(await new Song().importFromYoutube(vid))
    $('#songsPopup').fadeIn()
    $('#songsPopup .songs').fadeIn()
    setSortByNone()
    showSongs(relatedSongs, {refresh: true})
    musicPlayer.setQueue(relatedSongs)
    musicPlayer.nextInQueue()
  })
  tooltip.find('.saveSongAs').on('click', async (e) => {
    FileSaver.saveAs(song.getDownloadLocation(), `${song.title}.mp3`)
  })
  tooltip.find('.download').on('click', async (e) => {
    song.download({redownload: true})
  })
  tooltip.find('.openInYoutube').on('click', async (e) => {
    openURL(`https://youtube.com/watch?v=${song.youtubeID}`)
  })
  tooltip.find('.songInfo').on('click', async (e) => {
    let info = `
    song title: ${song.title}
    song thumbnail: ${song.image}
    song author: ${song.author}
    Last played: ${new Date(song.lastPlayed).toString()}
    saveDate: ${new Date(song.saveDate).toString()}
    youtubeID: ${song.youtubeID}
    total Played: ${song.playedTimes.length}
    `
    window.alert(info)
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