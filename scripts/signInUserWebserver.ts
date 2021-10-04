const express = require('express')
const Socket = require('socket.io')
const openURL = require('open')
const path = require('path')
const app = express()
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

enum actions {
	save,
	load
}
let server = null
let io = null

let port
let userInfoCallback
let loginWindow
let globalCallback:Function

module.exports = {
	start: start,
	actions: actions,
	userInfoCallback: (callbackFunction) => {
		userInfoCallback = callbackFunction
	}
}

async function start(action:actions, data, callback:Function) {

	globalCallback = callback

	if(server == null) await startWebserver(action, data)
	sendUserToServer()
}

function startWebserver(action:actions, data) {
	return new Promise((resolve, reject) => {
		server = app.listen(0, () => {
			port = server.address().port
			console.log(`signInUserWebserver is running on ${port}`)

			let io = Socket(server)
	
	
			io.on('connection', (socket) => {
				if(action == actions.save) socket.emit('data', {data, action: actions[action]})
				if(action == actions.load) socket.emit('data', {action: actions[action]})
		
				socket.on('finished', (data) => {
					globalCallback(data)
					closeWebserver()
				})
			})

			resolve(true)
		})
	})
}

async function sendUserToServer() {
	console.log(`send user to localhost:${port}`)
	let response = await openURL(`http://localhost:${port}`)

	/*
	loginWindow = new BrowserWindow({
		width: 400,
		height: 800,
		icon: './icon.ico'
	})
	
	loginWindow.setMenu(null)
	loginWindow.loadURL(`http://localhost:${port}`)
	loginWindow.loadFile('index.html');
	loginWindow.webContents.openDevTools();
	*/

}
function closeWebserver() {
	server.close()
	server = null
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/signInUserWebserverHTML.html'))
})

app.get('/userInfo', (req, res) => {
	let userInfo = {
		token: req.body.token,
		user: req.body.user
	}
	userInfoCallback(userInfo)
})
