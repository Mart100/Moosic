// https://auth0.com/blog/securing-electron-applications-with-openid-connect-and-oauth-2/

// const jwtDecode = require('jwt-decode');
// const keytar = require('keytar');
const os = require('os');

const clientId = '8115287ee2594bf186fe009ecda7b510'

const redirectUri = `file:///callback`;

const keytarService = 'electron-openid-oauth';
const keytarAccount = os.userInfo().username;

let accessToken = null;
let profile = null;
let refreshToken = null;

let win = null;

function createAuthWindow() {
    destroyAuthWin();

    // Create the browser window.
    win = new remote.BrowserWindow({
        width: 1000,
        height: 600,
    });

    win.loadURL(getAuthenticationURL());

    const {
        session: {
            webRequest
        }
    } = win.webContents;

    const filter = {
        urls: [
            `${redirectUri}*`
        ]
    };

    webRequest.onBeforeRequest(filter, async ({
        url
    }) => {
        console.log(url)
        return destroyAuthWin();
    });

    win.on('authenticated', () => {
        destroyAuthWin();
    });

    win.on('closed', () => {
        win = null;
    });
}


function destroyAuthWin() {
    if (!win) return;
    win.close();
    win = null;
}

function getAuthenticationURL() {
    let scopes = "playlist-read-private playlist-read-collaborative"
    let EUC = encodeURIComponent
    let link = `https://accounts.spotify.com/authorize`
    console.log(EUC(redirectUri))
    return `${link}?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`
}

function spotifyImport() {
    spotifyLink()
}


function spotifyLink() {
    createAuthWindow()
}