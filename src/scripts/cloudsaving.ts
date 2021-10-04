const { ipcRenderer } = require('electron')


$(() => {

})

async function saveDataToFirestore(): Promise<void> {
	return new Promise(async (resolve, reject) => {
	
	
		let data = await getRawData()

		ipcRenderer.send('saveUserFirestore', data)
	
	})

}

async function loadDataFromFirestore(): Promise<void> {
	ipcRenderer.send('loadUserFirestore')
	ipcRenderer.once('loadUserFirestoreReply', async (event, data) => {

		let database = await getData()

		for(let songID of data.songs.split('+')) {
			if(database.songs.find(s => s.id == songID) == undefined) {
				let newSong = new Song({youtubeID: songID})
				await newSong.fillSongDataWithYTSearch()
				await newSong.save()
			}
		}

	})
}