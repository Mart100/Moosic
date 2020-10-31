let databaseCache: database
let databaseCacheValid: boolean = false

interface database {
  songs: Song[]
  collections: databaseCollection[]
  songStoragePos: string
  settings: any

}

interface databaseCollection {
  name: string
  songs: string[]
}

let databaseFileLoc = storagePos + '/database.json'
let revertToBackupConfirm:boolean

function getRawData(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    fs.readFile(databaseFileLoc, 'utf8', async (err, obj) => {
      if(err) throw err
      resolve(obj)
    })
  })
}
function getData(): Promise<database> {
  return new Promise(async (resolve, reject) => {

    if(databaseCacheValid) return resolve(databaseCache)

    if(!await fs.pathExists(storagePos+'/database.json')) {
      await createEmptyDatabase()
    }

    await awaitSavingStatus()

    fs.readFile(databaseFileLoc, 'utf8', async (err, obj) => {
      if(err) {
        console.error(err)
        if(err.toString().includes('no such file or directory')) {
          await createEmptyDatabase()
          resolve(await getData())
        }
      }
      let objParsed:any

      try {
        objParsed = JSON.parse(obj)
      } catch(e) {
        console.error(e)
        if(revertToBackupConfirm == false) return
        revertToBackupConfirm = false
        let databasePos = storagePos+'/'+'database.json'
        let databaseBackupPos = storagePos+'/'+'database_backup.json'
        let stats = fs.statSync(databaseBackupPos)
        let backupDate = new Date(stats.mtimeMs)
        let txt = `
An error has occured:
${e}\n
This most likely means the database where your songs are stored has become corrupted.\n
Would you like to revert to a backup from:
${backupDate}
?`
        if(confirm(txt)) {
          revertToBackupConfirm = true
          fs.copyFile(databaseBackupPos, databasePos, (err) => {
            if(err) throw err;
            console.log('Successfully applied database_backup.json to database.json!')
            alert('Successfully backed up!')
          })
        } else {
          revertToBackupConfirm = false
        }
      }

      let DBsongs: Song[] = []

      for(let songID in objParsed.songs) {
        let songObj = objParsed.songs[songID]
        if(songObj.youtubeID == undefined) continue
        DBsongs.push(new Song(songObj))
      }

      let database:database = {
        songs: DBsongs,
        collections: objParsed.collections,
        songStoragePos: objParsed.songStoragePos,
        settings: objParsed.settings
      }

      databaseCache = database
      databaseCacheValid = true

      resolve(database)
    })
  })
}

function createStorageFolder() {
  return new Promise((resolve, reject) => {

    // create /storage
    fs.ensureDir(storagePos, err => {
      console.error(err)

      // create /storage/songs
      fs.ensureDir(storagePos+'/songs', async (err) => {
        console.error(err)
        
        // create /storage/database.json
        await createEmptyDatabase()

        resolve()
      })
    })
  })
}
function createEmptyDatabase() {
  return new Promise((resolve, reject) => {

    let obj = {
      "songs": {},
      "collections": [],
      "settings": {
        "discordRPC": false,
        "songTileSize": 80
      }
    }

    fs.writeJson(databaseFileLoc, obj, async (err) => {
      if(err) {
        console.error(err)
        if(err.toString().includes('no such file or directory')) await createStorageFolder()
      }
      databaseCacheValid = false
      resolve()
    })
  })
}

function saveData(obj) {
  obj = JSON.stringify(obj)
  return new Promise((resolve, reject) => {
    fs.writeFile(databaseFileLoc, obj, (err) => {
      if(err) console.error(err)
      resolve()
    })
  })
}

async function readDatabase() {
  return new Promise((resolve, reject) => {
    fs.readFile(databaseFileLoc, 'utf8', async (err, obj) => {
      if(err) console.error(err)
      obj = JSON.parse(obj)
      resolve(obj)
    })
  })
}

let savingStatus = false
async function saveData1(func) {
  await awaitSavingStatus()
  savingStatus = true
  let data = await readDatabase()
  let newData = await func(data)
  await saveData(newData)
  savingStatus = false
  databaseCacheValid = false
  return
}

async function awaitSavingStatus() {
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if(!savingStatus) {
        clearInterval(interval)
        resolve()
      }
    }, 100)
  })
} 