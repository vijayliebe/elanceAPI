/**
* Subcategory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  },

    subcategorylist : function(req, callback){
        Subcategory.find().exec(function (err, category) {
            if (!err) {
                return callback(null, category);
            } else {
                return callback(err, {"status": "failed"});
            }
        });
    },

    subcategorylistbyUser : function(userID, callback){
        var userID = userID;
        Subcategory.find({user_id : userID}).exec(function (err, category) {
            if (!err) {
                return callback(null, category);
            } else {
                return callback(err, {"status": "failed"});
            }
        });
    },

    savesubcategory : function(req, callback){
        Subcategory.create(req).exec(function (err, category) {
            if (!err) {
                return callback(null, category);
            } else {
                return callback(err, {"status": "failed"});
            }
        });
    }
};

