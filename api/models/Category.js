/**
* Category.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  },

    categorylist : function(req, callback){
        Category.find().exec(function (err, category) {
            if (!err) {
                return callback(null, category);
            } else {
                return callback(err, {"status": "failed"});
            }
        });
    },

    categorylistbyUser : function(userID, callback){
        var userID = userID;
        Category.find({user_id : userID}).exec(function (err, category) {
            if (!err) {
                return callback(null, category);
            } else {
                return callback(err, {"status": "failed"});
            }
        });
    },

    savecategory : function(req, callback){
        Category.create(req).exec(function (err, category) {
            if (!err) {
                return callback(null, category);
            } else {
                return callback(err, {"status": "failed"});
            }
        });
    }
};

