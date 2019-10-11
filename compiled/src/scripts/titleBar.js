$(function () {
    $('#titleBarClose').on('click', function () {
        var totalSongsPending = songDownloader.pending.length + songDownloader.inProgress.length;
        if (totalSongsPending > 0) {
            var txt = "\n        There are still " + totalSongsPending + " Songs being downloaded. \n        If you exit now these downloads will be stopped. \n        Are you sure you want to exit?\n      ";
            if (!confirm(txt))
                return;
        }
        remote.getCurrentWindow().close();
    });
    $('#titleBarMinimize').on('click', function () {
        remote.getCurrentWindow().minimize();
    });
});
//# sourceMappingURL=titleBar.js.map