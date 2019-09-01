$(() => {
  $('#titleBarClose').on('click', () => {
    remote.getCurrentWindow().close()
  })
  $('#titleBarMinimize').on('click', () => {
    remote.getCurrentWindow().minimize()
  })
})