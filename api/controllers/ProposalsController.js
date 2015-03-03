/**
 * ProposalsController
 *
 * @description :: Server-side logic for managing proposals
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var pollingtoevent = require("polling-to-event");
var rp = require('request-promise');

module.exports = {
    getProposal: function (req, res) {

//        return proposals.getElanceProposals(req.body, function (err, proj) {
//            if (err) {
//                res.forbidden();
//                //res.send(err);
//            } else {
//                //res.json(proj);
//                res.view('project', {partialTemp: "projectPartial", projectsTypes: [], projects: proj});
//            }
//        });
    },

    elanceProposalUpdate: function (req, res) {
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

            User.getUserById(userId, function(err, user){
                if(!err){
                    var elanceAccess = user[0].elanceAuth.access_token;
                    var podioAccess = user[0].podioAuth.access_token;


                    podioAPI.podioGetItemById(podioAccess,item_id, function(err, podioProposal){
                        if(!err){
                            var podioProposal = podioProposal;
                            var podioProposalFields = podioProposal.fields
                            var formattedPodioProposalFields = {};
                            var status; //may be Received, Awarded or Awarded and Allow another
                            _.each(podioProposalFields, function(podioProposalField){
                                formattedPodioProposalFields[podioProposalField.label] = podioProposalField;
                            });

                            status = formattedPodioProposalFields.Status ? formattedPodioProposalFields.Status.values[0].value.text : null;

                            if(status != "Awarded") return false;

                            Proposals.proposalByUserItemId(userId, item_id, function(err, proposalItem){
                                if(!err){
                                    var proposalItem = proposalItem;
                                    var bid_id = proposalItem[0].bidId;

                                    elanceAPI.elanceAwardProposal(elanceAccess, bid_id, function(err, awardedProposal){
                                        if(!err){
                                            var bidId = awardedProposal.data.bidId;
                                            proposalItem[0].status = "Awarded"; // updating proposal data

                                            delete proposalItem[0].id;
                                            delete proposalItem[0].updatedAt;
                                            delete proposalItem[0].createdAt;

                                            Proposals.updateProposalByBidId(userId,bidId,proposalItem[0], function(err, proposal){
                                                if(!err){
                                                    console.log('Update proposal successful');
                                                }else{
                                                    console.log('Update proposal Failed');
                                                }
                                            });

                                        }else{
                                            console.log('Awarding Proposal Failed');

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

                                }else{
                                    console.log(err);
                                }
                            });


                        }else{
                            console.log('Getting podio proposal item - Failed');

                            if(err.error_description == "expired_token"){
                                podioAPI.podioRefreshToken(userId,function(err, refreshedToken){
                                    if(!err){
                                        useVerifiedHook();
                                    }else{
                                        console.log(err);
                                    }
                                });
                            }

                        }
                    });



                }else{
                    console.log('proposalController -> useVerifiedHook -> Failed ');
                }
            });


        };

        switch (type) {
            case 'hook.verify' :
                verifyHook();
                break;

            case 'item.update' :
                useVerifiedHook();
                break;

            default :
                return;
        }
    },

    getElanceProposals: function (userID, res) {
        // proposalsService.elanceProposals();
        var userID = userID;

        emitter = pollingtoevent(function (done) {
            Project.find({user_id: userID}).exec(function (err, projects) {
            //   Project.find().exec(function (err, projects) {
                if (err) {
                    console.log('Failed');
                } else {
                    done(err, projects);
                }
            });

        }, {
            longpolling: true,
            interval: 1000 * 60 * 60
        });


        emitter.on("longpoll", function (projects) {

            User.getUserById(userID, function (err, user) {
                if (!err) {
                    var elanceAccess = user[0].elanceAuth.access_token;
                    var podioAccess = user[0].podioAuth.access_token;


                    _.each(projects, function (project) {

                        var currentProject = project;
                        //closer to pick current scope

                        (function (project) {

                            //calling service to get online elance proposal list as per jobID
                            elanceAPI.elanceProposalById(elanceAccess,project, function (err, _data) {
                                if (!err) {
                                    console.log(_data);

                                    var jobData = _data.data.jobData;
                                    var joProposalData = _data.data.proposals;

                                    var formattedProposal = {};

                                    //list of proposals saved in local DB
                                    Proposals.find({user_id: userID}).exec(function (err, proposals) {
                                        if (!err) {
                                            //re-formatting proposal data
                                            _.each(proposals, function (proposal) {
                                                formattedProposal[proposal.bidId] = proposal;
                                            });

                                            //comparing wheather exist in local DB then publish on podio
                                            _.each(joProposalData, function (elanceProposal) {
                                                if (!_.has(formattedProposal, elanceProposal.bidId)) {

                                                    (function (elanceProposal) {
                                                        podioAPI.podioSaveProposalItem(userID, podioAccess, currentProject, jobData, elanceProposal, function (err, data) {
                                                            if (!err) {

                                                                console.log(data);

                                                                //If - podio proposal item - success - > save that proposal in local DB
                                                                elanceProposal.user_id = userID;
                                                                elanceProposal.jobData = jobData;
                                                                elanceProposal.item_id = data.presence.ref_id;

                                                                Proposals.create(elanceProposal).exec(function (err, proj) {
                                                                    if (!err) {
                                                                        console.log('Saving Proposal success');
                                                                    } else {
                                                                        console.log('Saving Proposal Failed');
                                                                    }
                                                                });

                                                            }else{
                                                                console.log('Proposal sync - podio proposal post - failed');
                                                                if(err.error_description == "expired_token"){
                                                                    podioAPI.podioRefreshToken(userID,function(err, refreshedToken){
                                                                        if(!err){
                                                                            ProposalsController.getElanceProposals(userID);
                                                                        }else{
                                                                            console.log(err);
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    }(elanceProposal));

                                                }
                                            });
                                        }
                                    });
                                }else{
                                    console.log('Proposal sync - elance proposal fetch - failed');

                                    if(err.errors[0].code == "invalid_token_expired"){
                                        elanceAPI.elanceRefreshAccess(userID,function(err, refreshedToken){
                                            if(!err){
                                                ProposalsController.getElanceProposals(userID);
                                            }else{
                                                console.log(err);
                                            }
                                        });
                                    }

                                }
                            });

                        }(project));


                    });
                }else{
                    console.log('proposalController -> getElanceProposals -> Failed ');
                }
            });
            //looping through job list


        });


    }
};

