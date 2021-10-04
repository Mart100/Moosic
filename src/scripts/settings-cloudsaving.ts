$(() => {
	$('#cloudsaving-button').on('click', () => {
    $('#settings-main').fadeOut(250, () => {
      $('#cloudSavingSettings').fadeIn(250)
    })
	})
	
	$('#cloudSavingSettings-save').on('click', () => {
		saveDataToFirestore();
	})
	$('#cloudSavingSettings-load').on('click', () => {
		loadDataFromFirestore();
	})
})