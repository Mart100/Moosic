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
var Song = (function () {
    function Song(data) {
        if (data == undefined || Object.values(data).length == 0)
            return;
        this.image = data.image;
        this.youtubeID = data.youtubeID;
        this.title = data.title;
        this.author = data.author;
        this.liked = data.liked;
        this.saved = data.saved;
        if (this.liked == undefined)
            this.liked = false;
        this.order = data.order;
        this.lastPlayed = data.lastPlayed;
        this.saveDate = data.saveDate;
        this.isDownloadedBool = data.isDownloadedBool;
        if (data.fillData)
            this.fillSongDataWithID();
        return this;
    }
    Song.prototype.fillSongDataWithID = function () {
        return __awaiter(this, void 0, void 0, function () {
            var YTsongData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getVideoDataFromYoutube()];
                    case 1:
                        YTsongData = _a.sent();
                        return [4, this.importFromYoutube(YTsongData)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Song.prototype.getVideoDataFromYoutube = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = gapi.client.youtube.videos.list({
                id: _this.youtubeID,
                part: 'snippet',
                type: 'video',
                maxResults: 1
            });
            request.execute(function (response) {
                resolve(response.items[0]);
            });
        });
    };
    Song.prototype.importFromYoutube = function (video) {
        return __awaiter(this, void 0, void 0, function () {
            var DBsong;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.image = video.snippet.thumbnails.default.url;
                        this.youtubeID = video.kind == 'youtube#playlistItem' ? (video.snippet.resourceId.videoId) : (video.id.videoId ? (video.id.videoId) : (video.id));
                        this.title = video.snippet.title;
                        this.author = video.snippet.channelTitle;
                        this.liked = this.liked != undefined ? this.liked : false;
                        this.saved = false;
                        this.isDownloadedBool = false;
                        this.order = video.snippet.position ? video.snippet.position : 0;
                        return [4, getSongByID(this.youtubeID)];
                    case 1:
                        DBsong = _a.sent();
                        if (DBsong != undefined) {
                            this.saveDate = DBsong.saveData || undefined;
                            this.saved = DBsong.saved || this.saved;
                            this.isDownloadedBool = DBsong.isDownloadedBool || this.isDownloadedBool;
                            this.liked = DBsong.liked || this.liked;
                        }
                        return [2, this];
                }
            });
        });
    };
    Song.prototype.play = function () {
        musicPlayer.play(this);
        setCurrentSong(this);
    };
    Song.prototype.like = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.liked = true;
                        return [4, this.save()];
                    case 1:
                        _a.sent();
                        this.download({});
                        return [2];
                }
            });
        });
    };
    Song.prototype.dislike = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.liked = false;
                        return [4, this.save()];
                    case 1:
                        _a.sent();
                        this.removeDownload();
                        return [2];
                }
            });
        });
    };
    Song.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.saveDate == undefined)
                            this.saveDate = Date.now();
                        this.saved = true;
                        return [4, saveData1(function (database) {
                                database.songs[_this.youtubeID] = _this.getObject();
                                return database;
                            })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Song.prototype.removeDownload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        var downloadPos = _this.getDownloadLocation();
                        console.log(downloadPos);
                        fs.remove(downloadPos, function (err) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (err)
                                            console.error(err);
                                        this.isDownloadedBool = false;
                                        return [4, this.save()];
                                    case 1:
                                        _a.sent();
                                        resolve();
                                        return [2];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    Song.prototype.download = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.isDownloaded()];
                    case 1:
                        if ((_a.sent()) && !options.redownload)
                            return [2];
                        return [4, songDownloader.queueNewDownload(this.youtubeID, options)];
                    case 2:
                        _a.sent();
                        this.isDownloadedBool = true;
                        if (!this.saved) return [3, 4];
                        return [4, this.save()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    Song.prototype.getDownloadLocation = function () {
        return songStoragePos + '/' + this.youtubeID + '.mp3';
    };
    Song.prototype.isDownloaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var songLoc, mp3Exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isDownloadedBool) return [3, 1];
                        return [2, this.isDownloadedBool];
                    case 1: return [4, this.getDownloadLocation()];
                    case 2:
                        songLoc = _a.sent();
                        return [4, fs.pathExists(songLoc)];
                    case 3:
                        mp3Exists = _a.sent();
                        this.isDownloadedBool = mp3Exists;
                        if (this.saved)
                            this.save();
                        return [2, mp3Exists];
                }
            });
        });
    };
    Song.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.isDownloaded()];
                    case 1:
                        if (!_a.sent()) return [3, 3];
                        return [4, this.removeDownload()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4, saveData1(function (database) {
                            delete database.songs[_this.youtubeID];
                            return database;
                        })];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Song.prototype.getObject = function () {
        return JSON.parse(JSON.stringify(this));
    };
    Song.prototype.getHTML = function () {
        var title = this.title;
        if (title == undefined)
            return '';
        if (title.length > 50)
            title = title.split('').splice(0, 20).join('') + '...';
        var channel = this.author;
        if (channel.length > 50)
            channel = channel.split('').splice(0, 20).join('') + '...';
        var html = "\n    <div class=\"song\" id=\"song-" + this.youtubeID + "\">\n      <div class=\"image\"><img src=\"" + this.image + "\"/></div>\n      <div class=\"buttons\">\n        <img class=\"more\" src=\"./images/options.png\"/>\n        <img class=\"like\" src=\"./images/heart.png\"/>\n      </div>\n      <div class=\"title\">" + title + "</div>\n      <br>\n      <div class=\"channel\">" + this.author + "</div>\n    </div>\n    ";
        return html;
    };
    return Song;
}());
//# sourceMappingURL=song.js.map