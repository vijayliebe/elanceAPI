/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var elancAppMainDataObj = elancAppMainDataObj

module.exports = {
    signup: function (req, res) {

        res.send('Yup!! Controlller is working :) ')
    },

    elanceLogin :function(req, res){
        res.redirect('https://api.elance.com/api2/oauth/authorize?client_id=54db1119e4b0ce56b5a32eb8&redirect_uri=http://54.88.90.102/back&scope=basicInfo&response_type=code');
    },

    getAuthcode : function(req, res){
        var https = require('https');
        var querystring = require('querystring');

        var data = querystring.stringify({
            code: req.param('code'),
            client_id: '54db1119e4b0ce56b5a32eb8',
            client_secret: '3zINaEeIe4K9OPMZTNol0A',
            redirect_uri: 'http://localhost:1337/back2',
            grant_type: 'authorization_code'
        });

        var options = {
            host: 'api.elance.com',
            path: '/api2/oauth/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        var https_req = https.request(options, function(httpsres) {
            httpsres.setEncoding('utf8');
            httpsres.on('data', function (chunk) {
                var chunkData = JSON.parse(chunk);
                var Tokendata = chunkData.data;
                console.log(Tokendata);
                sails.config.globals.elancAppMainDataObj.tokenData = [];
                sails.config.globals.elancAppMainDataObj.tokenData.push(Tokendata);
                return User.saveToken(Tokendata, function (err, token) {
                    if (err) {
                        res.forbidden();
                    } else {
                        res.json(token);
                        res.redirect('/project');
                    }
                });

            });
        });

        https_req.write(data);
        https_req.end();

    },

    getTokens : function(req, res){
        return User.getToken(req.body, function (err, token) {
            if (err) {
                res.forbidden();
            } else {
                res.json(token);
                //res.view('layout', {message: 'Login failed!', partial: 'layoutPartial'});
            }
        });
    }
};

