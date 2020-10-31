$(() => {

	let loadingAnimation

	$('#managestorage-button').on('click', () => {
    $('#settings-main').fadeOut(250, async () => {
			$('#manageStorageSettings').css({
				"text-align": "center",
			})
			$('#manageStorageSettings').html(`
			<div class="loading">Scanning songs</div>
			<div class="data"></div>
			`)
			if(loadingAnimation) clearInterval(loadingAnimation)
			let loopTroughLoadingAnimation = async () => {
				$('#manageStorageSettings .loading').text('Scanning songs.')
				await sleep(500)
				if(loadingAnimation == undefined) return
				$('#manageStorageSettings .loading').text('Scanning songs..')
				await sleep(500)
				if(loadingAnimation == undefined) return
				$('#manageStorageSettings .loading').text('Scanning songs...')
			}
			loopTroughLoadingAnimation()
			loadingAnimation = setInterval(async () => {
				loopTroughLoadingAnimation()
			}, 1500)

			$('#manageStorageSettings .loading').css({
				"margin-top": "50px",
				"margin-bottom": "50px",
			})
			$('#manageStorageSettings').fadeIn(250)

			await sleep(2000)

			// get downloaded amount
			fs.readdir(songStoragePos, async (err, files) => { 
				if(err) console.error(err)
				console.log(files)

				let database = await getData()
				let songs = database.songs

				let filesStats = []
				files.forEach((file) => {
					let stats = fs.statSync(`${songStoragePos}/${file}`)
					let id = file.replace('.mp3', '')
					let DB_song_info = songs.find((s) => s.youtubeID == id)
					if(!DB_song_info) DB_song_info = new Song()

					filesStats.push({
						size: stats.size/1000000.0,
						fileStats: stats,
						id: file.replace('.mp3', ''),
						inDB: DB_song_info.youtubeID != undefined,
						saved: DB_song_info.saved,
						liked: DB_song_info.liked,
						lastPlayed: DB_song_info.lastPlayed,
					})
				})
				console.log(filesStats)

				clearInterval(loadingAnimation)
				await sleep(100)
				$('#manageStorageSettings .loading').text(`Successfully scanned ${filesStats.length} songs`)

				let undefinedSongs = filesStats.filter((s) => s.inDB == false)
				console.log('undefinedSongs: songs', undefinedSongs)
				$('#manageStorageSettings .data').append(`<div>Undefined songs: ${undefinedSongs.length}</div>`)

				let nonSavedSongs = filesStats.filter((s) => s.saved == false)
				console.log('nonSavedSongs: songs', nonSavedSongs)
				$('#manageStorageSettings .data').append(`<div>Not saved songs: ${nonSavedSongs.length}</div>`)

				let nonLikedSongs = filesStats.filter((s) => s.liked == false)
				console.log('nonLikedSongs: songs', nonLikedSongs)
				$('#manageStorageSettings .data').append(`<div>Not liked songs: ${nonLikedSongs.length}</div>`)

				let bigSongs = filesStats.filter((s) => s.size > 10)
				console.log('bigSongs: songs', bigSongs)
				$('#manageStorageSettings .data').append(`<div>songs over 10mb: ${bigSongs.length}</div>`)

				let hugeSongs = filesStats.sort((a, b) => b.size-a.size).filter((s) => s.size > 50)
				let hugeSongsIDs = hugeSongs.map((s) => s.id)
				console.log('hugeSongs: songs', hugeSongs)
				$('#manageStorageSettings .data').append(`<div>songs over 50mb: ${hugeSongs.length}</div>`)
				$('#manageStorageSettings .data').append(`<div class="songs"></div>`)
				$('#manageStorageSettings .data .songs').css({
					"height": "300px",
					"width": "396px",
					"border": "2px solid red"
				})
				$('#manageStorageSettings .data .songs').show()
				let allSongs = await getSongs()
				let allSongs_array = Object.values(allSongs)
				let songSizeMap:object = {}
				for(let s of hugeSongs) songSizeMap[s.id] = `${Math.round(s.size)}`
				let hugeSongs_songs = allSongs_array.filter((s:Song) => hugeSongsIDs.includes(s.youtubeID))
					.sort((a:Song, b:Song) => songSizeMap[b.youtubeID]-songSizeMap[a.youtubeID])

				showSongs(hugeSongs_songs, {refresh: true, topBar: false, sort: false})
				await sleep(100)
				for(let id in songSizeMap) {
					let size = songSizeMap[id]
					$(`#manageStorageSettings .data .songs .songList #song-${id}`).append(`<br><div class="size">size: ${size} mb</div>`)
					$(`#manageStorageSettings .data .songs .songList #song-${id} .size`).css({
						width: "240px",
						height: "20px",
						display: "inline-block",
						color: "rgb(200, 100, 100)",
						"font-size": "13px",
						"margin-left": "10px",
						
					})
				}

			})
    })
	})
	

})