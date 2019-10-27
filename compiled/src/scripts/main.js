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
var fs = require('fs-extra');
var ytdl = require('ytdl-core');
var FileSaver = require('file-saver');
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
    checkForUpdates();
    setTimeout(function () {
        $('#navigator .mySongs').trigger('click');
    }, 100);
});
function checkForUpdates() {
    return __awaiter(this, void 0, void 0, function () {
        var thisVersion, latestVersion, confirmMessage, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    thisVersion = remote.app.getVersion();
                    return [4, getLatestRelease()];
                case 1:
                    latestVersion = _a.sent();
                    if (thisVersion == latestVersion)
                        return [2];
                    confirmMessage = "\nThere seems to be a new update for Moosic:\nYour version: " + thisVersion + "\nLatest version: " + latestVersion + "\n\nDo you want to install this update?\n";
                    return [4, window.confirm(confirmMessage)];
                case 2:
                    response = _a.sent();
                    if (response) {
                        downloadFileFromURL("https://github.com/Mart100/Moosic/releases/download/v" + latestVersion + "/moosic-Setup-" + latestVersion + ".exe");
                    }
                    return [2];
            }
        });
    });
}
function awaitWindowLoad(win) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    win.webContents.on('did-finish-load', function () {
                        resolve();
                    });
                })];
        });
    });
}
function downloadFileFromURL(file_url) {
    return __awaiter(this, void 0, void 0, function () {
        var file_name, downloadLoc, win, proc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file_name = file_url.split('/').pop();
                    downloadLoc = storagePos + '\\installers';
                    win = remote.getCurrentWindow();
                    win.setBounds({ width: 400, height: 200 });
                    return [4, fs.ensureDir(downloadLoc)];
                case 1:
                    _a.sent();
                    $('#index').remove();
                    $('#currentSong').remove();
                    $('#navigator').remove();
                    $('iframe').remove();
                    $('body').append("\n<div id=\"loadingWin\">\n<div class=\"title\">Downloading " + file_name + "...</div>\n<div class=\"progressBar\"><div class=\"progress\"></div></div>\n<div class=\"waitingTime\">Estemaited waiting time: 0s</div>\n</div>\n  ");
                    proc = cp.exec("wget " + file_url + " -P " + downloadLoc, function (err, stdout, stderr) {
                        if (err)
                            throw err;
                        else {
                            console.log("Setup " + file_url.split('/').pop() + " installed");
                            console.log(downloadLoc + "\\" + file_name);
                            cp.exec(downloadLoc + "\\" + file_name, function (err, stdout, stderr) {
                                if (err)
                                    throw err;
                                win.close();
                            });
                        }
                    });
                    proc.stderr.on('data', function (data) {
                        if (!data.includes('%'))
                            return;
                        if (Math.random() < 0.9)
                            return;
                        data = data.replace(/\./g, '').replace('\n', '');
                        var progressProcent = data.match(/[0-9]{1,3}%/g);
                        var waitingTime = data.match(/[0-9]{1,5}s/g);
                        if (progressProcent)
                            $('#loadingWin .progressBar .progress').css('width', "" + progressProcent);
                        if (waitingTime)
                            $('#loadingWin .waitingTime').html("Estimated waiting time: " + waitingTime);
                    });
                    return [2];
            }
        });
    });
}
function getLatestRelease() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    $.ajax('https://api.github.com/repos/Mart100/Moosic/releases/latest', {
                        success: function (data) {
                            var tagName = data.tag_name;
                            var version = tagName.replace('v', '');
                            resolve(version);
                        }
                    });
                })];
        });
    });
}
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
//# sourceMappingURL=main.js.map