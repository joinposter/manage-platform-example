var request = require('request');
var md5 = require('md5');
var querystring = require('querystring');
var config = require('../config');


class PosterApi {
    constructor(props) {
        this.token = props.token;
        this.account = props.account;
    }

    static makePosterRequest(method, type, params) {
        let options = {
            method: type.toUpperCase(),
            url: 'http://joinposter.com/api/' + method,
        };

        if (params) {
            options.url += '?' + querystring.encode(params.params)
        }

        return new Promise((resolve, reject) => {
            request(options, (err, response, body) => {
                body = JSON.parse(body);
                resolve(body);
            });
        });
    }

    static auth(code) {
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: 'https://joinposter.com/api/auth/manage',
                form: {
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    code: code,
                    verify: md5([config.clientId, config.clientSecret, code].join(':')),
                }
            }, (err, response, body) => {
                body = JSON.parse(body);

                resolve(body);
            });
        });
    }

    getAllSettings() {
        return PosterApi.makePosterRequest('settings.getAllSettings', 'GET', {
            params: {account: this.account, token: this.token},
        });
    }
}


module.exports = PosterApi;