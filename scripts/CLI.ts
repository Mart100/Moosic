#!/usr/bin/env node

const yargs = require("yargs")
const ipc_CLI = require('node-ipc')

ipc_CLI.config.id = 'CLI_process'
ipc_CLI.config.silent = false //true
ipc_CLI.config.stopRetrying = true

ipc_CLI.connectTo('electron_process', () => {
  ipc_CLI.of['electron_process'].on('connect', () => {
    // started
  })
})

main()

async function main() {

  let options = yargs
  .scriptName("Moosic CLI")
    .command('like', 'Like a song in Moosic', {
      "s": { 
        alias: "song", 
        describe: "youtubeID of a video", 
        type: "string", 
        demandOption: true 
      }
    })
    .help()
    .argv

  let subCommand = options._[0]

  switch(subCommand) {
    case('like'): {
      await executeJavascriptInMainWindow(`new Song({youtubeID: "${options.s}", fillData: true, liked: true}).like()`)
      console.log(`Liked song ${options.s}. This hopefully worked.`)
      process.exit(0)
    }
  }

}


async function executeJavascriptInMainWindow(code) {
  return new Promise(async (resolve, reject) => {
    await ipc_CLI.of['electron_process'].emit('execJS', code)
    setTimeout(() => { resolve(true) }, 500)
  })
}