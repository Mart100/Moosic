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
    $('#likedSongs-button').on('click', function (event) { return __awaiter(_this, void 0, void 0, function () {
        var database, songs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getData()];
                case 1:
                    database = _a.sent();
                    songs = database.songs;
                    songs = Object.values(songs);
                    songs = songs.filter(function (s) { return s.liked == true; });
                    songs.sort(function (a, b) { return a.order - b.order; });
                    $('#mySongsMenu').hide();
                    $('#mySongs .songs').show();
                    showSongs(songs, { refresh: true, scrollCurrentSong: false });
                    return [2];
            }
        });
    }); });
    $('#allSongs-button').on('click', function (event) { return __awaiter(_this, void 0, void 0, function () {
        var database, songs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getData()];
                case 1:
                    database = _a.sent();
                    songs = Object.values(database.songs);
                    $('#mySongsMenu').hide();
                    $('#mySongs .songs').show();
                    showSongs(songs, { refresh: true, scrollCurrentSong: false });
                    return [2];
            }
        });
    }); });
    $('#newCollection-button').on('click', function (event) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, createNewCollection()];
                case 1:
                    _a.sent();
                    return [4, loadCollections()];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    }); });
});
function refreshSongs(songs, options) {
    return __awaiter(this, void 0, void 0, function () {
        var newSongs, database, i, song, songID, songDB, newSong;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!options) {
                        options = {
                            inDB: false
                        };
                    }
                    newSongs = [];
                    return [4, getData()];
                case 1:
                    database = _a.sent();
                    for (i in songs) {
                        song = songs[i];
                        songID = song.youtubeID;
                        songDB = database.songs[songID];
                        newSong = void 0;
                        if (songDB != undefined)
                            newSong = new Song(songDB);
                        else {
                            if (options.inDB)
                                continue;
                            else
                                newSong = new Song(song);
                        }
                        newSongs.push(newSong);
                    }
                    return [2, newSongs];
            }
        });
    });
}
var currentCollection = 'none';
function loadCollections() {
    return __awaiter(this, void 0, void 0, function () {
        var database, collections, songs, _loop_1, collectionNum;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    $('.collection-button').remove();
                    return [4, getData()];
                case 1:
                    database = _a.sent();
                    collections = database.collections;
                    songs = Object.values(database.songs);
                    _loop_1 = function (collectionNum) {
                        var collection = collections[collectionNum];
                        var html = "\n    <div class=\"button1 collection-button\" id=\"coll-" + collectionNum + "-button\">\n    <img class=\"options-button\" src=\"./images/options.png\" />\n    <span class=\"name\">" + collection.name + "</span>\n    </div>\n    ";
                        $('#newCollection-button').before(html);
                        var button = $("#coll-" + collectionNum + "-button");
                        button.on('click', function () { return __awaiter(_this, void 0, void 0, function () {
                            var collectionSongs;
                            return __generator(this, function (_a) {
                                $('#mySongsMenu').hide();
                                $('#mySongs .songs').show();
                                collectionSongs = songs.filter(function (s) { return collection.songs.includes(s.youtubeID); });
                                currentCollection = collection.name;
                                showSongs(collectionSongs, {});
                                return [2];
                            });
                        }); }).children().click(function (e) { return false; });
                        button.find('.options-button').on('click', function (event) {
                            button.append("\n      <div class=\"options\">\n        <button class=\"rename\">Rename</button>\n        <button class=\"downloadAll\">Download all</button>\n        <button class=\"likeAll\">Like all</button>\n        <button class=\"delete\">Delete</button>\n      </div>\n      ");
                            var parent = $(event.target.parentElement);
                            var options = parent.find('.options');
                            var optionsButton = parent.find('.options-button');
                            options.click(function (e) {
                                options.remove();
                                return false;
                            });
                            options.on('mouseleave', function () {
                                options.remove();
                            });
                            optionsButton.on('mouseleave', function () {
                                if (parent.find('.options:hover').length != 0)
                                    return;
                                options.remove();
                            });
                            options.find('.rename').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var renameInput;
                                return __generator(this, function (_a) {
                                    button.find('.name').hide();
                                    button.append("<input type=\"text\" class=\"renameInput\" placeholder=\"" + collection.name + "\">");
                                    renameInput = button.find('.renameInput');
                                    renameInput.focus();
                                    renameInput.on('change', function () {
                                        var newName = renameInput.val().toString();
                                        renameInput.remove();
                                        button.find('.name').html(newName);
                                        button.find('.name').show();
                                        saveData1(function (data) {
                                            data.collections[collectionNum].name = newName;
                                            return data;
                                        });
                                    });
                                    renameInput.on('click', function () { return false; });
                                    return [2];
                                });
                            }); });
                            options.find('.downloadAll').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var collectionSongs, _i, collectionSongs_1, song;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, getData()];
                                        case 1:
                                            database = _a.sent();
                                            collectionSongs = Object.values(database.songs).filter(function (s) { return collection.songs.includes(s.youtubeID); });
                                            for (_i = 0, collectionSongs_1 = collectionSongs; _i < collectionSongs_1.length; _i++) {
                                                song = collectionSongs_1[_i];
                                                song = new Song(song);
                                                song.download({});
                                            }
                                            return [2];
                                    }
                                });
                            }); });
                            options.find('.likeAll').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var collectionSongs, _i, collectionSongs_2, song;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, getData()];
                                        case 1:
                                            database = _a.sent();
                                            collectionSongs = Object.values(database.songs).filter(function (s) { return collection.songs.includes(s.youtubeID); });
                                            for (_i = 0, collectionSongs_2 = collectionSongs; _i < collectionSongs_2.length; _i++) {
                                                song = collectionSongs_2[_i];
                                                song = new Song(song);
                                                song.like();
                                            }
                                            return [2];
                                    }
                                });
                            }); });
                            options.find('.delete').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!window.confirm("Are you sure you want to delete collection: " + collection.name + " ??"))
                                                return [2];
                                            return [4, saveData1(function (data) {
                                                    data.collections = data.collections.filter(function (c) { return c.name != collection.name; });
                                                    return data;
                                                })];
                                        case 1:
                                            _a.sent();
                                            loadCollections();
                                            return [2];
                                    }
                                });
                            }); });
                        });
                    };
                    for (collectionNum in collections) {
                        _loop_1(collectionNum);
                    }
                    return [2];
            }
        });
    });
}
//# sourceMappingURL=mySongs.js.map