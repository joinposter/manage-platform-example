'use strict';

var express = require('express');
var router = new express.Router();
var PosterApi = require('../api/poster');


router.get('/', async function (req, res) {
    let {code} = req.query;
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

router.post('/save-emoji', function (req, res, next) {
    let {body} = req;

});


module.exports = router;