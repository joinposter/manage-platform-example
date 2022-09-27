'use strict';

var express = require('express');
var router = new express.Router();
var PosterApi = require('../api/poster');


router.get('/:code', async function (req, res) {
    let {code} = req.params.code;
    let user = await PosterApi.auth(code);
    let auth = {
        token: user.access_token,
        account: user.account_name,
    };

    let posterApi = new PosterApi(auth);
    let settings = await posterApi.getAllSettings();

    res.render('index', {
        token: auth.token,
        account: auth.account,
        emoji: settings.extras ? settings.extras.emoji : null,
    })
});

router.post('/save-emoji', async function (req, res, next) {
    let {body} = req;

    let posterApi = new PosterApi({account: body.account, token: body.token});
    let result = await posterApi.setEntityExtras('settings', {emoji: body.emoji});

    res.render('index', body);
});


module.exports = router;