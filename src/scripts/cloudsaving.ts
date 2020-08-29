const { ipcRenderer } = require('electron')


$(() => {

})

async function saveDataToFirestore(): Promise<void> {
	return new Promise(async (resolve, reject) => {
	
	
		let data = await getRawData()

		ipcRenderer.send('saveUserFirestore', data)
	
	})

}