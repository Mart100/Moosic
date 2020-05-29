var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var progressBarInterval;
$(function () {
    $('#currentSong').on('click', function () {
        if (!musicPlayer.currentSong)
            return;
        $('#currentQueue').fadeIn();
        updateSongFocus();
    });
    musicPlayer.on('play', function () {
        var songElem = getCurrentSongsElement();
        if (songElem.attr('id') != 'queue')
            return;
        updateSongFocus();
    });
    var mouseDown = false;
    $('#currentQueue .currentSong .progressBackground').on('mousedown', function (event) {
        mouseDown = true;
        updateCurrentSongProgressBarWhenMoving(event);
    });
    $(document).on('mouseup', function (event) { mouseDown = false; });
    $(document).on('mousemove', function (event) {
        if (mouseDown)
            updateCurrentSongProgressBarWhenMoving(event);
    });
    $('#currentQueue .currentSong .more').on('click', function (event) {
        var elem = $(event.target);
        var pos = { x: event.clientX, y: event.clientY };
        showTooltipForSong(musicPlayer.currentSong, { pos: pos });
    });
    $('#currentQueue .currentSong .like').on('click', function (event) { return __awaiter(_this, void 0, void 0, function () {
        var song;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    song = musicPlayer.currentSong;
                    if (!song.liked) return [3, 2];
                    return [4, song.dislike()];
                case 1:
                    _a.sent();
                    console.log('test');
                    $('#currentQueue .currentSong .like').attr('src', './images/heart.png');
                    return [3, 4];
                case 2: return [4, song.like()];
                case 3:
                    _a.sent();
                    $('#currentQueue .currentSong .like').attr('src', './images/red-heart.png');
                    _a.label = 4;
                case 4: return [2];
            }
        });
    }); });
    $('#currentQueue .currentSong .exit').on('click', function () {
        $('#currentQueue').animate({ 'top': '125%' }, 500, function () {
            $('#currentQueue').hide();
            $('#currentQueue').css('top', '0px');
            $('#queue').html('');
            $('#queue').hide();
        });
    });
});
function updateCurrentSongProgressBarWhenMoving(event) {
    var x = event.offsetX;
    var duration = musicPlayer.getDuration();
    var newTime = (x / event.target.clientWidth) * duration;
    musicPlayer.setCurrentTime(newTime);
    $('#currentQueue .currentSong .progress').css('width', (newTime / duration) * 100 + "%");
}
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
    $('#musicControls .volume .low_volume').on('click', function () {
        $('#musicControls .volume .volume_input').val(0);
        $('#musicControls .volume .volume_input').trigger('input');
    });
    $('#musicControls .volume .high_volume').on('click', function () {
        $('#musicControls .volume .volume_input').val(100);
        $('#musicControls .volume .volume_input').trigger('input');
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
    $('#currentQueue .currentSong .image').attr('src', song.image.replace('mq', '').replace('default', 'mqdefault'));
    if (song.liked)
        $('#currentQueue .currentSong .like').attr('src', './images/red-heart.png');
    var queue = musicPlayer.queue;
    showSongs(queue, { topBar: false, sort: false, refresh: false });
}
//# sourceMappingURL=currentQueue.js.map