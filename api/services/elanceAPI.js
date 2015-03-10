var rp = require('request-promise');
var async = require('asyncjs');

module.exports = {

    elanceJobCategory: function (data, callback) {
        rp({
            uri: "https://api.elance.com/api2/categories?access_token=" + sails.config.globals.elancAppMainDataObj.tokenDataElance.access_token,
            method: "GET"
        })
            .then(function (body) {
                var _data = JSON.parse(body);
                return callback(null, _data);
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    elanceProposalById: function (elanceAccess, project, callback) {
        var jobId = project.jobId
        rp({
            uri: "https://api.elance.com/api2/jobs/" + jobId + "/proposals?access_token=" + elanceAccess,
            method: "GET"
        })
            .then(function (body) {
                var _data = JSON.parse(body);
                return callback(null, _data);
            })
            .catch(function (error) {
                console.log(error);
                var _error = JSON.parse(error.response.body);
                return callback(_error, {"status" : "Failed"});
            });
    },

    elanceAwardProposal: function (elanceAccess, bidid, callback) {
        rp.post({
            url: 'https://api.elance.com/api2/projects/bids/' + bidid + '/terms?access_token=' + elanceAccess
        }).then(function (body) {
            var _data = JSON.parse(body);
            return callback(null, _data);
        })
            .catch(function (error) {
                console.log(error);
                var _error = JSON.parse(error.response.body);
                return callback(_error, {"status" : "Failed"});
            });
    },

    elanceJobPost: function (elanceAccess, jobPostPayLoad, callback) {
        rp.post({
            url: 'https://api.elance.com/api2/projects/jobs?access_token=' + elanceAccess,
            form: jobPostPayLoad
        }).then(function (body) {
            var _data = JSON.parse(body);
            return callback(null, _data);
        })
            .catch(function (error) {
                var _error = JSON.parse(error.response.body);
                return callback(_error, {"status" : "Failed"});
            });
    },

    elanceRefreshAccess: function (userID, callback) {
        User.getUserById(userID, function (err, user) {
            if (!err) {
                var userData = user;
                var elanceAccess = user[0].elanceAuth.access_token;
                var elanceRefreshToken = user[0].elanceAuth.refresh_token;


                rp.post({
                    url: 'https://api.elance.com/api2/oauth/token?access_token=' + elanceAccess,
                    form: {
                        client_id: sails.config.globals.elancAppMainDataObj.client_id_elance,
                        client_secret: sails.config.globals.elancAppMainDataObj.client_secret_elance,
                        grant_type: "refresh_token",
                        refresh_token: elanceRefreshToken
                    }
                })
                    .then(function (body) {
                    var _data = JSON.parse(body);
                    _data.tokenName = "elance";
                    //return callback(null, _data);
                    userData[0].elanceAuth = _data.data;

                        var _userData = {};
                        _userData.userInfo = userData[0].userInfo;
                        _userData.elanceAuth = userData[0].elanceAuth;
                        _userData.podioAuth = userData[0].podioAuth;

                        User.saveUser(_userData,function(err, users){
                            if(!err){
                                sails.config.globals.elancAppMainDataObj.userData = users;
                                return callback(null, users);
                            }else{
                                console.log('elanceAPI -> RefreshToken -> saveChangedUserInfo - Failed');
                                return callback(err, {"status" : "Failed"});
                            }
                        });

                })
                    .catch(function (error) {
                        console.log(error);
                    });


            } else {
                console.log('elanceAPI - > elanceRefreshAccess -> failed');
            }
        });


    },

    elanceWorkRoomMessaageByBidId: function (elanceAccess, bidId, callback) {
        rp({
            uri: "https://api.elance.com/api2/workroom/"+bidId+"/messages?access_token=" + elanceAccess,
            method: "GET"
        })
            .then(function (body) {
                var _data = JSON.parse(body);
                return callback(null, _data);
            })
            .catch(function (error) {
                console.log(error);
                var _error = JSON.parse(error.response.body);
                return callback(_error, {"status" : "Failed"});
            });
    },

    elancePostWorkRoomMessaageByBidId: function (elanceAccess, bidId, message, callback) {
        rp.post({
            url: 'https://api.elance.com/api2/workroom/'+bidId+'/messages?access_token=' + elanceAccess,
            form: {
                comments : message
            }
        }).then(function (body) {
            var _data = JSON.parse(body);
            return callback(null, _data);
        })
            .catch(function (error) {
                var _error = JSON.parse(error.response.body);
                return callback(_error, {"status" : "Failed"});
            });
    }

}