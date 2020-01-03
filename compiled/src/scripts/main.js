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
var fs = require('fs-extra');
var ytdl = require('ytdl-core');
var FileSaver = require('file-saver');
var eprompt = require('electron-prompt');
var _ = require('lodash');
var url = require('url');
var http = require('http');
var cp = require('child_process');
var worker = require('worker_threads');
var remote = require('electron').remote;
var openURL = require('open');
var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify();
var spotify_clientID = '11063f81cfec4398aeb571cff3bb819d';
var ipc = require('electron').ipcRenderer;
var musicPlayer = new MusicPlayer();
var songDownloader = new SongDownloader();
var songHeight = 80;
var storagePos = process.env.APPDATA + '\\moosic' + '\\storage';
spotifyApi.setAccessToken('cd17a520fcd8414da0099ffe45ea73fa');
var songStoragePos = storagePos + '\\songs';
function getSongStoragePos() {
    return __awaiter(this, void 0, void 0, function () {
        var database;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getData()];
                case 1:
                    database = _a.sent();
                    if (database.songStoragePos != undefined) {
                        songStoragePos = database.songStoragePos;
                    }
                    return [2];
            }
        });
    });
}
var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
function isDev() {
    try {
        require('electron-builder');
    }
    catch (e) {
        return false;
    }
    return true;
}
$(function () {
    $(document).on("keydown", function (e) {
        if (e.keyCode === 123)
            remote.getCurrentWindow().toggleDevTools();
        else if (e.keyCode === 116)
            location.reload();
    });
    getSongStoragePos();
    if (isDev() == false)
        checkForUpdates();
    setTimeout(function () {
        $('#navigator .mySongs').trigger('click');
    }, 100);
});
function getSongs() {
    return __awaiter(this, void 0, void 0, function () {
        var database, rawSongs, songs, _i, rawSongs_1, rawSong, song;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getData()];
                case 1:
                    database = _a.sent();
                    rawSongs = Object.values(database.songs);
                    songs = {};
                    for (_i = 0, rawSongs_1 = rawSongs; _i < rawSongs_1.length; _i++) {
                        rawSong = rawSongs_1[_i];
                        song = new Song(rawSong);
                        songs[song.youtubeID] = song;
                    }
                    return [2, songs];
            }
        });
    });
}
function requestPlaylistVideos(playlistID, pageToken) {
    return new Promise(function (resolve, reject) {
        var options = {
            playlistId: playlistID,
            part: 'snippet',
            maxResults: 50
        };
        if (pageToken)
            options.pageToken = pageToken;
        var request = gapi.client.youtube.playlistItems.list(options);
        request.execute(function (response) {
            resolve(response);
        });
    });
}
function parseArrayToSongs(unparsedSongs) {
    return __awaiter(this, void 0, void 0, function () {
        var songs, _loop_1, _i, unparsedSongs_1, unparsedSong;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    unparsedSongs = Object.values(unparsedSongs);
                    songs = [];
                    _loop_1 = function (unparsedSong) {
                        var song;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(unparsedSong.kind && unparsedSong.kind.includes('youtube'))) return [3, 2];
                                    return [4, new Song().importFromYoutube(unparsedSong)];
                                case 1:
                                    song = _a.sent();
                                    return [3, 3];
                                case 2:
                                    song = new Song(unparsedSong);
                                    _a.label = 3;
                                case 3:
                                    if (songs.find(function (s) { return s.youtubeID == song.youtubeID; }))
                                        return [2, "continue"];
                                    songs.push(song);
                                    return [2];
                            }
                        });
                    };
                    _i = 0, unparsedSongs_1 = unparsedSongs;
                    _a.label = 1;
                case 1:
                    if (!(_i < unparsedSongs_1.length)) return [3, 4];
                    unparsedSong = unparsedSongs_1[_i];
                    return [5, _loop_1(unparsedSong)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2, songs];
            }
        });
    });
}
function beutifySeconds(seconds) {
    var songTimeSeconds = Math.floor(seconds % 60).toString();
    if (songTimeSeconds.length == 1)
        songTimeSeconds = '0' + songTimeSeconds;
    var songTimeMinutes = Math.floor(seconds / 60).toString();
    if (songTimeMinutes.length == 1)
        songTimeMinutes = '0' + songTimeMinutes;
    var beutifiedSongTime = songTimeMinutes + ":" + songTimeSeconds;
    return beutifiedSongTime;
}
var DiscordRPC = require('discord-rpc');
var DiscordClientId = '647590804503789578';
DiscordRPC.register(DiscordClientId);
var DiscordRPCclient = new DiscordRPC.Client({ transport: 'ipc' });
DiscordRPCclient.on('ready', function () { return __awaiter(_this, void 0, void 0, function () {
    var database;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('YOINKS');
                return [4, getData()];
            case 1:
                database = _a.sent();
                if (database.settings.discordRPC == false)
                    return [2];
                setRPCactivity();
                return [2];
        }
    });
}); });
function setRPCactivity(options) {
    return __awaiter(this, void 0, void 0, function () {
        var database;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getData()];
                case 1:
                    database = _a.sent();
                    if (database.settings.discordRPC == false)
                        return [2];
                    if (!options)
                        options = {};
                    DiscordRPCclient.setActivity({
                        details: 'Listening to:',
                        state: options.state || 'Nothing',
                        startTimestamp: options.startTimestamp,
                        largeImageKey: 'logo',
                        largeImageText: 'Download at martve.me/Moosic',
                        instance: true,
                    });
                    return [2];
            }
        });
    });
}
try {
    DiscordRPCclient.login({ clientId: DiscordClientId });
}
catch (e) {
    throw e;
}
$(function () {
    var dragEnterTime = 0;
    $('html').on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
        e.preventDefault();
    }).on('dragenter', function (event) {
        dragEnterTime = new Date().getTime();
        console.log('Enter');
        if ($('#dropToImportDiv')[0])
            return;
        $('body').append("\n<div id=\"dropToImportDiv\" style=\"width: 100%; height: 100%; background-color: rgb(10, 10, 10); color: white; position: absolute; z-index: 1000;\">\n  <span style=\"position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);\">\n  Drop to import song\n  </span>\n</div>\n    ");
    }).on('dragleave', function () {
        if (dragEnterTime > new Date().getTime() - 10)
            return;
        console.log('Leave');
        $('#dropToImportDiv').remove();
    }).on('drop', function (event) {
        var text = event.originalEvent.dataTransfer.getData("text/plain");
        $('#dropToImportDiv').remove();
        if (!text.includes('youtube.com/watch'))
            return;
        var youtubeID = text.split('?v=')[1];
        if (youtubeID.length != 11)
            return;
        new Song({ youtubeID: youtubeID, fillData: true, liked: true }).like();
    });
});
//# sourceMappingURL=main.js.map