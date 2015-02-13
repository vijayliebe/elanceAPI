/**
 * ProjectType.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

    },

    getProjectType: function (req, callback) {
        ProjectType.find().exec(function (err, proj) {
            if (!err) {
                return callback(null, proj);

            } else {
                return callback(err, {"status": "failed"});
            }
        });
    },

    saveProjectType: function (req, callback) {
        ProjectType.create(req).exec(function (err, proj) {
            if (!err) {
                return callback(null, proj);

            } else {
                return callback(err, {"status": "failed"});
            }
        });
    }
};

