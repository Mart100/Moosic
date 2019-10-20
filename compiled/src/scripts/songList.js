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
var currentSongList = [];
var filters = {};
resetFilters();
function showSongs(songs, options) {
    return __awaiter(this, void 0, void 0, function () {
        var songsElem, songListElem, database, refinedSongs, searchTxtVal, searchTxt, searchFilter, _i, songs_1, s, song, filterOut, songTxt, alphabet, songsHtml, _a, refinedSongs_1, s, topBar, filterButton, filtersDiv;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!options)
                        options = {};
                    return [4, refreshSongs(songs, {})];
                case 1:
                    songs = _b.sent();
                    songsElem = getCurrentSongsElement();
                    if (songsElem == undefined)
                        return [2, console.log('ERR: 564')];
                    if (songsElem[0].parentElement.id == 'search')
                        options.topBar = false;
                    if (songsElem.find('.topBar')[0])
                        songsElem.find('.topBar').remove();
                    songsElem.prepend("    \n    <div class=\"topBar\">\n      <input class=\"search\" placeholder=\"Search songs\"></input>\n      <img class=\"filterButton\" src=\"images/filter.png\"/>\n      <div class=\"filters\">\n        <div class=\"sortBy\">\n          <span class=\"title\">Sort by:</span>\n          <hr>\n          <div id=\"sortby-lastadded\" class=\"button2\">Last added</div>\n          <div id=\"sortby-alphabetic\" class=\"button2\">Alphabetic</div>\n          <div id=\"sortby-lastplayed\" class=\"button2\">Last played</div>\n        </div>\n        <div class=\"filter\">\n          <span class=\"title\">Filter:</span>\n          <hr>\n          <div id=\"filter-downloaded\" class=\"button2\">Downloaded</div>\n          <div id=\"filter-liked\" class=\"button2\">Liked</div>\n        </div>\n      </div>\n    </div>\n  ");
                    $('.button2').each(function (i, a) {
                        var b = a.id.split('-');
                        var c = filters[b[0]][b[1]];
                        if (c)
                            $(a).addClass('selected');
                    });
                    if (options.topBar == false) {
                        songsElem.find('.topBar').remove();
                    }
                    if (songsElem.find('.songList')[0] == undefined) {
                        songsElem.append("<div class=\"songList\"></div>");
                    }
                    songListElem = songsElem.find('.songList');
                    songListElem.html('');
                    songs = Object.values(songs);
                    return [4, getData()];
                case 2:
                    database = _b.sent();
                    currentSongList = songs;
                    refinedSongs = [];
                    searchTxtVal = songsElem.find('.topBar .search').val();
                    if (searchTxtVal)
                        searchTxt = searchTxtVal.toString().toLowerCase();
                    searchFilter = (searchTxt != undefined) && (searchTxt != "");
                    console.log(filters);
                    for (_i = 0, songs_1 = songs; _i < songs_1.length; _i++) {
                        s = songs_1[_i];
                        song = new Song(s);
                        filterOut = false;
                        if (searchFilter) {
                            songTxt = (song.title + ' ' + song.author).toLowerCase();
                            if (songTxt.includes(searchTxt) == false)
                                filterOut = true;
                        }
                        if (filters.filter.liked)
                            if (!song.liked)
                                continue;
                        if (filters.filter.downloaded)
                            if (song.isDownloaded() == undefined)
                                continue;
                        if (filterOut)
                            continue;
                        refinedSongs.push(song);
                    }
                    refinedSongs.sort(function (a, b) { return a.order - b.order; });
                    if (filters.sortby.lastadded) {
                        refinedSongs.sort(function (a, b) {
                            return b.saveDate - a.saveDate;
                        });
                    }
                    if (filters.sortby.lastplayed) {
                        refinedSongs.sort(function (a, b) {
                            var lastA = a.lastPlayed;
                            if (!lastA)
                                a.lastPlayed = 0;
                            var lastB = b.lastPlayed;
                            if (!lastB)
                                b.lastPlayed = 0;
                            return lastB - lastA;
                        });
                    }
                    if (filters.sortby.alphabetic) {
                        alphabet = 'abcdefghijklmnopqrstuvxyz';
                        refinedSongs.sort(function (a, b) {
                            if (a.title > b.title)
                                return 1;
                            if (b.title > a.title)
                                return -1;
                            return 0;
                        });
                    }
                    songsHtml = '';
                    for (_a = 0, refinedSongs_1 = refinedSongs; _a < refinedSongs_1.length; _a++) {
                        s = refinedSongs_1[_a];
                        songsHtml += "<div class=\"song\" id=\"song-" + s.youtubeID + "\"></div>";
                    }
                    songListElem[0].innerHTML = songsHtml;
                    songListElem.on('scroll', function () {
                        var songNum = Math.floor(songListElem.scrollTop() / 82);
                        for (var i = -2; i < 10; i++)
                            loadSong(songNum + i, refinedSongs, songListElem);
                    });
                    songListElem.trigger('scroll');
                    scrollToCurrentSong();
                    topBar = songsElem.find('.topBar');
                    topBar.find('.search').off().on('input', function () {
                        showSongs(songs, options);
                    });
                    $('.button2').off().on('click', function (e) {
                        $(e.target).toggleClass('selected');
                        var a = e.target.id.split('-')[0];
                        var b = e.target.id.split('-')[1];
                        if ($(e.target).hasClass('selected')) {
                            filters[a][b] = true;
                            if (a == 'sortby') {
                                $('.sortby .button2').removeClass('selected');
                                $(e.target).addClass('selected');
                                filters.sortby.alphabetic = false;
                                filters.sortby.lastplayed = false;
                                filters.sortby.lastadded = false;
                                filters[a][b] = true;
                            }
                        }
                        else {
                            filters[a][b] = false;
                            if (a == 'sortby') {
                                $(e.target).trigger('click');
                            }
                        }
                        showSongs(songs, options);
                    });
                    filterButton = topBar.find('.filterButton');
                    filtersDiv = topBar.find('.filters');
                    filterButton.off().on('click', function () {
                        filtersDiv.toggleClass('expanded');
                    });
                    console.log('SHUW SONGS');
                    return [2];
            }
        });
    });
}
function resetFilters() {
    filters = {
        filter: {
            downloaded: false,
            liked: false,
        },
        sortby: {
            lastadded: true,
            alphabetic: false,
            lastplayed: false,
            none: false
        }
    };
}
function setSortByNone() {
    filters.lastadded = false;
    filters.alphabetic = false;
    filters.lastplayed = false;
    filters.none = true;
}
function getCurrentSongsElement() {
    return $(Object.values($('.songs')).filter(function (e) { return $(e).hasClass('songs') && $(e).css('display') != 'none'; })[0]);
}
function scrollToCurrentSong() {
    var currentSong = musicPlayer.currentSong;
    if (currentSong == undefined)
        return;
    var songElem = $("#song-" + currentSong.youtubeID);
    if (songElem == undefined)
        return;
    var songsContainer = getCurrentSongsElement().find('.songList');
    if (songsContainer.offset() == undefined)
        return;
    if (songElem.offset() == undefined)
        return;
    songsContainer.animate({
        scrollTop: songElem.offset().top - songsContainer.offset().top + songsContainer.scrollTop()
    });
}
function loadSong(idx, songs, songListElem) {
    var _this = this;
    var song = songs[idx];
    if (song == undefined)
        return;
    var songHTML = $(song.getHTML());
    if (song.liked)
        songHTML.find(" .buttons .like").attr('src', './images/red-heart.png');
    songListElem.find("#song-" + song.youtubeID).replaceWith(songHTML);
    songHTML.on('click', function (e) { onSongClick(e, songs); });
    songHTML.find('.like').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
        var song;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    song = songs.find(function (s) { return s.youtubeID == e.target.parentElement.parentElement.id.replace('song-', ''); });
                    if (!song.liked) return [3, 2];
                    return [4, song.dislike()];
                case 1:
                    _a.sent();
                    console.log('test');
                    $(e.target).attr('src', './images/heart.png');
                    return [3, 4];
                case 2: return [4, song.like()];
                case 3:
                    _a.sent();
                    $(e.target).attr('src', './images/red-heart.png');
                    _a.label = 4;
                case 4: return [2];
            }
        });
    }); });
    songHTML.find('.more').on('click', function (event) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            showTooltipForSong(song);
            return [2];
        });
    }); });
}
function showTooltipForSong(song) {
    return __awaiter(this, void 0, void 0, function () {
        var database, songsElem, songElem, tooltipHTML, currentColl, showRemoveFromColl, parent, tooltip, moreButton;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('teststst');
                    return [4, getData()];
                case 1:
                    database = _a.sent();
                    songsElem = getCurrentSongsElement();
                    songElem = songsElem.find('#song-' + song.youtubeID);
                    if (songElem.find('.tooltip')[0])
                        songElem.find('.tooltip').remove();
                    tooltipHTML = $("\n  <div class=\"tooltip\">\n    <button class=\"download\">Download</button>\n    <button class=\"openInYoutube\">Open in youtube</button>\n    <button class=\"addToCollection\">Add to collection</button>\n    <button class=\"playSimularSongs\">Play simular songs</button>\n    <button class=\"songInfo\">Song info</button>\n    <button class=\"deleteSong\">Delete songs</button>\n  </div>\n  ");
                    currentColl = database.collections.find(function (c) { return c.name == currentCollection; });
                    showRemoveFromColl = currentColl && currentColl.songs.includes(song.youtubeID);
                    if (showRemoveFromColl)
                        tooltipHTML.append('<button class="removeFromColl">Remove from this collection</button>');
                    songElem.append(tooltipHTML);
                    parent = songElem.parent();
                    tooltip = parent.find('.tooltip');
                    moreButton = parent.find('.more');
                    tooltip.on('mouseleave', function () {
                        tooltip.remove();
                    });
                    moreButton.on('mouseleave', function () {
                        if (parent.find('.tooltip:hover').length != 0)
                            return;
                        tooltip.remove();
                    });
                    if (showRemoveFromColl) {
                        tooltip.find('.removeFromColl').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, saveData1(function (data) {
                                            var currentColl1 = data.collections.find(function (c) { return c.name == currentCollection; });
                                            var idx = currentColl1.songs.indexOf(song.youtubeID);
                                            currentColl1.songs.splice(idx, 1);
                                            return data;
                                        })];
                                    case 1:
                                        _a.sent();
                                        parent[0].parentElement.remove();
                                        return [2];
                                }
                            });
                        }); });
                    }
                    tooltip.find('.deleteSong').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, song.delete()];
                                case 1:
                                    _a.sent();
                                    showSongs(currentSongList, {});
                                    return [2];
                            }
                        });
                    }); });
                    tooltip.find('.playSimularSongs').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var relatedVideos, relatedSongs, _i, relatedVideos_1, vid;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, getRelatedVideosYT(song.youtubeID)];
                                case 1:
                                    relatedVideos = _a.sent();
                                    relatedSongs = [];
                                    for (_i = 0, relatedVideos_1 = relatedVideos; _i < relatedVideos_1.length; _i++) {
                                        vid = relatedVideos_1[_i];
                                        relatedSongs.push(new Song().importFromYoutube(vid));
                                    }
                                    $('#songsPopup').fadeIn();
                                    $('#songsPopup .songs').fadeIn();
                                    setSortByNone();
                                    musicPlayer.setQueue(relatedSongs);
                                    musicPlayer.nextInQueue();
                                    return [2];
                            }
                        });
                    }); });
                    tooltip.find('.download').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            song.download({});
                            return [2];
                        });
                    }); });
                    tooltip.find('.openInYoutube').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            openURL("https://youtube.com/watch?v=" + song.youtubeID);
                            return [2];
                        });
                    }); });
                    tooltip.find('.songInfo').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var info;
                        return __generator(this, function (_a) {
                            info = "\n    song title: " + song.title + "\n    song thumbnail: " + song.image + "\n    song author: " + song.author + "\n    Last played: " + new Date(song.lastPlayed).toString() + "\n    saveDate: " + new Date(song.saveDate).toString() + "\n    youtubeID: " + song.youtubeID + "\n    ";
                            window.alert(info);
                            return [2];
                        });
                    }); });
                    tooltip.find('.addToCollection').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var collections, _loop_1, collectionNum;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    tooltip.html('');
                                    return [4, getData()];
                                case 1:
                                    database = _a.sent();
                                    collections = database.collections;
                                    _loop_1 = function (collectionNum) {
                                        var collection = collections[collectionNum];
                                        tooltip.append("<button id=\"addTo-coll-" + collectionNum + "\">Add to \"" + collection.name + "\"</button>");
                                        var addToCollButt = $("#addTo-coll-" + collectionNum);
                                        addToCollButt.off().on('click', function (e1) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                addSongToCollection(song, collectionNum);
                                                return [2];
                                            });
                                        }); });
                                    };
                                    for (collectionNum in collections) {
                                        _loop_1(collectionNum);
                                    }
                                    return [2];
                            }
                        });
                    }); });
                    return [2];
            }
        });
    });
}
//# sourceMappingURL=songList.js.map