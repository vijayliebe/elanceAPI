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
        console.log(req.param('hook_id')+'======'+req.param('code'));

//        request({
//            uri: "https://api.podio.com/hook/"+req.param('hook_id')+"/verify/validate",
//            method: "POST",
//            form: {
//                "code": req.param('code')
//            }
//        }, function(error, response, body) {
//            console.log(body);
//        });

        var https = require('https');
        var querystring = require('querystring');

        var data = querystring.stringify({
            code: req.param('code')
        });

        var options = {
            host: 'api.podio.com',
            path: req.param('hook_id')+'/verify/validate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        var https_req = https.request(options, function(httpsres) {
            httpsres.setEncoding('utf8');
            httpsres.on('data', function (chunk) {
                console.log(chunk);
            });
        });

        https_req.write(data);
        https_req.end();

    },

    getTitle: function (req, res) {
        //res.send(Project.elanceTitle());
        console.log('getElanceTitle');
        res.send(elance.getElanceTitle());
    }
};

