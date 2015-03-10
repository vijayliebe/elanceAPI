/**
 * MessagesController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var pollingtoevent = require("polling-to-event");
var rp = require('request-promise');

module.exports = {
    getElanceMessages: function (userID, res) {
        var userID = userID;

        emitter = pollingtoevent(function (done) {

            Proposals.proposalByUserId(userID, function (err, proposals) {
                if (!err) {
                    done(err, proposals);
                } else {
                    console.log(err);
                }
            });


        }, {
            longpolling: true,
            interval: 1000 * 60 * 30
        });

        emitter.on("longpoll", function (proposals) {
            User.getUserById(userID, function (err, user) {
                if (!err) {
                    var elanceAccess = user[0].elanceAuth.access_token;
                    var podioAccess = user[0].podioAuth.access_token;


                    _.each(proposals, function (proposal) {

                        var currentProposal = proposal;
                        //closer to pick current scope

                        (function (proposal) {

                            //calling service to get online elance proposal list as per jobID
                            elanceAPI.elanceWorkRoomMessaageByBidId(elanceAccess, proposal.bidId, function (err, _data) {
                                if (!err) {
                                    console.log(_data);

                                    var messageData = _data.data.messages;
                                    var joProposalData = _data.data.bidDetails;

                                    var formattedMessages = {};

                                    //list of proposals saved in local DB
                                    Messages.getAllMessages(userID, function (err, messages) {
                                        if (!err) {
                                            //re-formatting proposal data
                                            _.each(messages, function (message) {
                                                formattedMessages[message.messageId] = message;
                                            });

                                            //comparing wheather exist in local DB then publish on podio
                                            _.each(messageData, function (elanceMessage) {

                                                if (!_.has(formattedMessages, elanceMessage.messageId)) {

                                                    (function (elanceMessage) {
                                                        var reqMessage = currentProposal.clientUserId == elanceMessage.userId ? elanceMessage.text : '*' + elanceMessage.text;

                                                        podioAPI.postPodioItemComments(podioAccess, reqMessage, currentProposal.item_id, function (err, data) {
                                                            if (!err) {

                                                                console.log(data);

                                                                //If - podio proposal item - success - > save that proposal in local DB
                                                                elanceMessage.user_id = userID;
                                                                elanceMessage.bidDetails = joProposalData;
                                                                elanceMessage.comment_id = data.comment_id;
                                                                elanceMessage.ref = data.ref;

                                                                Messages.create(elanceMessage).exec(function (err, proj) {
                                                                    if (!err) {
                                                                        console.log('Saving Proposal comment success');
                                                                    } else {
                                                                        console.log('Saving Proposal comment Failed');
                                                                    }
                                                                });

                                                            } else {
                                                                console.log('Proposal sync - podio proposal post - failed');
                                                                if (err.error_description == "expired_token") {
                                                                    podioAPI.podioRefreshToken(userID, function (err, refreshedToken) {
                                                                        if (!err) {
                                                                            MessagesController.getElanceMessages(userID);
                                                                        } else {
                                                                            console.log(err);
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    }(elanceMessage));

                                                }
                                            });
                                        }
                                    });
                                } else {
                                    console.log('Proposal sync - elance proposal fetch - failed');

                                    if (err.errors[0].code == "invalid_token_expired") {
                                        elanceAPI.elanceRefreshAccess(userID, function (err, refreshedToken) {
                                            if (!err) {
                                                MessagesController.getElanceMessages(userID);
                                            } else {
                                                console.log(err);
                                            }
                                        });
                                    }

                                }
                            });

                        }(proposal));


                    });
                } else {
                    console.log('MessageController -> getElanceMessages -> Failed ');
                }
            });
        });


    },

    elanceProposalCreateComment: function (req, res) {

        var userId = parseInt(req.param('userID'));
        var type = req.param('type');

        var verifyHook = function () {
            console.log('verifying hook');
            console.log(req.params.all());

            rp({
                uri: "https://api.podio.com/hook/" + req.param('hook_id') + "/verify/validate",
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json"
                },
                body: { "code": req.param('code') }

            }).then(function (body) {
                console.log(body);
            })
                .catch(function (error) {
                    console.log(error);
                });
        };

        var useVerifiedHook = function () {
            console.log('using verified hook');
            console.log(req.params.all());

            var item_id = parseInt(req.param('item_id'));

            User.getUserById(userId, function (err, user) {
                if (!err) {
                    var elanceAccess = user[0].elanceAuth.access_token;
                    var podioAccess = user[0].podioAuth.access_token;

                    Proposals.proposalByUserItemId(userId, item_id, function (err, proposalItem) {
                        if (!err) {
                            var currentProposal = proposalItem;
                            podioAPI.getPodioItemComments(podioAccess, item_id, function (err, podioProposalComments) {
                                if (!err) {
                                    var podioProposalComments = podioProposalComments;
                                    var formattedMessages = {};

                                    //list of messages saved in local DB
                                    Messages.getAllMessages(userId, function (err, messages) {
                                        if (!err) {
                                            //re-formatting proposal data
                                            _.each(messages, function (message) {
                                                formattedMessages[messages.comment_id] = messages;
                                            });

                                            //comparing wheather exist in local DB then publish on podio
                                            _.each(podioProposalComments, function (podioProposalComment) {

                                                if (!_.has(formattedMessages, podioProposalComment.comment_id)) {

                                                    (function (podioProposalComment) {
                                                        var reqMessage = podioProposalComment.value;

                                                        elanceAPI.elancePostWorkRoomMessaageByBidId(elanceAccess, currentProposal[0].bidId, reqMessage, function (err, data) {
                                                            if (!err) {

                                                                console.log(data);
                                                                var _data = data;
                                                                var elanceMessage = {};

                                                                elanceMessage.messageId = _data.data.messageId;
                                                                elanceMessage.text = reqMessage;
                                                                elanceMessage.userId = currentProposal[0].clientUserId;


                                                                elanceMessage.user_id = userId;
                                                                elanceMessage.bidDetails = currentProposal[0];
                                                                elanceMessage.comment_id = podioProposalComment.comment_id;
                                                                elanceMessage.ref = podioProposalComment.ref;

                                                                Messages.create(elanceMessage).exec(function (err, proj) {
                                                                    if (!err) {
                                                                        console.log('Saving Proposal comment success');
                                                                    } else {
                                                                        console.log('Saving Proposal comment Failed');
                                                                    }
                                                                });

                                                            } else {
                                                                console.log('Proposal sync - podio proposal post - failed');
                                                                if(err.errors[0].code == "invalid_token_expired"){
                                                                    elanceAPI.elanceRefreshAccess(userId,function(err, refreshedToken){
                                                                        if(!err){
                                                                            useVerifiedHook();
                                                                        }else{
                                                                            console.log(err);
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    }(podioProposalComment));

                                                }
                                            });
                                        }
                                    });


                                } else {
                                    console.log('Getting podio proposal item - Failed');

                                    if (err.error_description == "expired_token") {
                                        podioAPI.podioRefreshToken(userId, function (err, refreshedToken) {
                                            if (!err) {
                                                useVerifiedHook();
                                            } else {
                                                console.log(err);
                                            }
                                        });
                                    }

                                }
                            });

                        } else {
                            console.log('MessageController -> elanceProposalCreateComment -> proposalByUserItemId -> Failed');
                        }

                    });

                } else {
                    console.log('MessageController -> elanceProposalCreateComment -> Failed ');

                }

            });


        };

        switch (type) {
            case 'hook.verify' :
                verifyHook();
                break;

            case 'comment.create' :
                useVerifiedHook();
                break;

            default :
                return;
        }
    }
};

