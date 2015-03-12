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
var OAuth = require('oauth');
var util     = require('util');
var oauth_token_old, tokenSecret;

module.exports = {
    signup: function (req, res) {

        res.send('Yup!! Controlller is working :) ')
    },

    elanceLogin :function(req, res){
        res.redirect('https://api.elance.com/api2/oauth/authorize?client_id='+sails.config.globals.elancAppMainDataObj.client_id_elance+'&redirect_uri='+sails.config.globals.elancAppMainDataObj.webredirecrUrlElance+'&scope=basicInfo&response_type=code');
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
                    var userInfo = _data;

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
                            //sails.controllers.proposals.getElanceProposals(userInfo.user_id);
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
    },

    xeroLogin : function(req, res){
        var oauth = new OAuth.OAuth(
            'https://api.xero.com/oauth/RequestToken',
            'https://api.xero.com/oauth/AccessToken',
            'XNR1HUZFKG9WAAMSCCXGNZALAI62NF',
            'CP0PKUFHCLJGCDYGGNTRDRXBB4CZYN',
            '1.0A',
             null,
            'HMAC-SHA1'
        );


        oauth.getOAuthRequestToken({'oauth_callback': 'http://25b56dfd.ngrok.com/backxero'}, function(error, oauth_token, oauth_token_secret, results){
            if(error) util.puts('error :' + error)
            else {
                oauth_token_old = oauth_token;
                tokenSecret = oauth_token_secret;

                util.puts('oauth_token :' + oauth_token)

                req.session.oauth_token_secret = oauth_token_secret;
                util.puts('oauth_token_secret :' + oauth_token_secret)
                util.puts('requestoken results :' + util.inspect(results))
                util.puts("Requesting access token")

                res.redirect('https://api.xero.com/oauth/Authorize?oauth_token='+oauth_token);


            }
        })
    },

    backxero : function(req,res){
        console.log(req.params.all());

        res.send('Auth. successfull');
        var oauth_token_secret = tokenSecret;
        var oauth_token = req.param('oauth_token');
        var oauth_verifier = req.param('oauth_verifier');
        var org = req.param('org');

        var oauth = new OAuth.OAuth(
            'https://api.xero.com/oauth/RequestToken',
            'https://api.xero.com/oauth/AccessToken',
            'XNR1HUZFKG9WAAMSCCXGNZALAI62NF',
            'CP0PKUFHCLJGCDYGGNTRDRXBB4CZYN',
            '1.0A',
            null,
            'HMAC-SHA1'
        );

                    oauth.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier,function(error, oauth_access_token, oauth_access_token_secret, results2) {
                        console.dir(error);
                        console.log(error)
                        util.puts('error :'+error)
                        util.puts('oauth_access_token :' + oauth_access_token)
                        util.puts('oauth_token_secret :' + oauth_access_token_secret)
                        util.puts('accesstoken results :' + util.inspect(results2))
                        util.puts("Requesting access token")
                        var data = "";
                   oauth.getProtectedResource("https://api.xero.com/api.xro/2.0/Organisation",
                                                "GET",
                                                "application/json",
                                                oauth_access_token,
                                                oauth_access_token_secret,  function (error, data, response) {
                        util.puts(data);
                    });
                });
    }
};

