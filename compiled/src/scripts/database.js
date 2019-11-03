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
var databaseCache;
var databaseCacheValid = false;
var databaseFileLoc = storagePos + '/database.json';
function getData() {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (databaseCacheValid)
                        return [2, resolve(databaseCache)];
                    return [4, fs.pathExists(storagePos + '\\database.json')];
                case 1:
                    if (!!(_a.sent())) return [3, 3];
                    return [4, createEmptyDatabase()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4, awaitSavingStatus()];
                case 4:
                    _a.sent();
                    fs.readFile(databaseFileLoc, 'utf8', function (err, obj) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, objParsed, DBsongs, songID, songObj, database;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!err) return [3, 3];
                                    console.error(err);
                                    if (!err.toString().includes('no such file or directory')) return [3, 3];
                                    return [4, createEmptyDatabase()];
                                case 1:
                                    _b.sent();
                                    _a = resolve;
                                    return [4, getData()];
                                case 2:
                                    _a.apply(void 0, [_b.sent()]);
                                    _b.label = 3;
                                case 3:
                                    objParsed = JSON.parse(obj);
                                    DBsongs = [];
                                    for (songID in objParsed.songs) {
                                        songObj = objParsed.songs[songID];
                                        if (songObj.youtubeID == undefined)
                                            continue;
                                        DBsongs.push(new Song(songObj));
                                    }
                                    database = {
                                        songs: DBsongs,
                                        collections: objParsed.collections,
                                        songStoragePos: objParsed.songStoragePos
                                    };
                                    databaseCache = database;
                                    databaseCacheValid = true;
                                    resolve(database);
                                    return [2];
                            }
                        });
                    }); });
                    return [2];
            }
        });
    }); });
}
function createStorageFolder() {
    var _this = this;
    return new Promise(function (resolve, reject) {
        fs.ensureDir(storagePos, function (err) {
            console.error(err);
            fs.ensureDir(storagePos + '/songs', function (err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.error(err);
                            return [4, createEmptyDatabase()];
                        case 1:
                            _a.sent();
                            resolve();
                            return [2];
                    }
                });
            }); });
        });
    });
}
function createEmptyDatabase() {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var obj = {
            "songs": {},
            "collections": []
        };
        fs.writeJson(databaseFileLoc, obj, function (err) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!err) return [3, 2];
                        console.error(err);
                        if (!err.toString().includes('no such file or directory')) return [3, 2];
                        return [4, createStorageFolder()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        databaseCacheValid = false;
                        resolve();
                        return [2];
                }
            });
        }); });
    });
}
function saveData(obj) {
    obj = JSON.stringify(obj);
    return new Promise(function (resolve, reject) {
        fs.writeFile(databaseFileLoc, obj, function (err) {
            if (err)
                console.error(err);
            resolve();
        });
    });
}
function readDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    fs.readFile(databaseFileLoc, 'utf8', function (err, obj) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (err)
                                console.error(err);
                            obj = JSON.parse(obj);
                            resolve(obj);
                            return [2];
                        });
                    }); });
                })];
        });
    });
}
var savingStatus = false;
function saveData1(func) {
    return __awaiter(this, void 0, void 0, function () {
        var data, newData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, awaitSavingStatus()];
                case 1:
                    _a.sent();
                    savingStatus = true;
                    return [4, readDatabase()];
                case 2:
                    data = _a.sent();
                    return [4, func(data)];
                case 3:
                    newData = _a.sent();
                    return [4, saveData(newData)];
                case 4:
                    _a.sent();
                    savingStatus = false;
                    databaseCacheValid = false;
                    return [2];
            }
        });
    });
}
function awaitSavingStatus() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var interval = setInterval(function () {
                        if (!savingStatus) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 100);
                })];
        });
    });
}
//# sourceMappingURL=database.js.map