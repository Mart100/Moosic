async function createNewCollection(nameOption) {
  let database = await getData()

  if(nameOption == undefined) nameOption = 'Collection'

  // get name for collection
  let availableName = ''
  let availableNameI = 0
  while(availableName == '') {
    let name = nameOption+' - '+availableNameI
    if(database.collections.find(c => c.name == name) == undefined) availableName = name
    availableNameI++
  }

  let collection = {
    name: availableName,
    songs: []
  }

  await saveData1((database1) => {
    database1.collections.push(collection)
    return database1
  })

  return availableName
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