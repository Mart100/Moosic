const ffmpeg = require('fluent-ffmpeg')

async function openCutSong(song:Song) {

	$('#cutSong .currentSong .thumbnail').attr('src', `https://i.ytimg.com/vi/${song.youtubeID}/maxresdefault.jpg`)
	$('#cutSong .currentSong .title').html(song.title)
	//$('#index > div').hide()
	$('#index #cutSong').fadeIn()
	let win = remote.getCurrentWindow()
	win.setBounds({ width: 400, height: 600 })

	if(musicPlayer.isPaused == false) musicPlayer.HowlSound.unload()

	let cutoutLdown = false
	$('#cutSong .timeline .cutoutL .cursor').on('mousedown', () => { 
		cutoutLdown = true
		$('#cutSong .timeline .cutoutL').css('pointer-events', 'none')
		$('#cutSong .timeline').css('cursor', 'ew-resize')
	})

	let cutoutRdown = false
	$('#cutSong .timeline .cutoutR .cursor').on('mousedown', () => { 
		cutoutRdown = true
		$('#cutSong .timeline .cutoutR').css('pointer-events', 'none')
		$('#cutSong .timeline').css('cursor', 'ew-resize')
	})

	let paused = true
	let songSound = new Howl({ src: song.getDownloadLocation() })

	let getTimeString = (a) => {
		let fullDuration = songSound.duration()
		let currentPos = fullDuration*a
		let minutes = Math.floor(currentPos/60)
		let seconds = Math.round(currentPos%60)
		let secondsString = seconds.toString()
		if(seconds < 10) secondsString = `0${seconds}`
		let string = `${minutes}:${secondsString}`
		if(string.includes('NaN')) string = '0:00'
		return string
	}

	await sleep(100)

	let updateCursor = setInterval(() => {
		let duration = songSound.duration()
		let currentPos = songSound.seek()
		let a = currentPos/duration
		$('#cutSong .timeline > .cursor').css('left', `${a*100}%`)
		if(a > 1-cutAmountR) {
			$('#cutSong .buttons .playpause').trigger('click')
			songSound.seek(cutAmountL*duration)
		}
		if(a < cutAmountL) {
			songSound.seek(cutAmountL*duration)
		}
		$('#cutSong .timeline > .cursor .time').html(getTimeString(a))
	}, 100)

	$('#cutSong .buttons .playpause').off('click').on('click', () => {
		paused = !paused
		if(paused) {
			$('#cutSong .buttons .playpause img').attr('src', './images/play1.png')
			songSound.pause()
		} else {
			$('#cutSong .buttons .playpause img').attr('src', './images/pause1.png')
			songSound.play()
		}
	})

	let cutAmountL = 0
	let cutAmountR = 0
	$('#cutSong .timeline').off('mousedown').on('mousedown', (event) => {
		if(!$(event.target).hasClass('timeline')) return
		let x = event.offsetX
		let duration = songSound.duration()
		let newTime = (x / event.target.clientWidth) * duration
		songSound.seek(newTime)
		console.log('testsest', x, newTime)
	})
	$('#cutSong .timeline').off('mousemove').on('mousemove', (event) => {

		if(!$(event.target).hasClass('timeline')) return
		let timelineWidth = $('#cutSong .timeline').width()
		if(cutoutLdown) {
			let x = event.offsetX
			if((x/timelineWidth)+cutAmountR > 1) return
			cutAmountL = x/$('#cutSong .timeline').width()
			$('#cutSong .timeline .cutoutL').css('width', `${x}px`)
			$('#cutSong .timeline .cutoutL .time').html(getTimeString(cutAmountL))
		}

		if(cutoutRdown) {
			let x = timelineWidth-event.offsetX
			if((x/timelineWidth)+cutAmountL > 1) return
			cutAmountR = x/timelineWidth
			$('#cutSong .timeline .cutoutR').css('width', `${x}px`)
			$('#cutSong .timeline .cutoutR .time').html(getTimeString(1-cutAmountR))
		}

	})
	$(document).on('mouseup', () => {
		cutoutLdown = false
		$('#cutSong .timeline .cutoutL').css('pointer-events', 'all')

		cutoutRdown = false
		$('#cutSong .timeline .cutoutR').css('pointer-events', 'all')

		$('#cutSong .timeline').css('cursor', 'auto')
	})

	$('#cutSong .buttons .cancel').off('click').on('click', () => {
		clearInterval(updateCursor)
		songSound.unload()
		win.setBounds({ width: 400, height: 800 })
		$('#cutSong').animate({'top': '1000px'}, () => {
			$('#cutSong').hide()
			$('#cutSong').css('top', '0px')
		})
		
	})

	$('#cutSong .buttons .save').off('click').one('click', async () => {
		let duration = songSound.duration()
		let downloadPos = song.getDownloadLocation()
		let start = duration*cutAmountL
		let end = duration*(1-cutAmountR)
		console.log(downloadPos, start, end, duration, `00:0${getTimeString(cutAmountL)}`, `${Math.round(end-start)}`)
		$('#cutSong .buttons .save').html('Saving...')
		$('#cutSong .buttons .save').css('cursor', 'no-drop')
		
		clearInterval(updateCursor)
		songSound.unload()

		await sleep(100)

		fs.removeSync('./cut-output.mp3')

		await sleep(100)

		ffmpeg(downloadPos)
    .setStartTime(`00:0${getTimeString(cutAmountL)}`)
    .setDuration(`${Math.round(end-start)}`)
    .output('./cut-output.mp3')
    .on('end', async (err) => {   
			if(!err) console.log('conversion Done')
			if(err) return

			await sleep(100)
			
			fs.move('./cut-output.mp3', downloadPos, { overwrite: true }, async (err) => {
				if (err) return console.error(err)
				await sleep(100)
				console.log('moving Done')
				win.setBounds({ width: 400, height: 800 })
				$('#cutSong').animate({'bottom': '1000px'}, () => {
					$('#cutSong').hide()
					$('#cutSong').css('bottom', '0px')
				})
				if(musicPlayer.currentSong) musicPlayer.play(musicPlayer.currentSong)
			})
    })
    .on('error', function(err) {
      console.log('error: ', +err);
    }).run()


		
	})

}