const express = require('express')
const Socket = require('socket.io')
const openURL = require('open')
const path = require('path')
const app = express()
const port = 3052

let server = null
let io = null

let userInfoCallback

module.exports = {
	start: start,
	userInfoCallback: (callbackFunction) => {
		userInfoCallback = callbackFunction
	}
}

function start(data) {
	console.log('Yooo, tatatatata')
	if(server == null) startWebserver(data)
	sendUserToServer()
}

function startWebserver(data) {
	server = app.listen(port, () => {
		console.log(`signInUserWebserver is running on ${port}`)
	})

	let io = Socket(server)


	io.on('connection', (socket) => {
		socket.emit('data', data)
	})
}

async function sendUserToServer() {
	await openURL('http://localhost:3052')
	console.log('OPEN LOCALHOST HMMM')
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
