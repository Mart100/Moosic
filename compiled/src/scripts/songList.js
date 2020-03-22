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
        var songsElem, songListElem, database, refinedSongs, searchTxtVal, searchTxt, searchFilter, refreshSongList, _i, songs_1, s, song, filterOut, songTxt, mode_1, now_1, alphabet, songsHtml, _a, refinedSongs_1, s, songFocus, songFocusIDX, songHeight_1, topBar, filterButton, filtersDiv;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log();
                    if (options.topBar == undefined)
                        options.topBar = true;
                    if (options.sort == undefined)
                        options.sort = true;
                    if (options.refresh == undefined)
                        options.refresh = false;
                    if (options.scrollCurrentSong == undefined)
                        options.scrollCurrentSong = true;
                    return [4, refreshSongs(songs, {})];
                case 1:
                    songs = _b.sent();
                    songsElem = getCurrentSongsElement();
                    if (songsElem == undefined)
                        return [2, console.log('ERR: 564')];
                    if (songsElem[0].parentElement.id == 'search')
                        options.topBar = false;
                    if (songsElem.find('.topBar')[0] == undefined)
                        songsElem.prepend("    \n    <div class=\"topBar\">\n      <input class=\"search\" placeholder=\"Search songs\">\n      <img class=\"clearSearch\" src=\"./images/delete.png\">\n      </input>\n      <img class=\"filterButton\" src=\"images/filter.png\"/>\n      <div class=\"filters\">\n        <div class=\"sortBy\">\n          <span class=\"title\">Sort by:</span>\n          <hr>\n          <div id=\"sortby-lastadded\" class=\"button2\"><span>Last added</span></div>\n          <div id=\"sortby-alphabetic\" class=\"button2\"><span>Alphabetic</span></div>\n          <div id=\"sortby-lastplayed\" class=\"button2\"><span>Last played</span></div>\n          <div id=\"sortby-mostplayed\" class=\"button2\"><span>Most played</span></div>\n        </div>\n        <div class=\"filter\">\n          <span class=\"title\">Filter:</span>\n          <hr>\n          <div id=\"filter-downloaded\" class=\"button2\"><span>Downloaded</span></div>\n          <div id=\"filter-liked\" class=\"button2\"><span>Liked</span></div>\n        </div>\n      </div>\n    </div>\n  ");
                    $("#sortby-mostplayed").html('<span>Most played</span>');
                    $('.filters .button2').each(function (i, a) {
                        var b = a.id.split('-');
                        var c = filters[b[0]][b[1]];
                        if (c)
                            $(a).addClass('selected');
                        else
                            $(a).removeClass('selected');
                        if (filters['sortby']['mostplayed']) {
                            $("#sortby-mostplayed").html("\n      <span>Most played:</span>\n      <div class=\"day\">Today</div>\n      <div class=\"week\">This week</div>\n      <div class=\"month\">This month</div>\n      <div class=\"year\">This year</div>\n      <div class=\"alltime\">All time</div>\n      ");
                            $("#sortby-mostplayed div." + filters.mostplayedmode).addClass('selected');
                        }
                    });
                    songsElem.find('.topBar .clearSearch').off().on('click', function () {
                        songsElem.find('.topBar .search').val('');
                        options.refresh = true;
                        showSongs(songs, options);
                    });
                    if (options.topBar == false)
                        songsElem.find('.topBar').remove();
                    if (songsElem.find('.songList')[0] == undefined)
                        songsElem.append("<div class=\"songList\"></div>");
                    songListElem = songsElem.find('.songList');
                    if (songs.length == 0) {
                        if (songsElem.parent().attr('id') == 'search')
                            return [2, songListElem.html('^ Use input to search trough youtube ^')];
                        return [2, songListElem.html('No songs here :(')];
                    }
                    songs = Object.values(songs);
                    return [4, getData()];
                case 2:
                    database = _b.sent();
                    currentSongList = songs;
                    refinedSongs = [];
                    searchTxtVal = songsElem.find('.topBar .search').val();
                    if (searchTxtVal) {
                        searchTxt = searchTxtVal.toString().toLowerCase();
                        songsElem.find('.topBar .clearSearch').show();
                    }
                    else {
                        songsElem.find('.topBar .clearSearch').hide();
                    }
                    searchFilter = (searchTxt != undefined) && (searchTxt != "");
                    refreshSongList = (songListElem.html().length < 1 || options.refresh);
                    if (refreshSongList) {
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
                        if (options.sort != false) {
                            refinedSongs.sort(function (a, b) { return a.order - b.order; });
                            if (filters.sortby.lastadded) {
                                refinedSongs.sort(function (a, b) {
                                    return b.saveDate - a.saveDate;
                                });
                            }
                            if (filters.sortby.mostplayed) {
                                mode_1 = filters.mostplayedmode;
                                now_1 = Date.now();
                                refinedSongs.sort(function (a, b) {
                                    var scoreA = countMostPlayedScores(a, mode_1, now_1);
                                    var scoreB = countMostPlayedScores(b, mode_1, now_1);
                                    return scoreB - scoreA;
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
                        }
                        currentSongList = refinedSongs;
                        songsHtml = '';
                        for (_a = 0, refinedSongs_1 = refinedSongs; _a < refinedSongs_1.length; _a++) {
                            s = refinedSongs_1[_a];
                            songsHtml += "<div class=\"song\" style=\"height: " + (songHeight - 20) + "px\" id=\"song-" + s.youtubeID + "\"></div>";
                        }
                        songListElem[0].innerHTML = songsHtml;
                    }
                    songListElem.on('scroll', function () {
                        var songNum = Math.floor(songListElem.scrollTop() / songHeight);
                        var loadSize = Math.ceil(songListElem.height() / songHeight) + 2;
                        for (var i = -2; i < loadSize; i++)
                            loadSong(songNum + i, refinedSongs, songListElem);
                    });
                    songListElem.trigger('scroll');
                    if (options.songFocusID) {
                        songFocus = refinedSongs.find(function (s) { return s.youtubeID == options.songFocusID; });
                        songFocusIDX = refinedSongs.indexOf(songFocus);
                        if (songFocusIDX > -1) {
                            songHeight_1 = songFocusIDX * 80;
                            console.log(songFocusIDX, songHeight_1);
                            setTimeout(function () { songListElem[0].scrollTop = songHeight_1; }, 100);
                        }
                    }
                    else {
                        if (options.scrollCurrentSong)
                            scrollToCurrentSong();
                        else {
                            songListElem[0].scrollTop = 0;
                        }
                    }
                    topBar = songsElem.find('.topBar');
                    topBar.find('.search').off().on('input', function () {
                        console.log('yoinks');
                        options.refresh = true;
                        showSongs(songs, options);
                    });
                    $('.button2').off().on('click', function (e) {
                        $(e.target).toggleClass('selected');
                        var elem = e.target;
                        var subElem = false;
                        if (!$(elem).parent().hasClass("sortBy") && !$(elem).parent().hasClass("filter")) {
                            elem = $(elem).parent()[0];
                            subElem = true;
                        }
                        var a = elem.id.split('-')[0];
                        var b = elem.id.split('-')[1];
                        if ($(e.target).hasClass('selected') || subElem) {
                            console.log(a, b);
                            filters[a][b] = true;
                            if (a == 'sortby') {
                                $('.sortby .button2').removeClass('selected');
                                $(e.target).addClass('selected');
                                filters.sortby.alphabetic = false;
                                filters.sortby.lastplayed = false;
                                filters.sortby.lastadded = false;
                                filters.sortby.mostplayed = false;
                                filters[a][b] = true;
                                if (b == 'mostplayed') {
                                    if (subElem) {
                                        console.log(e.target.classList);
                                        var mode = e.target.classList[0];
                                        $(e.target).addClass('selected');
                                        filters.mostplayedmode = mode;
                                    }
                                    else {
                                        $("#sortby-mostplayed").html("\n            <span>Most played:</span>\n            <div class=\"day\">Today</div>\n            <div class=\"week\">This week</div>\n            <div class=\"month\">This month</div>\n            <div class=\"year\">This year</div>\n            <div class=\"alltime\">All time</div>\n            ");
                                        return;
                                    }
                                }
                            }
                        }
                        else {
                            filters[a][b] = false;
                            if (a == 'sortby') {
                                $(e.target).trigger('click');
                            }
                        }
                        options.refresh = true;
                        showSongs(songs, { refresh: true });
                        filtersDiv.toggleClass('expanded');
                    });
                    filterButton = topBar.find('.filterButton');
                    filtersDiv = topBar.find('.filters');
                    filterButton.off().on('click', function () {
                        filtersDiv.toggleClass('expanded');
                    });
                    console.log('SHOW SONGLIST');
                    return [2];
            }
        });
    });
}
function refreshCurrentSongList() {
    return __awaiter(this, void 0, void 0, function () {
        var list, songs, _i, currentSongList_1, song, song2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getSongs()];
                case 1:
                    songs = _a.sent();
                    for (_i = 0, currentSongList_1 = currentSongList; _i < currentSongList_1.length; _i++) {
                        song = currentSongList_1[_i];
                        song2 = new Song(songs[song.youtubeID]);
                        list.push(song2);
                    }
                    return [2, list];
            }
        });
    });
}
function countMostPlayedScores(song, mode, now) {
    var score = 0;
    for (var _i = 0, _a = song.playedTimes; _i < _a.length; _i++) {
        var dateM = _a[_i];
        var dateMs = dateM * 60 * 1000;
        if (mode == 'day' && now - dateMs < 1000 * 60 * 60 * 24)
            score++;
        if (mode == 'week' && now - dateMs < 1000 * 60 * 60 * 24 * 7)
            score++;
        if (mode == 'month' && now - dateMs < 1000 * 60 * 60 * 24 * 31)
            score++;
        if (mode == 'year' && now - dateMs < 1000 * 60 * 60 * 24 * 365)
            score++;
        if (mode == 'alltime')
            score++;
    }
    return score;
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
            mostplayed: false,
            none: false
        },
        mostplayedmode: 'day'
    };
}
function setSortByNone() {
    filters.sortby.lastadded = false;
    filters.sortby.alphabetic = false;
    filters.sortby.lastplayed = false;
    filters.sortby.mostplayed = false;
    filters.sortby.none = true;
    filters.mostplayedmode;
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
    if (songListElem.find("#song-" + song.youtubeID)[0] == undefined)
        return;
    if (songListElem.find("#song-" + song.youtubeID).html().length != 0)
        return;
    var songHTML = $(song.getHTML());
    if (song.liked)
        songHTML.find(" .buttons .like").attr('src', './images/red-heart.png');
    var SSP = songHeight / 5;
    var RSH = songHeight - SSP;
    var buttonsHeight = RSH;
    var buttonsWidth = 40;
    var buttonsPadding = 0;
    var likeButtonSize = (RSH - 8) / 2 - 10;
    var moreButtonSize = (RSH - 8) / 2;
    if ((likeButtonSize + 10 + moreButtonSize + 8) < 50) {
        likeButtonSize = (RSH - 8) / 1.4 - 10;
        moreButtonSize = (RSH - 8) / 1.4;
        buttonsWidth = 80;
        buttonsPadding = (RSH - RSH / 1.4) / 2;
        buttonsHeight = RSH - buttonsPadding * 2;
    }
    songHTML.css({ 'height': songHeight - SSP, 'padding': SSP / 2 - 1 });
    songHTML.find('.like').css({ 'height': likeButtonSize, 'width': likeButtonSize });
    songHTML.find('.buttons').css({ 'height': buttonsHeight, 'width': buttonsWidth, 'padding': buttonsPadding });
    songHTML.find('.more').css({ 'height': moreButtonSize, 'width': moreButtonSize });
    songHTML.find('.image').css({ 'height': RSH, 'width': RSH });
    songListElem.find("#song-" + song.youtubeID).replaceWith(songHTML);
    songHTML.on('click', function (e) { onSongClick(e, currentSongList); });
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
        var database, songsElem, songElem, isDownloaded, downloadText, tooltipHTML, currentColl, showRemoveFromColl, parent, tooltip, moreButton;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('tooltip func');
                    return [4, getData()];
                case 1:
                    database = _a.sent();
                    songsElem = getCurrentSongsElement();
                    songElem = songsElem.find('#song-' + song.youtubeID);
                    return [4, song.isDownloaded()];
                case 2:
                    isDownloaded = _a.sent();
                    downloadText = 'Download';
                    if (isDownloaded)
                        downloadText = 'Redownload';
                    if (songElem.find('.tooltip')[0])
                        songElem.find('.tooltip').remove();
                    tooltipHTML = $("\n  <div class=\"tooltip\">\n    <button class=\"download\">" + downloadText + "</button>\n    <button class=\"openInYoutube\">Open in youtube</button>\n    <button class=\"addToCollection\">Add to collection</button>\n    <button class=\"playSimularSongs\">Play similar songs</button>\n    <button class=\"saveSongAs\">Save song as</button>\n    <button class=\"songInfo\">Song info</button>\n    <button class=\"deleteSong\">Delete songs</button>\n  </div>\n  ");
                    currentColl = database.collections.find(function (c) { return c.name == currentCollection; });
                    showRemoveFromColl = currentColl && currentColl.songs.includes(song.youtubeID);
                    if (showRemoveFromColl)
                        tooltipHTML.append('<button class="removeFromColl">Remove from this collection</button>');
                    songElem.prepend(tooltipHTML);
                    parent = songElem.parent();
                    tooltip = parent.find('.tooltip');
                    moreButton = parent.find('.more');
                    tooltip.on('mouseleave', function () {
                        tooltip.remove();
                    });
                    moreButton.on('mouseleave', function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, sleep(100)];
                                case 1:
                                    _a.sent();
                                    if (parent.find('.tooltip:hover').length != 0)
                                        return [2];
                                    tooltip.remove();
                                    return [2];
                            }
                        });
                    }); });
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
                        var songidx;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, song.delete()];
                                case 1:
                                    _a.sent();
                                    songidx = currentSongList.indexOf(currentSongList.find(function (s) { return s.youtubeID == song.youtubeID; }));
                                    if (songidx > -1)
                                        currentSongList.splice(songidx, 1);
                                    showSongs(currentSongList, { refresh: true });
                                    return [2];
                            }
                        });
                    }); });
                    tooltip.find('.playSimularSongs').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var relatedVideos, relatedSongs, _i, relatedVideos_1, vid, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4, getRelatedVideosYT(song.youtubeID)];
                                case 1:
                                    relatedVideos = _c.sent();
                                    relatedSongs = [];
                                    _i = 0, relatedVideos_1 = relatedVideos;
                                    _c.label = 2;
                                case 2:
                                    if (!(_i < relatedVideos_1.length)) return [3, 5];
                                    vid = relatedVideos_1[_i];
                                    _b = (_a = relatedSongs).push;
                                    return [4, new Song().importFromYoutube(vid)];
                                case 3:
                                    _b.apply(_a, [_c.sent()]);
                                    _c.label = 4;
                                case 4:
                                    _i++;
                                    return [3, 2];
                                case 5:
                                    $('#songsPopup').fadeIn();
                                    $('#songsPopup .songs').fadeIn();
                                    setSortByNone();
                                    showSongs(relatedSongs, { refresh: true });
                                    musicPlayer.setQueue(relatedSongs);
                                    musicPlayer.nextInQueue();
                                    return [2];
                            }
                        });
                    }); });
                    tooltip.find('.saveSongAs').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            FileSaver.saveAs(song.getDownloadLocation(), song.title + ".mp3");
                            return [2];
                        });
                    }); });
                    tooltip.find('.download').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            song.download({ redownload: true });
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