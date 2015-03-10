/**
* Proposals.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  },

    proposalByUserId : function(userId, callback){
        var userId = userId;
        var item_id = item_id;

        Proposals.find({user_id : userId}).exec(function(err, proposal){
            if(!err){
                return callback(null, proposal);
            }else{
                return callback(err, {"status" : "Failed"});
            }
        });
    },


    proposalByUserItemId : function(userId, item_id, callback){
        var userId = userId;
        var item_id = item_id;

        Proposals.find({user_id : userId, item_id : item_id}).exec(function(err, proposal){
            if(!err){
                return callback(null, proposal);
            }else{
                return callback(err, {"status" : "Failed"});
            }
        });
    },

    updateProposalByBidId : function(userId, bidId,data, callback){
        var userId = userId, bidId = bidId;

        Proposals.update({user_id : userId, bidId : bidId}, data, function(err, proposal){
            if(!err){
                return callback(null, proposal);
            }else{
                return callback(err, {"status" : "Failed"});
            }
        });
    }
};

