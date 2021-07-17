class Playlist {
	name:string
	songs:Song[]
	constructor(name?:string) {

		this.songs = []

		if(name) this.setName(name)
		else this.setName('Playlist')

	}
	static importFromJSON(json, allSongs) {
		let newPlaylist = new Playlist(json.name)
		newPlaylist.songs = json.songs.map(songID => new Song(allSongs[songID]))
		return newPlaylist
	} 
	async setName(name:string, save:boolean=false) {

		let data:database = await getData()

		if(data.playlists.find(c => c.name == name) == undefined) {
			this.name = name
			if(save) this.save()
			return
		} 

		let availableName:string = ''
		let availableNameNum:number = 1
		while(availableName == '') {
			let newName = name+' - '+availableNameNum
			if(data.playlists.find(c => c.name == newName) == undefined) availableName = newName
			availableNameNum++
		}
		this.name = availableName

		if(save) this.save()
	}

	async setSongs(songs:Song[]) {
	
		songs.forEach(s => s.save())
	
		await saveData1((database) => {
	
			let collection = database.collections.find(c => c.name == this.name)
			collection.songs = songs.map(s => s.id)
	
			return database
		})
	}

	async addSong(song:Song) {
  	
		await saveData1((database) => {
			let collection = database.collections.find(c => c.name == this.name)
			if(collection.songs.includes(song.id)) return database
			collection.songs.push(song.id)
			return database
		})
	}

	async save() {
		await saveData1((database) => {
			let obj = {
				name: this.name,
				songs: this.songs.map(s => s.id)
			}
			database.collections.push(obj)
			return database
		})
	}
}