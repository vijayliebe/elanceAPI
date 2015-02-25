var rp = require('request-promise');
var async = require('asyncjs');

module.exports = {

    elanceJobCategory: function (categoryPayload, callback) {
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
    }
}