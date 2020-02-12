var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
$(function () {
    $('#exportData-button').on('click', function () {
        var filename = storagePos + '/database.json';
        var codeStr = fs.readFileSync(filename).toString();
        var formattedCode = JSON.stringify(JSON.parse(codeStr), null, 2);
        fs.writeFileSync(filename, formattedCode);
        FileSaver.saveAs(filename, "Moosic-Data.json");
    });
    $('#appearance-button').on('click', function () {
        $('#settings-main').fadeOut(250, function () { return __awaiter(_this, void 0, void 0, function () {
            var database;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, getData()];
                    case 1:
                        database = _a.sent();
                        $('#appearanceSettings').fadeIn(250);
                        console.log('yatta yeet', database.settings.songTileSize);
                        $('#appearanceSettings-songSize input').val(database.settings.songTileSize);
                        return [2];
                }
            });
        }); });
    });
    $('#appearanceSettings-songSize input').on('input', function () { return __awaiter(_this, void 0, void 0, function () {
        var v, songs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    v = $('#appearanceSettings-songSize input').val();
                    songHeight = Number(v);
                    $('#appearanceSettings .songs').show();
                    return [4, getSongs()];
                case 1:
                    songs = _a.sent();
                    showSongs(songs, { refresh: true });
                    return [2];
            }
        });
    }); });
    $('#appearanceSettings-songSize input').on('change', function () { return __awaiter(_this, void 0, void 0, function () {
        var v;
        return __generator(this, function (_a) {
            v = $('#appearanceSettings-songSize input').val();
            saveData1(function (database) {
                database.settings.songTileSize = v;
                return database;
            });
            return [2];
        });
    }); });
    $('#importData-button').on('click', function () {
        $('#settings-main').fadeOut(250, function () {
            $('#importData').fadeIn(250);
        });
    });
    $('#importData-spotify-button').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var accessToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getSpotifyAccessToken()];
                case 1:
                    accessToken = _a.sent();
                    return [4, loadPlaylists(accessToken)];
                case 2:
                    _a.sent();
                    $('#settings').hide();
                    $('#playlistImportSpotify').fadeIn();
                    return [2];
            }
        });
    }); });
    $('#importData-youtubePlaylist-button').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            eprompt('Youtube Playlist Import', 'Fill in youtube playlist link').then(function (userInput) { return __awaiter(_this, void 0, void 0, function () {
                var playlistLink, playlistID, playlistVideoLength, playlistLastResponse, playlistNextPageToken, playlistVideos, response, _i, _a, vid, playlistSongs, collName;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            playlistLink = userInput;
                            playlistID = userInput.split('list=')[1].split('&')[0];
                            playlistVideoLength = 1;
                            playlistNextPageToken = undefined;
                            playlistVideos = [];
                            console.log(playlistLink, playlistID || playlistNextPageToken == 0);
                            _b.label = 1;
                        case 1:
                            if (!(playlistVideoLength > playlistVideos.length)) return [3, 3];
                            return [4, requestPlaylistVideos(playlistID, playlistNextPageToken)];
                        case 2:
                            response = _b.sent();
                            console.log(response);
                            playlistVideoLength = response.pageInfo.totalResults;
                            playlistNextPageToken = response.nextPageToken;
                            if (playlistNextPageToken == undefined)
                                playlistNextPageToken = 0;
                            playlistLastResponse = response;
                            for (_i = 0, _a = response.items; _i < _a.length; _i++) {
                                vid = _a[_i];
                                playlistVideos.push(vid);
                            }
                            return [3, 1];
                        case 3:
                            playlistSongs = parseArrayToSongs(playlistVideos);
                            console.log(playlistSongs);
                            return [4, createNewCollection('Youtube playlist')];
                        case 4:
                            collName = _b.sent();
                            addSongsToCollection(playlistSongs, collName);
                            return [2];
                    }
                });
            }); });
            return [2];
        });
    }); });
    $('#setStoragePos-button').on('click', function () {
        var elem = $('<input type="file" webkitdirectory directory/>');
        elem.on('change', function (event) { return __awaiter(_this, void 0, void 0, function () {
            var newStoragePos;
            var _this = this;
            return __generator(this, function (_a) {
                newStoragePos = elem.prop('files')[0].path;
                newStoragePos = newStoragePos.replace(/\\/g, '/');
                fs.copy(songStoragePos, newStoragePos, function (err) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err)
                                    return [2, console.error(err)];
                                console.log('success!');
                                return [4, saveData1(function (database) {
                                        database.songStoragePos = newStoragePos;
                                        return database;
                                    })];
                            case 1:
                                _a.sent();
                                songStoragePos = newStoragePos;
                                return [2];
                        }
                    });
                }); });
                return [2];
            });
        }); });
        elem.trigger('click');
    });
    $('#importData-mp3Folder-button').on('click', function () {
        var elem = $('<input type="file" webkitdirectory directory/>');
        elem.on('change', function (event) { return __awaiter(_this, void 0, void 0, function () {
            var pos;
            var _this = this;
            return __generator(this, function (_a) {
                pos = elem.prop('files')[0].path;
                pos = pos.replace(/\\/g, '/');
                fs.readdir(pos, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                    var songs, _a, _b, _i, idx, file, youtubeID, stats, creationdate, accessedDate, song, collName;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (err)
                                    console.error(err);
                                songs = {};
                                _a = [];
                                for (_b in files)
                                    _a.push(_b);
                                _i = 0;
                                _c.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3, 4];
                                idx = _a[_i];
                                file = files[idx];
                                youtubeID = file.split('.')[0];
                                stats = fs.statSync(pos + '\\' + file);
                                console.log(stats);
                                creationdate = stats.ctimeMs;
                                accessedDate = stats.atimeMs;
                                song = new Song({ youtubeID: youtubeID, fillData: true, saveDate: creationdate, lastPlayed: accessedDate });
                                songs[youtubeID] = song;
                                return [4, sleep(10)];
                            case 2:
                                _c.sent();
                                _c.label = 3;
                            case 3:
                                _i++;
                                return [3, 1];
                            case 4: return [4, createNewCollection('MP3 collection')];
                            case 5:
                                collName = _c.sent();
                                return [4, saveData1(function (database) {
                                        var mergedSongs = __assign(__assign({}, database.songs), songs);
                                        database.songs = mergedSongs;
                                        database.collections.find(function (c) { return c.name == collName; }).songs = Object.keys(songs);
                                        return database;
                                    })];
                            case 6:
                                _c.sent();
                                console.log('Done importing songs from mp3 folder');
                                return [2];
                        }
                    });
                }); });
                return [2];
            });
        }); });
        elem.trigger('click');
    });
    $('#importData-moosic-button').on('click', function () {
        $('body').append('<input id="fileInput" type="file" accept=".json"/>');
        var input = $('#fileInput');
        input.trigger('click');
        input.on('change', function (event) {
            var url = $('#fileInput').prop('files')[0].path;
            fs.readJson(url, function (err, obj) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (err)
                        console.error(err);
                    if (obj == undefined || obj.songs == undefined)
                        return [2, window.alert('Not a valid Moosic save file!')];
                    saveData1(function (data) {
                        return obj;
                    });
                    songStoragePos = obj.songStoragePos;
                    return [2];
                });
            }); });
        });
    });
    $('#importData-headset-button').on('click', function () {
        $('body').append('<input id="fileInput" type="file" accept=".json"/>');
        var input = $('#fileInput');
        input.trigger('click');
        input.on('change', function (event) {
            var url = $('#fileInput').prop('files')[0].path;
            fs.readJson(url, function (err, obj) { return __awaiter(_this, void 0, void 0, function () {
                var tracks, songs, trackID, track, trackData, song, collName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                console.error(err);
                            if (obj == undefined)
                                return [2];
                            if (obj.collections == undefined)
                                return [2];
                            if (obj.collections.likes == undefined)
                                return [2];
                            tracks = obj.collections.likes.tracks;
                            console.log(tracks);
                            songs = {};
                            for (trackID in tracks) {
                                track = tracks[trackID];
                                trackData = {
                                    youtubeID: trackID,
                                    image: track.thumbnail,
                                    title: track.title,
                                    author: track.artist,
                                    liked: false,
                                    order: obj.collections.likes.order[trackID],
                                    saveDate: Date.now()
                                };
                                song = new Song(trackData);
                                songs[trackID] = song.getObject();
                            }
                            return [4, createNewCollection('Headset save')];
                        case 1:
                            collName = _a.sent();
                            return [4, saveData1(function (database) {
                                    var mergedSongs = __assign(__assign({}, database.songs), songs);
                                    database.songs = mergedSongs;
                                    database.collections.find(function (c) { return c.name == collName; }).songs = Object.keys(songs);
                                    return database;
                                })];
                        case 2:
                            _a.sent();
                            console.log('Done importing songs from headset');
                            return [2];
                    }
                });
            }); });
        });
    });
    $('#advanced-button').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            $('#settings-main').fadeOut(250, function () {
                $('#advancedSettings').fadeIn(250);
            });
            return [2];
        });
    }); });
    $('#advancedSettings-repairSave').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var songs, songID, song, newSongID, newSongData, newSong, songIDs, songID, song;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getSongs()];
                case 1:
                    songs = _a.sent();
                    for (songID in songs) {
                        song = songs[songID];
                        if (songID.includes('.mp3')) {
                            newSongID = songID.replace('.mp3', '');
                            newSongData = song;
                            newSongData.youtubeID = newSongID;
                            newSong = new Song(newSongData);
                            new Song(song).deleteSave();
                            console.log(newSong);
                            newSong.save();
                        }
                    }
                    songIDs = [];
                    for (songID in songs) {
                        song = songs[songID];
                        if (songIDs.includes(songID)) {
                            console.log(songID);
                            song.deleteSave();
                        }
                        songIDs.push(songID);
                    }
                    fs.readdir(songStoragePos, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                        var _i, files_1, file, newFileName;
                        return __generator(this, function (_a) {
                            if (err)
                                console.error(err);
                            for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                                file = files_1[_i];
                                if (file.includes('.mp3.mp3')) {
                                    newFileName = file.replace('.mp3.mp3', '') + '.mp3';
                                    fs.rename(songStoragePos + '\\' + file, songStoragePos + '\\' + newFileName, function (err) {
                                        if (err)
                                            throw err;
                                    });
                                }
                            }
                            return [2];
                        });
                    }); });
                    console.log('Done repairing!');
                    return [2];
            }
        });
    }); });
    $('#advancedSettings-addYoutubeData').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var songs, i, songID, song, newSong;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getSongs()];
                case 1:
                    songs = _a.sent();
                    i = 0;
                    for (songID in songs) {
                        song = songs[songID];
                        if (song.title == undefined) {
                            if (i > 0)
                                continue;
                            newSong = new Song({ youtubeID: song.youtubeID, fillData: true });
                            newSong.save();
                            i++;
                        }
                    }
                    console.log('Tried adding to lost songs');
                    return [2];
            }
        });
    }); });
    $('#advancedSettings-deleteLost').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var songs, songID, song;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getSongs()];
                case 1:
                    songs = _a.sent();
                    for (songID in songs) {
                        song = songs[songID];
                        if (song.title == undefined) {
                            song.delete();
                        }
                    }
                    console.log('Deleted all lost songs');
                    return [2];
            }
        });
    }); });
    $('#advancedSettings-downloadAllSongs').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var songs, songID;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getSongs()];
                case 1:
                    songs = _a.sent();
                    for (songID in songs) {
                        songs[songID].download({});
                    }
                    return [2];
            }
        });
    }); });
    $('#info-button').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            $('#settings-main').fadeOut(250, function () { return __awaiter(_this, void 0, void 0, function () {
                var appVersion, songs, vSongs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            $('#info').fadeIn(250);
                            appVersion = require('electron').remote.app.getVersion();
                            $('#moosicVersion').html('Version: ' + appVersion);
                            return [4, getSongs()];
                        case 1:
                            songs = _a.sent();
                            vSongs = Object.values(songs);
                            $('#info-savedSongs').html('Saved Songs: ' + vSongs.length);
                            fs.readdir(songStoragePos, function (err, files) {
                                if (err)
                                    console.error(err);
                                $('#info-downloadedSongs').html('Downloaded Songs: ' + files.length);
                            });
                            require('get-folder-size')(songStoragePos, function (err, size) {
                                if (err)
                                    throw err;
                                var songStorageSize = (size / 1024 / 1024).toFixed(2);
                                $('#info-downloadedSongsStorageSize').html('Downloaded Songs storage size: ' + songStorageSize + ' MB');
                            });
                            $('#info-songsLocation').html("Songs Location: " + songStoragePos);
                            return [2];
                    }
                });
            }); });
            return [2];
        });
    }); });
    $('#discordRPC-button').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var database;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, saveData1(function (data) {
                        data.settings.discordRPC = !data.settings.discordRPC;
                        return data;
                    })];
                case 1:
                    _a.sent();
                    return [4, getData()];
                case 2:
                    database = _a.sent();
                    if (database.settings.discordRPC) {
                        $('#discordRPC-button').html('Disable discord RPC');
                        setRPCactivity({ state: musicPlayer.currentSong.title, startTimestamp: new Date() });
                    }
                    else {
                        $('#discordRPC-button').html('Enable discord RPC');
                        DiscordRPCclient.clearActivity();
                    }
                    return [2];
            }
        });
    }); });
    $('#deleteData-button').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var confirm;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    confirm = window.confirm('Are you sure you want to delete all your data?');
                    if (!confirm)
                        return [2];
                    return [4, createEmptyDatabase()];
                case 1:
                    _a.sent();
                    musicPlayer.stop();
                    fs.emptyDir(storagePos + '/songs');
                    return [2];
            }
        });
    }); });
});
function removeSongsWithMP3end() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, saveData1(function (data) {
                        var songs = data.songs;
                        for (var songID in songs) {
                            var song = songs[songID];
                            if (songID.includes('.mp3')) {
                                delete data.songs[songID];
                            }
                        }
                        return data;
                    })];
                case 1:
                    _a.sent();
                    console.log('Done');
                    return [2];
            }
        });
    });
}
//# sourceMappingURL=settings.js.map