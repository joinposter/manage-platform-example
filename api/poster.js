var request = require('request');
var md5 = require('md5');
var querystring = require('querystring');
var config = require('../config');


class PosterApi {
    constructor(props) {
        this.token = props.token;
        this.account = props.account;
    }

    /**
     * Метод делает запрос к API Poster при помощи токена и аккаунта
     * @param method {String} poster API method name
     * @param type {String} GET or POST
     * @param params {Object} GET or POST params to method
     * @return {Promise<*>}
     */
    makePosterRequest(method, type, params = {}) {
        let options = {
            method: type.toUpperCase(),
            url: `https://${this.account}.joinposter.com/api/${method}?token=${this.token}&`,
        };

        if (options.method === 'GET') {
            options.url += querystring.encode(params);
        } else {
            options.json = params.body;
        }

        return new Promise((resolve, reject) => {
            request(options, (err, response, body) => {
                if (err) {
                    reject(err);
                }

                if (typeof body === 'string') {
                    body = JSON.parse(body);
                }
                // В большинстве методов API Poster ответ приходит в объекте response
                if (body && body.response) {
                    body = body.response;
                }
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
        return this.makePosterRequest('settings.getAllSettings', 'GET');
    }

    setEntityExtras(entity, extras, entityId) {
        return this.makePosterRequest('application.setEntityExtras', 'POST', {
            body: {entity_type: entity, extras: extras, entity_id: entityId}
        });
    }
}


module.exports = PosterApi;