var progressBarInterval;
$(function () {
    $('#currentSong').on('click', function () {
        $('#currentQueue').fadeIn();
        updateSongFocus();
    });
    musicPlayer.on('play', function () {
        var songElem = getCurrentSongsElement();
        if (songElem.attr('id') != 'queue')
            return;
        updateSongFocus();
    });
    $('#currentQueue .currentSong .progressBackground').on('click', function (event) {
        var x = event.offsetX;
        var duration = musicPlayer.getDuration();
        var newTime = (x / event.target.clientWidth) * duration;
        musicPlayer.setCurrentTime(newTime);
        $('#currentQueue .currentSong .progress').css('width', (newTime / duration) * 100 + "%");
    });
    $('#currentQueue .currentSong .exit').on('click', function () {
        $('#currentQueue').animate({ 'top': '125%' }, 500, function () {
            $('#currentQueue').hide();
            $('#currentQueue').css('top', '0px');
            $('#queue').html('');
            $('#queue').hide();
        });
    });
});
$(function () {
    $('#musicControls .play').on('click', function () { musicPlayer.unpause(); });
    $('#musicControls .pause').on('click', function () { musicPlayer.pause(); });
    $('#musicControls .next').on('click', function () { musicPlayer.nextInQueue(); });
    $('#musicControls .previous').on('click', function () { musicPlayer.previousInQueue(); });
    $('#musicControls .shuffle').on('click', function () {
        if (musicPlayer.isShuffled)
            musicPlayer.unShuffleQueue();
        else
            musicPlayer.shuffleQueue();
    });
    $('#musicControls .repeat').on('click', function () {
        var a = !musicPlayer.repeat;
        musicPlayer.repeat = a;
        if (a)
            $('#musicControls .repeat').addClass('on');
        else
            $('#musicControls .repeat').removeClass('on');
    });
    $('#musicControls .volume .volume_input').on('input', function () {
        musicPlayer.setVolume($('#musicControls .volume .volume_input').val());
    });
});
function updateSongFocus() {
    $('#currentQueue .songs').show();
    var song = musicPlayer.currentSong;
    if (song == undefined)
        return;
    $('#currentQueue .currentSong .image').attr('src', song.image);
    clearInterval(progressBarInterval);
    progressBarInterval = setInterval(function () {
        var progress = musicPlayer.getCurrentTime() / musicPlayer.getDuration();
        $('#currentQueue .currentSong .progress').css('width', progress * 100 + "%");
    }, 1000);
    var queue = musicPlayer.queue;
    showSongs(queue, { topBar: false, sort: false, refresh: false });
}
//# sourceMappingURL=currentQueue.js.map