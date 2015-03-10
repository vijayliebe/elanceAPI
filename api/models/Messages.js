/**
* Messages.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/



module.exports = {

  attributes: {

  },

    getAllMessages : function(userId, callback){
        var userID = userId;
        Messages.find({user_id: userID}).exec(function (err, message) {
            if (!err) {
                return callback(null, message);
            } else {
                return callback(err, {"status":"Failed"});
            }
        });

    }


};

