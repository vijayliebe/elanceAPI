/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var elance = require('../services/elance');
var elanceJobs = require('../services/elanceJobs');
var request = require("request");

module.exports = {
    getProject: function (req, res) {
        //elanceJobs.elancAppMainData();
        //elanceJobs.getAllElanceJobs();
        return Project.projectlist(req.body, function (err, proj) {
            if (err) {
                res.forbidden();
                //res.send(err);
            } else {
                //res.json(proj);
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


        var type = req.param('type');

        var getJobCategoryID = function(category){
            switch (category){

                case 'Web Programming' : return 10224;
                break;

                default : return 10224;

            }
        }

        var postJobData = function(data){
            var dataFields = data.fields;

            var jobPostRequestData ={
                "title" : "Testing Job Post",
                "description" : "The details of the work being requested. If the text submitted is either shorter than 100 characters or longer than 4000 characters, the job posting request will return an error.",
                "type" : "Hourly",
                "hourlyType" : "Part Time",
                "hoursPerWeek" : "4",
                "catId" : "10224",
                "minBudget" : "30",
                "maxBudget" : "40",
                "skillNames" : [],
                "isInviteOnly" : true,
                "automation" : true
            };

            for(var i=0; i<dataFields.length; i++){
                switch(dataFields[i].field_id){

                    case 86009929 : jobPostRequestData.title = dataFields[i].values[0].value;   //"title": "sample_value"
                        break;

                    case 86014746 :  jobPostRequestData.automation = dataFields[i].values[0].value.text == 'Post Job to Elance' ? true : false;     //"automations": integer_value_of_option
                        break;

                    case 86009930 : jobPostRequestData.description = dataFields[i].values[0].value.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, ''); //"text": "sample_value"
                        break;

                    case 86016409 : //"category-of-work-2": item_id_of_reference
                        break;

                    case 86016410 : jobPostRequestData.catId = getJobCategoryID(dataFields[i].values[0].value.title);  //"subcategory-of-work-2": item_id_of_reference
                        break;

                    case 86016432 : //"relationship": item_id_of_reference - skills
                        break;

                    case 86014134 : jobPostRequestData.type = dataFields[i].values[0].value.text;  //"work-arrangement": integer_value_of_option
                        break;

                    case 86017465 : jobPostRequestData.isInviteOnly = dataFields[i].values[0].value.text == 'Private' ? false : true//"job-posting-visibility": integer_value_of_option
                        break;

                    case 86262716 : jobPostRequestData.minBudget = dataFields[i].values[0].value//"job-posting-visibility": integer_value_of_option
                        break;

                    case 86262717 : jobPostRequestData.maxBudget = dataFields[i].values[0].value//"job-posting-visibility": integer_value_of_option
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

            request({
                uri: "https://api.podio.com/item/"+req.param('item_id')+"?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
                method: "GET",
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
            }, function (error, response, body) {
                var data = JSON.parse(body);

                console.log(data);
                console.log(data.title);

                var jobPostPayLoad = postJobData(data);

                if(!jobPostPayLoad.automation) return false;

                request.post({
                    url:'https://api.elance.com/api2/projects/jobs?access_token='+sails.config.globals.elancAppMainDataObj.tokenDataElance.access_token,
                    form :jobPostPayLoad
                }, function(err,httpResponse,body){
                    console.log(body);
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


    },

    getTitle: function (req, res) {
        //res.send(Project.elanceTitle());
        console.log('getElanceTitle');
        res.send(elance.getElanceTitle());
    }
};

