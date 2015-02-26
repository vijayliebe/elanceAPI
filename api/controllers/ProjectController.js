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
            return Project.projectDetail(projId, function (err, proj) {
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


        var userID = req.param('userID');
        var type = req.param('type');

        var podioAccess = sails.config.globals.elancAppMainDataObj.getAccessToken(userID, "podio");
        var elanceAccess = sails.config.globals.elancAppMainDataObj.getAccessToken(userID, "elance");


        sails.models.subcategory.subcategorylist(null, function (err, categ) {
            if (!err) {
                subcateList = categ;

                var getJobCategoryID = function (category) {
                    for (var i = 0; i < subcateList.length; i++) {
                        if (subcateList[i].catName == category) {
                            return subcateList[i].catId;
                        }
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
                    var itemID = req.param('item_id');
                    //reuesting job item data from podio
                    request({
                        uri: "https://api.podio.com/item/" + req.param('item_id') + "?oauth_token=" + podioAccess,
                        method: "GET",
                        timeout: 10000,
                        followRedirect: true,
                        maxRedirects: 10
                    }, function (error, response, body) {
                        if (body == undefined) {
                            console.log(error);
                            return false;
                        }
                        var data = JSON.parse(body);

                        console.log(data);
                        console.log(data.title);

                        var jobPostPayLoad = postJobData(data);

                        if (!jobPostPayLoad.automation) return false;

                        //posting job to elance as per data received from podio
                        request.post({
                            url: 'https://api.elance.com/api2/projects/jobs?access_token=' + elanceAccess,
                            form: jobPostPayLoad
                        }, function (err, httpResponse, body) {
                            console.log(body);
                            data = JSON.parse(body);

                            //saving posted job in local DB
                            data.data.item_id = parseInt(itemID);
                            console.log('itemID--------->'+itemID);

                            data.data.user_id = parseInt(userID);

                            Project.saveProject(data.data, function (err, proj) {
                                if (err) {
                                    console.log('storing posted job in DB failed');
                                } else {
                                    console.log('storing posted job in DB success');
                                    console.log(proj);

                                    setTimeout(function(){
                                        sails.controllers.category.getElanceCategory(userID);
                                    },10000);

                                }
                            });

                        });

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

    podioWorkSpace : function(req, res){

        return sails.services.podioapi.podioSpaces(req.body, function (err, spaces) {
            if (err) {
                res.forbidden();
            } else {
                res.view('project', {partialTemp: "spaces", projectsTypes: [], spaces: spaces});
            }
        });
    },

    jobPostAutomation : function(req, res){
        var spaceID = req.param('spaceID');
        sails.services.podioapi.podioAppCreate(spaceID);
        res.view('project', {partialTemp: "loading"});
    },

    syncComplete : function(req, res){
        res.view('project', {partialTemp: "synccomplete"});
    },

    getTitle: function (req, res) {
        //res.send(Project.elanceTitle());
        console.log('getElanceTitle');
        res.send(elance.getElanceTitle());
    }
};

