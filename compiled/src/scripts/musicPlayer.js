var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var EventEmitter = require('events');
var MusicPlayer = (function (_super) {
    __extends(MusicPlayer, _super);
    function MusicPlayer() {
        var _this = _super.call(this) || this;
        _this.YTplayer;
        _this.HowlSound;
        _this.currentPlayer = 'none';
        _this.volume = 50;
        _this.isPaused = true;
        _this.currentSong;
        _this.queue = [];
        _this.queuePosition = 0;
        _this.repeat = false;
        _this.unShuffledQueue = [];
        _this.isShuffled = false;
        _this.durationUpdateInterval;
        return _this;
    }
    MusicPlayer.prototype.play = function (song) {
        return __awaiter(this, void 0, void 0, function () {
            var queueIDlist, idx, songQueueIDX, songLoc, mp3Exists, songDuration;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.stop();
                        console.log(song);
                        if (song.youtubeID == undefined)
                            return [2];
                        queueIDlist = Array.from(this.queue, function (s) { return s.youtubeID; });
                        idx = queueIDlist.indexOf(song.youtubeID);
                        if (idx != -1)
                            this.queuePosition = idx;
                        this.currentSong = song;
                        this.isPaused = false;
                        this.emit('play');
                        songQueueIDX = this.queue.indexOf(this.queue.find(function (s) { return s.youtubeID == song.youtubeID; }));
                        if (songQueueIDX > -1)
                            this.queuePosition = songQueueIDX;
                        console.log(songQueueIDX);
                        if (this.currentSong.saved) {
                            this.currentSong.lastPlayed = Date.now();
                            this.currentSong.save();
                        }
                        songLoc = songStoragePos + '\\' + song.youtubeID + '.mp3';
                        return [4, song.isDownloaded()];
                    case 1:
                        mp3Exists = _a.sent();
                        console.log(songLoc, mp3Exists);
                        if (!mp3Exists) return [3, 2];
                        this.playMp3(songLoc);
                        return [3, 4];
                    case 2:
                        this.playYT(song.youtubeID);
                        return [4, this.currentSong.download({ priority: true })];
                    case 3:
                        _a.sent();
                        musicPlayer.play(this.currentSong);
                        _a.label = 4;
                    case 4:
                        setTimeout(function () {
                            scrollToCurrentSong();
                        }, 10);
                        songDuration = 0;
                        setRPCactivity({ state: song.title, startTimestamp: new Date() });
                        clearInterval(this.durationUpdateInterval);
                        this.durationUpdateInterval = setInterval(function () {
                            var currentTime = _this.getCurrentTime();
                            if (isNaN(currentTime))
                                currentTime = 0;
                            if (songDuration == 0)
                                songDuration = Math.round(_this.getDuration());
                            var eventPacket = { time: currentTime, duration: songDuration };
                            _this.emit('durationUpdate', eventPacket);
                        }, 100);
                        return [2];
                }
            });
        });
    };
    MusicPlayer.prototype.setQueue = function (newQueue) {
        this.queue = [];
        newQueue = JSON.parse(JSON.stringify(newQueue));
        for (var _i = 0, newQueue_1 = newQueue; _i < newQueue_1.length; _i++) {
            var song = newQueue_1[_i];
            this.queue.push(new Song(song));
        }
        this.isShuffled = false;
    };
    MusicPlayer.prototype.nextInQueue = function () {
        if (!this.repeat)
            this.queuePosition++;
        if (this.queuePosition > this.queue.length)
            this.queuePosition = 0;
        this.play(this.queue[this.queuePosition]);
    };
    MusicPlayer.prototype.previousInQueue = function () {
        if (!this.repeat)
            this.queuePosition--;
        if (this.queuePosition < 0)
            this.queuePosition = this.queue.length;
        this.play(this.queue[this.queuePosition]);
    };
    MusicPlayer.prototype.setVolume = function (volume) {
        this.volume = volume;
        if (this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.setVolume)
            this.YTplayer.setVolume(volume);
        if (this.currentPlayer == 'MP3' && this.HowlSound)
            this.HowlSound.volume(volume / 100);
    };
    MusicPlayer.prototype.pause = function () {
        this.isPaused = true;
        if (this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.pauseVideo)
            this.YTplayer.pauseVideo();
        if (this.currentPlayer == 'MP3' && this.HowlSound)
            this.HowlSound.pause();
        this.emit('pause');
    };
    MusicPlayer.prototype.unpause = function () {
        this.isPaused = false;
        if (this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.playVideo)
            this.YTplayer.playVideo();
        if (this.currentPlayer == 'MP3' && this.HowlSound)
            this.HowlSound.play();
        this.emit('unpause');
    };
    MusicPlayer.prototype.shuffleQueue = function () {
        this.isShuffled = true;
        this.unShuffledQueue = this.queue.slice(0);
        this.queue = this.queue.sort(function (a, b) { return Math.random() - 0.5; });
        showSongs(musicPlayer.queue, { refresh: true, scrollToCurrentSong: true, topBar: false, sort: false });
        this.emit('shuffle');
    };
    MusicPlayer.prototype.unShuffleQueue = function () {
        this.isShuffled = false;
        this.queue = this.unShuffledQueue.slice(0);
        this.emit('unshuffle');
    };
    MusicPlayer.prototype.stop = function () {
        if (this.YTplayer != undefined && this.YTplayer.stopVideo != undefined)
            this.YTplayer.stopVideo();
        if (this.HowlSound != undefined)
            this.HowlSound.stop();
        clearInterval(this.durationUpdateInterval);
        this.YTplayer = undefined;
        this.currentSong = undefined;
        this.emit('stop');
        for (var _i = 0, _a = Howler._howls; _i < _a.length; _i++) {
            var howl = _a[_i];
            howl.stop();
        }
    };
    MusicPlayer.prototype.getDuration = function () {
        if (this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.getDuration)
            return this.YTplayer.getDuration();
        if (this.currentPlayer == 'MP3' && this.HowlSound)
            return this.HowlSound.duration();
    };
    MusicPlayer.prototype.setCurrentTime = function (to) {
        if (this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.seekTo)
            return this.YTplayer.seekTo(to);
        if (this.currentPlayer == 'MP3' && this.HowlSound)
            return this.HowlSound.seek(to);
    };
    MusicPlayer.prototype.getCurrentTime = function () {
        if (this.currentPlayer == 'YT' && this.YTplayer && this.YTplayer.getCurrentTime)
            return this.YTplayer.getCurrentTime();
        if (this.currentPlayer == 'MP3' && this.HowlSound)
            return this.HowlSound.seek();
    };
    MusicPlayer.prototype.playMp3 = function (url) {
        var _this = this;
        if (this.HowlSound != undefined)
            this.HowlSound.stop();
        this.HowlSound = new Howl({ src: [url] });
        this.HowlSound.play();
        this.currentPlayer = 'MP3';
        this.HowlSound.on('play', function () {
            _this.setVolume(_this.volume);
            for (var _i = 0, _a = Howler._howls; _i < _a.length; _i++) {
                var howl = _a[_i];
                if (howl._src.includes(_this.currentSong.youtubeID))
                    continue;
                howl.stop();
            }
        });
        this.onEndListenerMp3();
    };
    MusicPlayer.prototype.playYT = function (videoID) {
        var _this = this;
        if ($('#player')[0] != undefined)
            $('#player').remove();
        $('html').append('<div id="player"></div>');
        this.YTplayer = new YT.Player('player', {
            height: '1',
            width: '1',
            videoId: videoID,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            widget_referrer: 'https://martve.me',
            events: {
                'onError': function (e) { _this.onYTerror(e); },
                'onReady': function (e) { _this.onYTready(e); },
                'onStateChange': function (e) { _this.onPlayerStateChangeYT(e); }
            }
        });
        this.currentPlayer = 'YT';
    };
    MusicPlayer.prototype.onYTready = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                e.target.playVideo();
                this.setVolume(this.volume);
                return [2];
            });
        });
    };
    MusicPlayer.prototype.onYTerror = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('ERROR', e);
                        if (!(e.data == 150)) return [3, 2];
                        if (!this.currentSong) return [3, 2];
                        return [4, this.currentSong.download({ priority: true })];
                    case 1:
                        _a.sent();
                        musicPlayer.play(this.currentSong);
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    MusicPlayer.prototype.onEndListenerMp3 = function () {
        var _this = this;
        this.HowlSound.on('end', function () {
            _this.nextInQueue();
            _this.emit('end');
        });
    };
    MusicPlayer.prototype.onPlayerStateChangeYT = function (event) {
        if (event.data == 0) {
            this.nextInQueue();
            this.emit('end');
        }
    };
    return MusicPlayer;
}(EventEmitter));
//# sourceMappingURL=musicPlayer.js.map