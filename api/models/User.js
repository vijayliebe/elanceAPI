/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

      attributes: {

      },

    getToken : function(req, callback){
        User.find().exec(function (err, token) {
            if (!err) {
                return callback(null, token);

            } else {
                return callback(err, {"status": "failed"});
            }
        });
    },

    saveToken : function(tokenObj, callback){

        User.destroy({tokenName : tokenObj.tokenName}).exec(function (errror, tokens) {
            if (!errror) {
                User.create(tokenObj).exec(function (err, token) {
                    if (!err) {
                        return callback(null, token);

                    } else {
                        return callback(err, {"status": "failed"});
                    }
                });
            } else {
                return callback(err, {"status": "failed"});
            }
        });


    }
};

