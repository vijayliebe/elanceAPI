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

    elanceProposalById : function (project, callback) {
       var  jobId = project.jobId
        rp({
            uri:  "https://api.elance.com/api2/jobs/" + jobId + "/proposals?access_token=" + sails.config.globals.elancAppMainDataObj.tokenDataElance.access_token,
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

    elanceAwardProposal : function(elanceAccess, bidid, callback){
        rp.post({
            url: 'https://api.elance.com/api2/projects/bids/'+bidid+'/terms?access_token=' + elanceAccess
        }).then(function(body){
            var _data = JSON.parse(body);
            return callback(null, _data);
        })
            .catch(function(error){
                console.log(error);
            });
    }
}