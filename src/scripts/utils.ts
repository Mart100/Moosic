async function getSongStoragePos():Promise<string> {

	if(databaseFileLoc) {
		let database = await getData()
		if(database.songStoragePos != undefined) {
			return database.songStoragePos
		}
	}

	return storagePos+'/songs'
}

const sleep = (ms:number) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function isDev() {
	try { require('electron-builder')}
	catch(e) { return false }
	return true
} 