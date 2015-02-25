var pollingtoevent = require("polling-to-event");
var rp = require('request-promise');

var getPostProposals = function (proj) {
    var item_id = proj.item_id;
    var url = "https://api.elance.com/api2/jobs/" + proj.jobId + "/proposals?access_token=" + sails.config.globals.elancAppMainDataObj.tokenDataElance.access_token;

    emitter = pollingtoevent(function (done) {
        rp.get(url, function (err, req, data) {
           done(err, data);
        });
    }, {
        longpolling: true,
        interval: 1000 * 60 * 60
    });

    emitter.on("longpoll", function (data) {
        console.log("longpoll emitted at %s, with data %j", Date.now());
        var _data = JSON.parse(data);
        if (_data.error) return;

        var jobData = _data.data.jobData;
        var joProposalData = _data.data.proposals;
        var flag;


        var afterProposalItemSaved = function (joProposalsData) {
            return function (error, response, body) {
                //var proposaldata = JSON.parse(body);
                console.log(body);

                if (!body.error) {

                    sails.models.proposals.create(joProposalsData).exec(function (err, proj) {
                        if (!err) {
                            console.log('Saving Proposal success');
                            processFlag = flag;

                        } else {
                            console.log('Saving Proposal Failed');
                        }
                    });
                } else {
                    processFlag = flag;
                }


            }
        };

        //call podio API to save proposal ITEM in proposal App
        var saveProposalItem = function (joProposalsData) {
            request({
                uri: "https://api.podio.com/item/app/" + sails.config.globals.podioAppIds.proposal + "?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json"
                },
                body: {
                    "fields": {
                        "title": jobData.name,
                        "va-name": joProposalsData.providerName,
                        "status": [],
                        "text-2": "TESTING",
                        "proposal-amount": "220",
                        "delivery-timeframe": "TESTING",
                        "rate": joProposalsData.hourlyRate,
                        "jobs-started-in-the-last-12-months": "TESTING",
                        "text-3": "TESTING",
                        "earnings-from-the-last-12-months": "TESTING",
                        "average-job-rating": "TESTING",
                        "job": [
                            {
                                "value": item_id
                            }
                        ],
                        "va-team": []
                    },
                    "file_ids": [],
                    "tags": []
                }

            }, afterProposalItemSaved(joProposalsData));
        };

//        Proposals.find().exec(function (err, proposals) {
//            if (!err) {
//                var proposalsFormatted = {};
//
//                _.each(proposals, function (proposal) {
//                    proposalsFormatted[proposal.bidId] = proposal;
//                });
//
//                _.each(joProposalData, function (proposal) {
//                    if (!_.has(proposalsFormatted, proposal.bidId)) {
//                        // create a new category in db
//
//                        (function (proposal) {
//                            sails.services.podioapi.podioCreateProposal(proposal);
//                        }(proposal));
//
//                    }
//                });
//            }
//        });


        sails.models.proposals.find().exec(function (err, proj) {
            if (!err) {
                var itemInsert = false;

                for (var x = 0; x < joProposalData.length; x++) {
                    //when item is more than 1 -> emitter will get triggered only when entire process is completed
                    if(x < joProposalData.length -1){
                        flag = false;
                    }else{
                        flag = true;
                    }

                    //if local DB does not contain any item to compare with proposals got from Elance
                    if(proj.length != 0){

                        for (var y = 0; y < proj.length; y++) {
                            if (proj[y].bidId != joProposalData[x].bidId) {
                                itemInsert = true;
                                var SaveProposalItem =  new saveProposalItem(joProposalData[x]);
                            }
                        }
                    }else{
                        itemInsert = true;
                        var SaveProposalItem =  new saveProposalItem(joProposalData[x]);
                    }
                }

                //item is greater than 1 but all of them already exist
                if(!itemInsert) {
                    flag = true;
                    processFlag = flag;
                }

            } else {
                console.log('Saving Proposal Failed');
            }
        });


    });
}

module.exports = {

    elanceProposals: function () {
        var jobList = sails.models.project.find().exec(function (err, proj) {
            if (err) {
                console.log('Failed');
            } else {

                for (var i = 0; i < proj.length; i++) {
                    var GetPostProposals = new getPostProposals(proj[i]);
                }

            } //else end
        });


    }
}