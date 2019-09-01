async function createNewCollection() {
  let database = await getData()
  let collection = {
    name: 'Collection - '+database.collections.length,
    songs: []
  }

  database.collections.push(collection)
  saveData(database)
}

async function addSongToCollection(song, collectionIDX) {
  if(song.youtubeID == undefined) return
  
  let database = await getData()
  if(Object.keys(database.songs).includes(song.youtubeID) == false) await song.save()

  saveData1((data) => {
    let collection = data.collections[collectionIDX]
    if(collection.songs.includes(song.youtubeID)) return data
    collection.songs.push(song.youtubeID)
    return data
  })
}