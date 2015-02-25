/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var elancAppMainDataObj = elancAppMainDataObj;
var request = require("request");
var rp = require('request-promise');
var podioAuth, elanceAuth, userInfo;

module.exports = {
    signup: function (req, res) {

        res.send('Yup!! Controlller is working :) ')
    },

    elanceLogin :function(req, res){
        res.redirect('https://api.elance.com/api2/oauth/authorize?client_id='+sails.config.globals.elancAppMainDataObj.client_id_elance+'&redirect_uri='+sails.config.globals.elancAppMainDataObj.webredirecrUrlElance+'&scope=basicInfo&response_type=code');

        //testing request-promise code start

        /*rp('http://www.google.com', 'http://www.facebook.com', 'http://www.twitter.com')
            .then(function(b1, b2, b3){
                console.log('Google data=====>'+b1);
                console.log('==================================================================================================================');
                console.log('FB data======>'+b2);
                console.log('==================================================================================================================');
                console.log('Twitter data====>'+b3);
            })
            .catch(console.error);*/

        //testing request-promise code end
    },

    podiologin :function(req, res){
        //res.redirect('https://podio.com/oauth/authorize?response_type=token&client_id=elanceapi&redirect_uri='+sails.config.globals.elancAppMainDataObj.localredirecrUrl2);
        res.redirect('https://podio.com/oauth/authorize?client_id='+sails.config.globals.elancAppMainDataObj.client_id_podio+'&redirect_uri='+sails.config.globals.elancAppMainDataObj.webredirecrUrlPodio);
    },

    podioauth : function(req, res){
            console.log(req.param('code'));


        rp({
            uri: "https://podio.com/oauth/token?grant_type=authorization_code&client_id="+sails.config.globals.elancAppMainDataObj.client_id_podio+"&redirect_uri="+sails.config.globals.elancAppMainDataObj.webredirecrUrlPodio+"&client_secret="+sails.config.globals.elancAppMainDataObj.client_secret_podio+"&code="+req.param('code'),
            method: "POST"
        }).then(function (body) {

            var Tokendata = JSON.parse(body);
            Tokendata.tokenName = "podio";
            console.log(Tokendata);
            sails.config.globals.elancAppMainDataObj.tokenDataPodio = Tokendata;
            podioAuth = Tokendata;

            rp('https://api.podio.com/user/profile?oauth_token=' + Tokendata.access_token)
                .then(function (body) {
                    var _data = JSON.parse(body);
                    userInfo = _data;

                    sails.config.globals.elancAppMainDataObj.userInfo = userInfo;

                    var reqUserData = {};
                    reqUserData.userInfo = userInfo;
                    reqUserData.elanceAuth = elanceAuth;
                    reqUserData.podioAuth = podioAuth;

                    return User.saveUser(reqUserData, function (err, users) {
                        if (err) {
                            res.forbidden();
                        } else {
                            res.json(users);
                            sails.config.globals.elancAppMainDataObj.userData = users;
                            res.redirect('/podioWorkSpace');
                            //sails.controllers.proposals.getElanceProposals();
                            //sails.controllers.category.getElanceCategory();
                            //sails.controllers.subcategory.getElanceSubCategory();
                        }
                    });

                })
                .catch(function (error) {
                    console.log(error);
                });



        })
            .catch(function(error){
                console.log(error);
            });




    },


    podioauthrefresh : function(req, res) {
        //https://podio.com/oauth/token?grant_type=refresh_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&refresh_token=REFRESH_TOKEN

        request({
            //uri: "https://api.podio.com/item/"+req.param('item_id')+"?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
            uri: "https://podio.com/oauth/token?grant_type=refresh_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&refresh_token=REFRESH_TOKEN",
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function (error, response, body) {
            var data = JSON.parse(body);



        });

    },

    getAuthcode : function(req, res){
        var https = require('https');
        var querystring = require('querystring');

        var data = querystring.stringify({
            code: req.param('code'),
            client_id: sails.config.globals.elancAppMainDataObj.client_id_elance,
            client_secret: sails.config.globals.elancAppMainDataObj.client_secret_elance,
            redirect_uri: sails.config.globals.elancAppMainDataObj.webredirecrUrlElance,
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
                Tokendata.tokenName = "elance";
                console.log(Tokendata);
                sails.config.globals.elancAppMainDataObj.tokenDataElance = Tokendata;
                elanceAuth = Tokendata;
                res.redirect('/podiologin');
//                return User.saveToken(Tokendata, function (err, token) {
//                    if (err) {
//                        res.forbidden();
//                    } else {
//                        res.json(token);
//                        //res.redirect('/project');
//                        res.redirect('/podiologin');
//                    }
//                });

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
    },

    elancePodioConfig : function(req, res){
        res.view('project', {partialTemp: "configPage"});
    }
};

