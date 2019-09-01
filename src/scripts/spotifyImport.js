// https://auth0.com/blog/securing-electron-applications-with-openid-connect-and-oauth-2/
const clientId = '8115287ee2594bf186fe009ecda7b510'
const redirectUri = `file://callback`;

let win = null;

function getSpotifyAccessToken() {
    return new Promise((resolve, reject) => {
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
                `${redirectUri}/*`
            ]
        };

        webRequest.onBeforeRequest(filter, async ({
            url
        }) => {
            console.log(url)
            resolve(parseURL(url))
            destroyAuthWin();
        });

        win.on('authenticated', () => {
            destroyAuthWin();
        });

        win.on('closed', () => {
            win = null;
        });
    })
}

function parseURL(url) {
    if(!url.startsWith(redirectUri)) return
    let query = url.split('#')[1].split('&')
    if(query.find(q  => q.startsWith('error'))) return
    let accessToken = query.find(q  => q.startsWith('access_token')).split('=')[1]
    let expiresIn = query.find(q  => q.startsWith('expires_in')).split('=')[1]

    return accessToken
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
    return `${link}?response_type=token&client_id=${clientId}&scope=${EUC(scopes)}&redirect_uri=${EUC(redirectUri)}`
}
