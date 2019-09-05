async function createNewCollection() {
  let database = await getData()

  // get name for collection
  let avaibleName = ''
  let avaibleNameI = 0
  while(avaibleName == '') {
    let name = 'Collection - '+avaibleNameI
    if(database.collections.find(c => c.name == name) == undefined) avaibleName = name
    avaibleNameI++
  }

  let collection = {
    name: avaibleName,
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