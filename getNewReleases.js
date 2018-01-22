var request = require('request');
var client_id = '7009b5fff6114eacb9413bbf98fccbfe'; // Your client id
var client_secret = '034aff74afc846aab6b9a01043e2c436'; // Your secret

module.exports = function (context, callback) {
    getAccessToken()
        .then(token => {
            var access_token = token.access_token;
            if (context.query.action === 'getAlbum') {
                return getAlbum(access_token, context.query.id)
                    .then(response => callback(null, response))
            }
            else {
                return getNewReleases(access_token)
                    .then(response => callback(null, response))
            }
        })
        .catch(err => callback('Error: ' + err.message, null));
};

function getNewReleases(access_token) {
    return new Promise((resolve, reject) => {
        // use the access token to access the Spotify Web API
        var options = {
            url: 'https://api.spotify.com/v1/browse/new-releases?country=US',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true
        };
        request.get(options, function (error, response, html) {
            if (error) {
                return reject(error);
            }
            resolve(html);
        });
    });
}

function getAlbum(access_token, albumId) {
    return new Promise((resolve, reject) => {
        // use the access token to access the Spotify Web API
        var options = {
            url: 'https://api.spotify.com/v1/albums/' + albumId,
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true
        };
        request.get(options, function (error, response, html) {
            if (error) {
                return reject(error);
            }
            resolve(html);
            console.log(html);
        });
    });
}

function getAccessToken() {
    return new Promise((resolve, reject) => {
        var options = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
            form: {grant_type: 'client_credentials'},
            json: true
        };
        request.post(options, function (error, response, html) {
            if (error) {
                return reject(error);
            }
            resolve(html);
        });
    });
}