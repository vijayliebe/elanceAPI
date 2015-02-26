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
        var userID = req.param('userID');
        var type = req.param('type');

        var podioAccess = sails.config.globals.elancAppMainDataObj.getAccessToken(userID, "podio");
        var elanceAccess = sails.config.globals.elancAppMainDataObj.getAccessToken(userID, "elance");


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
        };

        switch (type) {
            case 'hook.verify' :
                verifyHook();
                break;

            case 'item.create' :
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

            //looping through job list
            _.each(projects, function (project) {

                var currentProject = project;
                //closer to pick current scope

                (function (project) {

                    //calling service to get online elance proposal list as per jobID
                    sails.services.elanceapi.elanceProposalById(project, function (err, _data) {
                        if (!err) {
                            console.log(_data);

                            var jobData = _data.data.jobData;
                            var joProposalData = _data.data.proposals;

                            var formattedProposal;

                            //list of proposals saved in local DB
                            Proposals.find({user_id: userID}).exec(function (err, proposals) {
                                if (!err) {

                                    //re-formatting proposal data
                                    _.each(proposals, function (proposal) {
                                        formattedProposal[proposal.bidId] = bidId;
                                    });

                                    //comparing wheather exist in local DB then publish on podio
                                    _.each(joProposalData, function (elanceProposal) {
                                        if (!_.has(formattedProposal, elanceProposal.bidId)) {

                                            (function (elanceProposal) {
                                                sails.services.podioapi.podioSaveProposalItem(currentProject, jobData, elanceProposal, function (err, data) {
                                                    if (!err) {

                                                        console.log(data);

                                                        //If - podio proposal item - success - > save that proposal in local DB
                                                        elanceProposal.user_id = userID;
                                                        elanceProposal.jobData = jobData;

                                                        Proposals.create(elanceProposal).exec(function (err, proj) {
                                                            if (!err) {
                                                                console.log('Saving Proposal success');
                                                            } else {
                                                                console.log('Saving Proposal Failed');
                                                            }
                                                        });

                                                    }
                                                });
                                            }(elanceProposal));

                                        }
                                    });
                                }
                            });
                        }
                    });

                }(project));


            });

        });


    }
};

