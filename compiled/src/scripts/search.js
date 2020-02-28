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
var searchResults = [];
$(function () {
    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            gapi.client.load('youtube', 'v3', function () { return __awaiter(_this, void 0, void 0, function () {
                var data, apiKey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, getData()];
                        case 1:
                            data = _a.sent();
                            apiKey = data.settings.apiKey;
                            if (!apiKey) {
                                apiKey = ["A", "I", "z", "a", "S", "y", "C", "U", "Z", "Q", "R", "3", "2", "G", "k", "e", "E", "X", "h", "9", "Z", "A", "9", "W", "a", "p", "v", "T", "P", "E", "l", "a", "w", "h", "T", "c", "r", "R", "4"].join("");
                            }
                            gapi.client.setApiKey(apiKey);
                            return [2];
                    }
                });
            }); });
            return [2];
        });
    }); }, 1000);
    $('#search .input').on('change', function () { return __awaiter(_this, void 0, void 0, function () {
        var results, _i, results_1, video, song;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    $('#search .results').html('');
                    searchResults = [];
                    if ($('#search .input').val() == '')
                        return [2];
                    return [4, getYoutubeResults()];
                case 1:
                    results = _a.sent();
                    console.log(results);
                    _i = 0, results_1 = results;
                    _a.label = 2;
                case 2:
                    if (!(_i < results_1.length)) return [3, 5];
                    video = results_1[_i];
                    return [4, new Song().importFromYoutube(video)];
                case 3:
                    song = _a.sent();
                    searchResults[song.youtubeID] = song;
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3, 2];
                case 5:
                    setSortByNone();
                    showSongs(searchResults, { topBar: false, scrollCurrentSong: false, refresh: true });
                    $('#queue').hide();
                    return [2];
            }
        });
    }); });
});
function getYoutubeResults() {
    return new Promise(function (resolve, reject) {
        var q = $('#search .input').val();
        var request = gapi.client.youtube.search.list({
            q: q,
            part: 'snippet',
            type: 'video',
            topicId: '/m/04rlf',
            maxResults: 50
        });
        request.execute(function (response) {
            if (!response.result) {
                console.error(response);
                return resolve({});
            }
            resolve(response.result.items);
        });
    });
}
//# sourceMappingURL=search.js.map