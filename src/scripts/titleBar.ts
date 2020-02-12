$(() => {
  $('#titleBarClose').on('click', async () => {
    
    // if downloads running warn
    let totalSongsPending = songDownloader.pending.length+songDownloader.inProgress.length
    if(totalSongsPending > 0) {
      let txt = `
        There are still ${totalSongsPending} Songs being downloaded. 
        If you exit now these downloads will be stopped. 
        Are you sure you want to exit?
      `

      if(!confirm(txt)) return

    }

    await awaitSavingStatus()
    remote.getCurrentWindow().close()
  })
  $('#titleBarMinimize').on('click', () => {
    remote.getCurrentWindow().minimize()
  })
})