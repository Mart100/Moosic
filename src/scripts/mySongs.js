$(() => {
  $('#likedSongs-button').on('click', async (event) => {
    let database = await getData()
    let songs = database.songs
    songs = Object.values(songs)
    songs = songs.filter(s => s.liked == true)
    songs.sort((a, b) => a.order-b.order)
    $('#mySongsMenu').hide()
    $('#mySongs .songs').show()
    showSongs(songs)
  })

  $('#allSongs-button').on('click', async (event) => {
    let database = await getData()
    let songs = Object.values(database.songs)
    $('#mySongsMenu').hide()
    $('#mySongs .songs').show()
    showSongs(songs)
  })
  
  $('#newCollection-button').on('click', async (event) => {

    await createNewCollection()
    await loadCollections()

  })
})

let currentCollection = 'none'
let currentSongList = []

async function showSongs(songs) {

  let songsElem = $(Object.values($('.songs')).filter(e => $(e).hasClass('songs') && $(e).css('display') != 'none')[0])

  if(songsElem == undefined) return console.log('ERR: 564')

  songs = Object.values(songs)

  let database = await getData()

  songsElem.html('')

  currentSongList = songs

  let songsHtml = ''
  for(let song of songs) songsHtml += new Song(song).getHTML()

  songsElem.append(songsHtml)

  console.log('SHUW SONGS')

  $('.song').on('click', (e) => { onSongClick(e, songs) })
  $('.song .like').on('click', async (e) => {
    console.log('YASS')
    let song = new Song(songs.find(s => s.youtubeID == e.target.parentElement.parentElement.id.replace('song-', '')))
    song.like()
    e.target.src = './images/red-heart.png'
  })

  $('.song .more').on('click', async (event) => {

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

async function loadCollections() {
  $('.collection-button').remove()
  let database = await getData()
  let collections = database.collections
  let songs = Object.values(database.songs)
  for(let collectionNum in collections) {
    let collection = collections[collectionNum]
    let html = `
    <div class="button1 collection-button" id="coll-${collectionNum}-button">
    <img class="options-button" src="./images/options.png" />
    <span class="name">${collection.name}</span>
    </div>
    `
    $('#newCollection-button').before(html)
    let button = $(`#coll-${collectionNum}-button`)
    button.on('click', async () => {
      $('#mySongsMenu').hide()
      $('#mySongs .songs').show()
      let collectionSongs = songs.filter(s => collection.songs.includes(s.youtubeID))
      currentCollection = collection.name
      showSongs(collectionSongs)
    }).children().click(e => false)

    button.find('.options-button').on('click', (event) => {
      button.append(`
      <div class="options">
        <button class="rename">Rename</button>
        <button class="downloadAll">Download all</button>
        <button class="likeAll">Like all</button>
        <button class="delete">Delete</button>
      </div>
      `)
      let parent = $(event.target.parentElement)
      let options = parent.find('.options')
      let optionsButton = parent.find('.options-button')

      options.click(e => {
        options.remove()
        return false
      })

      options.on('mouseleave', () => {
        options.remove()
      })
      optionsButton.on('mouseleave', () => {
        if(parent.find('.options:hover').length != 0) return
        options.remove()
      })

      options.find('.rename').on('click', async (e) => {
        button.find('.name').hide()
        button.append(`<input type="text" class="renameInput" placeholder="${collection.name}">`)
        let renameInput = button.find('.renameInput')
        renameInput.focus()
        renameInput.on('change', () => {
          let newName = renameInput.val() 
          renameInput.remove()
          button.find('.name').html(newName)
          button.find('.name').show()
          saveData1((data) => {
            data.collections[collectionNum].name = newName
            return data
          })
        })
        renameInput.on('click', () => false)
      })
      options.find('.downloadAll').on('click', async (e) => {
        database = await getData()
        let collectionSongs = Object.values(database.songs).filter(s => collection.songs.includes(s.youtubeID))
        for(let song of collectionSongs) {
          song = new Song(song)
          song.download()
        }
      })
      options.find('.likeAll').on('click', async (e) => {
        database = await getData()
        let collectionSongs = Object.values(database.songs).filter(s => collection.songs.includes(s.youtubeID))
        for(let song of collectionSongs) {
          song = new Song(song)
          song.like()
        }
      })
      options.find('.delete').on('click', async (e) => {
        if(!window.confirm(`Are you sure you want to delete collection: ${collection.name} ??`)) return
        await saveData1(data => {
          data.collections = data.collections.filter(c => c.name != collection.name)
          return data
        })
        loadCollections()
      })
    })
  }
  
}