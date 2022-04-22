var express = require('express');
const { generateToken04 } = require('./server/zegoServerAssistant');

var PORT = process.env.PORT || 8080;

if (!(process.env.APP_ID && process.env.SERVER_SECRET)) {
    throw new Error('You must define an APP_ID and SERVER_SECRET');
}
var APP_ID = process.env.APP_ID;
var SERVER_SECRET = process.env.SERVER_SECRET;

var app = express();

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

var generateAccessToken = function (req, resp) {
    resp.header('Access-Control-Allow-Origin', "*")

    var expiredTs = req.query.expiredTs;
    if (!expiredTs) {
        expiredTs = 3600;
    }

    var uid = req.query.uid;
    if (!uid) {
        return resp.status(500).json({ 'error': 'user id is required' });
    }

    const token =  generateToken04(parseInt(APP_ID), uid, SERVER_SECRET, parseInt(expiredTs), '');
    return resp.json({ 'token': token });
};

app.get('/access_token', nocache, generateAccessToken);

app.listen(PORT, function () {
    console.log('Service URL http://127.0.0.1:' + PORT + "/");
    console.log('Token request, /access_token?uid=[user id]');
    console.log('Token with expiring time request, /access_token?uid=[user id]&expiredTs=[expire ts]');
});
