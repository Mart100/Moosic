const wget = require('wget-improved')

async function checkForUpdates() {

  let thisVersion = remote.app.getVersion()
  let latestVersion = await getLatestRelease() //'1.2.9'

  console.log(`UPDATE?: current:${thisVersion} latest:${latestVersion}`)

  if(thisVersion == latestVersion) return

  let confirmMessage =
`
There seems to be a new update for Moosic:
Your version: ${thisVersion}
Latest version: ${latestVersion}

Do you want to install this update?
`

  let response = await window.confirm(confirmMessage)

  let installersLocation = storagePos + '/installers'
  let installerLocation = installersLocation + `/moosic-Setup-${latestVersion}.exe`

  if(response) {
    // check if file already exists
    fs.pathExists(installerLocation, async (err, exists) => {
      if(err) console.error(err)

      console.log('Installer exists: ', exists)
      console.log(installerLocation)

      // if file doesn't exist. Download Setup file from github
      if(!exists) await downloadFileFromURL(`https://github.com/Mart100/Moosic/releases/download/v${latestVersion}/moosic-Setup-${latestVersion}.exe`)

      cp.exec(installerLocation, (err, stdout, stderr) => {
        if(err) throw err 
      })
      setTimeout(() => {
        remote.getCurrentWindow().close()
      }, 1000)
    })
    
  }
}

async function downloadFileFromURL(file_url) {
  return new Promise(async (resolve, reject) => {
    // some things
    let file_name = file_url.split('/').pop()
    let downloadLoc = storagePos + '/installers'

    // prepare download window
    let win = remote.getCurrentWindow()
    win.setBounds({ width: 400, height: 200 })

    // make sure downloadLoc is avaible
    await fs.ensureDir(downloadLoc)

    // remove moosic window stuffs
    $('#index').remove()
    $('#currentSong').remove()
    $('#navigator').remove()
    $('iframe').remove()

    $('body').append(`
  <div id="loadingWin">
  <div class="title">Downloading ${file_name}...</div>
  <div class="progressBar"><div class="progress"></div></div>
  <div class="waitingTime">Estemaited waiting time: 0s</div>
  </div>
    `)

    let downloadStarted = new Date().getTime()
    console.log(file_url, downloadLoc+'/'+file_name)
    let download = wget.download(file_url, downloadLoc+'/'+file_name)

    download.on('error', (err) => {
      console.error(err)
    })

    download.on('end', (output) => {
      console.log(output)
      console.log(`Setup ${file_url.split('/').pop()} installed`)
      console.log(`${downloadLoc}/${file_name}`)
      setTimeout(() => { resolve(true) }, 1000)
    })

    download.on('progress', (progress) => {
      console.log(progress)
      let timeSinceStart = (new Date().getTime() - downloadStarted)/1000
      let totalTime = timeSinceStart / progress
      let timeToGo = Math.round(totalTime-timeSinceStart)

      $('#loadingWin .progressBar .progress').css('width', `${progress*100}%`)
      $('#loadingWin .waitingTime').html(`Estimated waiting time: ${timeToGo}s`)

    })

    /*
    // start actual download
    let proc = cp.exec(`wget ${file_url} -P ${downloadLoc}`, (err, stdout, stderr) => {
      if (err) throw err
      else {
        console.log(`Setup ${file_url.split('/').pop()} installed`)
        console.log(`${downloadLoc}\\${file_name}`)
        resolve(true)
      }
    })
    proc.stderr.on('data', (data) => {
      if(!data.includes('%')) return

      if(Math.random() < 0.9) return

      data = data.replace(/\./g, '').replace('\n', '')

      let progressProcent = data.match(/[0-9]{1,3}%/g) //data.split('%')[0].split(' ')[1]
      let waitingTime = data.match(/[0-9]{1,5}s/g) //.substring(data.indexOf('s')-2, data.indexOf('s'))
      
      //console.log(data, progressProcent, waitingTime)
      if(progressProcent) $('#loadingWin .progressBar .progress').css('width', `${progressProcent}`)
      if(waitingTime) $('#loadingWin .waitingTime').html(`Estimated waiting time: ${waitingTime}`)
    })*/
  })
}

async function getLatestRelease() {
  return new Promise((resolve, reject) => {
    $.ajax('https://api.github.com/repos/Mart100/Moosic/releases/latest',{
      success(data) {
        let tagName = data.tag_name
        let version = tagName.replace('v', '')
        resolve(version)
      }
    })
  })
}