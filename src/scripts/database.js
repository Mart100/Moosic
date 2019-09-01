let databaseFileLoc = storagePos + '/database.json'

function getData() {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(databaseFileLoc, (err, obj) => {
      if (err) console.error(err)
      resolve(obj)
    })
  })
}

function saveData(obj) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(databaseFileLoc, obj, (err) => {
      if(err) console.error(err)
      resolve()
    })
  })
}

let savingStatus = false
async function saveData1(func) {
  await awaitSavingStatus()
  savingStatus = true
  let data = await getData()
  let newData = await func(data)
  await saveData(newData)
  savingStatus = false
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