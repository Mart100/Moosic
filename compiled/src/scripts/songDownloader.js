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
var SongDownloader = (function () {
    function SongDownloader() {
        this.pending = [];
        this.inProgress = [];
        this.finished = [];
        this.downloadWidth = 10;
    }
    SongDownloader.prototype.queueNewDownload = function (songID, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var duplicateStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        duplicateStatus = this.getSongDownloadStatus(songID);
                        if (duplicateStatus == 0 || duplicateStatus == 1)
                            return [2, { res: "ERROR", err: "IN_PROGRESS" }];
                        this.pending.push(songID);
                        if (!(this.inProgress.length < this.downloadWidth)) return [3, 2];
                        return [4, this.startDownloadingSong(songID)];
                    case 1:
                        _a.sent();
                        return [2, { res: "SUCCESS" }];
                    case 2:
                        if (!options.priority) return [3, 4];
                        return [4, this.startDownloadingSong(songID)];
                    case 3:
                        _a.sent();
                        return [2, { res: "SUCCESS" }];
                    case 4: return [4, this.waitSongFinished(songID)];
                    case 5:
                        _a.sent();
                        return [2, { res: "SUCCESS" }];
                }
            });
        });
    };
    SongDownloader.prototype.waitSongFinished = function (songID) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var checkStatusInterval;
                        var _this = this;
                        return __generator(this, function (_a) {
                            checkStatusInterval = setInterval(function () {
                                var status = _this.getSongDownloadStatus(songID);
                                if (status == 2)
                                    resolve();
                            }, 5000);
                            return [2];
                        });
                    }); })];
            });
        });
    };
    SongDownloader.prototype.getSongDownloadStatus = function (songID) {
        if (this.pending.includes(songID))
            return 0;
        if (this.inProgress.includes(songID))
            return 1;
        if (this.finished.includes(songID))
            return 2;
        return -1;
    };
    SongDownloader.prototype.moveQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.pending.length == 0)
                    return [2];
                if (this.inProgress.length > this.downloadWidth)
                    return [2];
                this.startDownloadingSong(this.pending[0]);
                return [2];
            });
        });
    };
    SongDownloader.prototype.startDownloadingSong = function (songID) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var downloadWorker;
                        var _this = this;
                        return __generator(this, function (_a) {
                            this.pending.splice(this.pending.indexOf(songID), 1);
                            this.inProgress.push(songID);
                            downloadWorker = new Worker('./scripts/downloadSong.js');
                            downloadWorker.postMessage({
                                songID: songID,
                                songStoragePos: songStoragePos
                            });
                            downloadWorker.onmessage = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    this.inProgress.splice(this.inProgress.indexOf(songID), 1);
                                    this.finished.push(songID);
                                    this.moveQueue();
                                    resolve();
                                    return [2];
                                });
                            }); };
                            setTimeout(function () {
                                if (_this.finished.includes(songID))
                                    return;
                                _this.inProgress.splice(_this.inProgress.indexOf(songID), 1);
                                _this.moveQueue();
                                resolve();
                            }, 10000);
                            return [2];
                        });
                    }); })];
            });
        });
    };
    return SongDownloader;
}());
//# sourceMappingURL=songDownloader.js.map