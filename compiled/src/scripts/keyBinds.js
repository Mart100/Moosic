function onMediaPlayPause() {
    if (musicPlayer.isPaused)
        musicPlayer.unpause();
    else
        musicPlayer.pause();
}
function onMediaPreviousTrack() {
    musicPlayer.previousInQueue();
}
function onMediaNextTrack() {
    musicPlayer.nextInQueue();
}
//# sourceMappingURL=keyBinds.js.map