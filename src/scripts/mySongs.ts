$(() => {
  $('#likedSongs-button').on('click', async (event) => {
    let database = await getData()
    let songs = database.songs
    songs = Object.values(songs)
    songs = songs.filter(s => s.liked == true)
    songs.sort((a, b) => a.order-b.order)
    $('#mySongsMenu').hide()
    $('#mySongs .songs').show()
    showSongs(songs, {})
  })

  $('#allSongs-button').on('click', async (event) => {
    let database = await getData()
    let songs = Object.values(database.songs)
    $('#mySongsMenu').hide()
    $('#mySongs .songs').show()
    showSongs(songs, {})
  })
  
  $('#newCollection-button').on('click', async (event) => {

    await createNewCollection()
    await loadCollections()

  })
})


async function refreshSongs(songs, options) {
  if(!options) {
    options = {
      inDB: false
    }
  }
  let newSongs = []
  
  let database = await getData()
  for(let i in songs) {
    let song: Song = songs[i]
    let songID = song.youtubeID
    let songDB = database.songs[songID]
    let newSong
    if(songDB != undefined) newSong = new Song(songDB)
    else {
      if(options.inDB) continue
      else newSong = new Song(song)
    }
    newSongs.push(newSong)
  }

  return newSongs
}

let currentCollection = 'none'

async function loadCollections() {
  $('.collection-button').remove()
  let database:database = await getData()
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
      showSongs(collectionSongs, {})
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
          let newName = renameInput.val().toString()
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
        let collectionSongs: Song[] = Object.values(database.songs).filter((s: Song) => collection.songs.includes(s.youtubeID))
        for(let song of collectionSongs) {
          song = new Song(song)
          song.download({})
        }
      })
      options.find('.likeAll').on('click', async (e) => {
        database = await getData()
        let collectionSongs: Song[] = Object.values(database.songs).filter((s: Song) => collection.songs.includes(s.youtubeID))
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