const fs = require('fs-extra')

let copy_options = {
  overwrite: true,
  filter: (src, dest) => {
    //console.log(src, dest)
    if(src.endsWith('.ts')) return false
    if(src.includes('/Moosic/node_modules')) return false
    if(src.includes('/Moosic/dist')) return false
    if(src.includes('/Moosic/.vscode')) return false
    if(src.includes('/Moosic/.git')) return false
    if(src.includes('/Moosic/compiled')) return false
    return true
  }
}

fs.copy('./src', './compiled/src', copy_options, (err) => {
  if(err) console.error(err)
  else console.log('Copy completed!')
})