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
                res.view('project', {partialTemp:"projectPartial",projectsTypes : [], projects: proj});
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

    podioJobCreate : function(req, res){
        console.log('podioJobCreate route');
        console.log(req.params.all());
//{ hook_id: '878564', code: 'e265850a', type: 'hook.verify' }

        if(req.param('type') != 'hook.verify'){
            return false;
        }

        var requestData = { "code": req.param('code') };
        console.log(JSON.stringify(requestData));
        request({
            url: "https://api.podio.com/hook/"+req.param('hook_id')+"/verify/validate",
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(requestData)

        }, function(error, response, body) {
            console.log(error);
            console.log(response);
            console.log(body);
        });

    },

    getTitle: function (req, res) {
        //res.send(Project.elanceTitle());
        console.log('getElanceTitle');
        res.send(elance.getElanceTitle());
    }
};

