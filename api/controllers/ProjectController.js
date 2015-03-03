/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require("request");
var rp = require('request-promise');

module.exports = {
    getProject: function (req, res) {
        return Project.projectlist(req.body, function (err, proj) {
            if (err) {
                res.forbidden();
            } else {
                res.view('project', {partialTemp: "projectPartial", projectsTypes: [], projects: proj});

            }
        });
    },

    getProjectDetail: function (req, res) {

        //res.send('Project Detail...');
        var projId = req.param('id');
        if (projId) {
            Project.projectDetail(projId, function (err, proj) {
                if (err) {
                    res.forbidden();
                    //res.send(err);
                } else {
                    res.json(proj);
                }
            });
        } else {
            res.json({errorType: "ProjectID", errorMessage: "Project ID is missing"});
        }

    },

    saveProject: function (req, res) {
        return Project.saveProject(req.body, function (err, proj) {
            if (err) {
                res.forbidden();
            } else {
                res.json(proj);
                res.redirect('/project');
            }
        });
    },

    editProject: function (req, res) {
        var projId = req.param('id');
        if (projId) {
            return Project.editProject(projId, req.body, function (err, proj) {
                if (err) {
                    res.forbidden();
                } else {
                    res.json(proj);
                }
            });
        } else {
            res.json({errorType: "ProjectID", errorMessage: "Project ID is missing"});
        }
    },

    deleteProject: function (req, res) {
        var projId = req.param('id');
        if (projId) {
            return Project.deleteProject(projId, function (err, proj) {
                if (err) {
                    res.forbidden();
                } else {
                    res.json(proj);
                }
            });
        } else {
            res.json({errorType: "ProjectID", errorMessage: "Project ID is missing"});
        }
    },

    podioJobCreate: function (req, res) {

        //{ hook_id: '878564', code: 'e265850a', type: 'hook.verify' }

        //        { item_id: '244646406',
        //            item_revision_id: '0',
        //            type: 'item.create',
        //            hook_id: '878511' }


        var userID = parseInt(req.param('userID'));
        var type = req.param('type');

        //var podioAccess = sails.config.globals.elancAppMainDataObj.getAccessToken(userID, "podio");
        //var elanceAccess = sails.config.globals.elancAppMainDataObj.getAccessToken(userID, "elance");


        Subcategory.subcategorylist(null, function (err, categ) {
            if (!err) {
                subcateList = categ;

                var getJobCategoryID = function (category) {

                    var formattedSubcateList = {};

                    _.each(subcateList, function(subCate){
                        formattedSubcateList[subCate.catName] = subCate;
                    });

                    if (formattedSubcateList[category]) {
                        return formattedSubcateList[category].catId;
                    }

                }

                var postJobData = function (data) {
                    var dataFields = data.fields;

                    var jobPostRequestData = {
                        "title": "Testing Job Post",
                        "description": "The details of the work being requested. If the text submitted is either shorter than 100 characters or longer than 4000 characters, the job posting request will return an error.",
                        "type": "Hourly",
                        "hourlyType": "Part Time",
                        "hoursPerWeek": "4",
                        "catId": "10224",
                        "minBudget": "30",
                        "maxBudget": "40",
                        "skillNames": [],
                        "isInviteOnly": false,
                        "automation": true
                    };

                    for (var i = 0; i < dataFields.length; i++) {
                        switch (dataFields[i].label) {

                            case "Name of Job" :
                                jobPostRequestData.title = dataFields[i].values[0].value;   //"title": "sample_value"
                                break;

                            case "Automations" :
                                jobPostRequestData.automation = dataFields[i].values[0].value.text == 'Post Job to Elance' ? true : false;     //"automations": integer_value_of_option
                                break;

                            case "Describe It" :
                                jobPostRequestData.description = dataFields[i].values[0].value.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, ''); //"text": "sample_value"
                                break;

                            case 86016409 : //"category-of-work-2": item_id_of_reference
                                break;

                            case "Subcategory of Work" :
                                jobPostRequestData.catId = getJobCategoryID(dataFields[i].values[0].value.title);  //"subcategory-of-work-2": item_id_of_reference
                                break;

                            case 86016432 : //"relationship": item_id_of_reference - skills
                                break;

                            case "Work Arrangement" :
                                jobPostRequestData.type = dataFields[i].values[0].value.text;  //"work-arrangement": integer_value_of_option
                                if (dataFields[i].values[0].value.text == 'FIXED') {
                                    delete jobPostRequestData.hourlyType;
                                    delete jobPostRequestData.hoursPerWeek;

                                }
                                break;

                            case "Job Posting Visibility" :
                                jobPostRequestData.isInviteOnly = dataFields[i].values[0].value.text == 'Private' ? true : false//"job-posting-visibility": integer_value_of_option
                                break;

                            case "Minimum Budget" :
                                jobPostRequestData.minBudget = dataFields[i].values[0].value//"job-posting-visibility": integer_value_of_option
                                break;

                            case "Maximum Budget" :
                                jobPostRequestData.maxBudget = dataFields[i].values[0].value//"job-posting-visibility": integer_value_of_option
                                break;
                        }
                    }

                    return jobPostRequestData;
                };

                var verifyHook = function () {
                    console.log('verifying hook');
                    console.log(req.params.all());

                    request({
                        uri: "https://api.podio.com/hook/" + req.param('hook_id') + "/verify/validate",
                        method: "POST",
                        json: true,
                        headers: {
                            "content-type": "application/json"
                        },
                        body: { "code": req.param('code') }

                    }, function (error, response, body) {
                        console.log(body);
                    });
                };

                var useVerifiedHook = function () {
                    console.log('using verified hook');
                    console.log(req.params.all());

                    var itemID = parseInt(req.param('item_id'));

                    User.getUserById(userID, function (err, user) {
                        if (!err) {

                            var elanceAccess = user[0].elanceAuth.access_token;
                            var podioAccess = user[0].podioAuth.access_token;

                            podioAPI.podioGetItemById(podioAccess, itemID, function (err, podioJobItem) {
                                if (!err) {
                                    var podioJobItemData = podioJobItem;
                                    var jobPostPayLoad = postJobData(podioJobItemData);

                                    if (!jobPostPayLoad.automation) return false;

                                    elanceAPI.elanceJobPost(elanceAccess, jobPostPayLoad, function (err, elancePostedJob) {

                                        if (!err) {
                                            var elancePostedJobData = elancePostedJob;

                                            //saving posted job in local DB
                                            elancePostedJobData.data.item_id = itemID;
                                            elancePostedJobData.data.user_id = userID;

                                            Project.saveProject(elancePostedJobData.data, function (err, proj) {
                                                if (err) {
                                                    console.log('storing Elance posted job in DB failed');
                                                } else {
                                                    console.log('storing Elance posted job in DB success');
                                                    console.log(proj);

                                                    setTimeout(function () {
                                                        sails.controllers.proposals.getElanceProposals(userID);
                                                    }, 10000);

                                                }
                                            });

                                        } else {
                                            console.log('Elance Job Post - failed'+err);

                                            if(err.errors[0].code == "invalid_token_expired"){
                                                elanceAPI.elanceRefreshAccess(userID,function(err, refreshedToken){
                                                    if(!err){
                                                        useVerifiedHook();
                                                    }else{
                                                       console.log(err);
                                                    }
                                                });
                                            }

                                        }
                                    });


                                } else {
                                    console.log('Getting podio Job item - Failed');

                                    if(err.error_description == "expired_token"){
                                        podioAPI.podioRefreshToken(userID,function(err, refreshedToken){
                                            if(!err){
                                                useVerifiedHook();
                                            }else{
                                                console.log(err);
                                            }
                                        });
                                    }
                                }
                            });


                        } else {
                            console.log('projectController -> useVerifiedHook -> Failed ');
                        }
                    });


                }


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

            } else {

            }
        });


    },

    podioWorkSpace: function (req, res) {

        return sails.services.podioapi.podioOrgSpaces(req.body, function (err, orgs) {
            if (err) {
                res.forbidden();
            } else {
                res.view('project', {partialTemp: "spaces", projectsTypes: [], orgs: orgs});
            }
        });
    },

    jobPostAutomation: function (req, res) {
        var spaceID = req.param('spaceID');
        sails.services.podioapi.podioAppCreate(spaceID);
        res.view('project', {partialTemp: "loading"});
    },

    syncComplete: function (req, res) {
        res.view('project', {partialTemp: "synccomplete"});
    },

    getTitle: function (req, res) {
        //res.send(Project.elanceTitle());
        console.log('getElanceTitle');
        res.send(elance.getElanceTitle());
    }
};

