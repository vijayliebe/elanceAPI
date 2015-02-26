/**
 * Application.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

    },

    applicationList: function (data, callback) {

        Application.find().exec(function (err, apps) {
            if (!err) {
                return callback(null, apps)
            } else {
                return callback(err, {"status": "failed"});
            }
        });

    },

    applicationListByuser: function (data, callback) {
        var userID = data.userID;

        Application.find({user_id: userID}).exec(function (err, apps) {
            if (!err) {
                return callback(null, apps)
            } else {
                return callback(err, {"status": "failed"});
            }
        });

    },

    saveApplication: function (data, callback) {

        Application.create(data).exec(function (err, apps) {
            if (!err) {
                return callback(null, apps)
            } else {
                return callback(err, {"status": "failed"});
            }
        });

    }

};

