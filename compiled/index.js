#!/usr/bin/env node
var electron = require('electron');
var dialog = electron.dialog;
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var globalShortcut = electron.globalShortcut;
var ipcMain = electron.ipcMain;
var log = require('electron-log');
var fs_ = require('fs-extra');
require('v8-compile-cache');
var mainWindow;
try {
    require('electron-reload')(__dirname, {
        ignored: /node_modules|storage|[\/\\]\./
    });
}
catch (e) { }
app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        },
        icon: './icon.ico'
    });
    mainWindow.setMenu(null);
    mainWindow.setMaximizable(false);
    mainWindow.setResizable(false);
    mainWindow.loadFile('./compiled/src/index.html');
    if (isDevv()) {
        mainWindow.webContents.once('dom-ready', function () {
            mainWindow.webContents.openDevTools();
        });
    }
    var backedUpDatabase = false;
    mainWindow.on('close', function (e) {
        if (!backedUpDatabase)
            e.preventDefault();
        else
            return;
        var storagePos = process.env.APPDATA + '/moosic' + '/storage';
        var databasePos = storagePos + '/' + 'database.json';
        console.log('Tried closing: ', databasePos);
        fs_.readFile(databasePos, 'utf8', function (err, obj) {
            try {
                var parsedObj = JSON.parse(obj);
            }
            catch (error) {
                err = error;
            }
            if (err) {
                console.log(err);
                backedUpDatabase = true;
                app.quit();
                return;
            }
            fs_.copyFile(databasePos, storagePos + '/' + 'database_backup.json', function (err) {
                if (err)
                    throw err;
                console.log('Successfully backed up database.json');
                backedUpDatabase = true;
                app.quit();
            });
        });
    });
    mainWindow.on('closed', function () { win = null; });
    globalShortcut.register('MediaPlayPause', function () {
        mainWindow.webContents.executeJavaScript("onMediaPlayPause()");
    });
    globalShortcut.register('MediaPreviousTrack', function () {
        mainWindow.webContents.executeJavaScript("onMediaPreviousTrack()");
    });
    globalShortcut.register('MediaNextTrack', function () {
        mainWindow.webContents.executeJavaScript("onMediaNextTrack()");
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
var ipc_mainProc = require('node-ipc');
ipc_mainProc.config.id = 'electron_process';
ipc_mainProc.config.stopRetrying = true;
ipc_mainProc.serve(function () { return ipc_mainProc.server.on('execJS', function (message) {
    mainWindow.webContents.executeJavaScript(message);
}); });
ipc_mainProc.server.start();
//# sourceMappingURL=index.js.map