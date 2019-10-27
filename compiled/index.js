var electron = require('electron');
var dialog = electron.dialog;
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var globalShortcut = electron.globalShortcut;
var ipcMain = electron.ipcMain;
var log = require('electron-log');
require('v8-compile-cache');
try {
    require('electron-reload')(__dirname, {
        ignored: /node_modules|storage|[\/\\]\./
    });
}
catch (e) { }
app.on('ready', function () {
    var window = new BrowserWindow({
        width: 400,
        height: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        },
        icon: './icon.ico'
    });
    window.setMenu(null);
    window.setMaximizable(false);
    window.setResizable(false);
    window.loadFile('./compiled/src/index.html');
    if (isDevv()) {
        window.webContents.once('dom-ready', function () {
            window.webContents.openDevTools();
        });
    }
    window.on('closed', function () { win = null; });
    globalShortcut.register('MediaPlayPause', function () {
        window.webContents.executeJavaScript("onMediaPlayPause()");
    });
    globalShortcut.register('MediaPreviousTrack', function () {
        window.webContents.executeJavaScript("onMediaPreviousTrack()");
    });
    globalShortcut.register('MediaNextTrack', function () {
        window.webContents.executeJavaScript("onMediaNextTrack()");
    });
});
function isDevv() {
    try {
        require('electron-builder');
    }
    catch (e) {
        return false;
    }
    return true;
}
//# sourceMappingURL=index.js.map