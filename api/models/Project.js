/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var phantom = require('phantom');
var crypto = require('crypto');

module.exports = {

    attributes: {
        "jobId": {type: 'string', required: true},
        "name": {type: 'string' },
        "budget": {type: 'string' },
        "budgetMin": {type: 'string' },
        "budgetMax": {type: 'string' },
        "numProposals": {type: 'string' },
        "postedDate": {type: 'string' },
        "startDate": {type: 'string' },
        "endDate": {type: 'string' },
        "clientUserId": {type: 'string' },
        "clientUserName": {type: 'string' },
        "clientName": {type: 'string' }
    },

    projectlist: function (req, callback) {
        Project.find().exec(function (err, proj) {
            if (!err) {
                return callback(null, proj);

            } else {
                return callback(err, {"status": "failed"});
            }
        });
    },

    projectDetail: function (pid, callback) {
        Project.find({jobId: pid}).exec(function (err, proj) {
            if (!err) {
                if (proj.length == 0) {
                    return callback(null, {errorType: "Project Details", errorMessage: "No Project with this ID"});
                } else {
                    return callback(null, proj);
                }


            } else {
                return callback(err, {"status": "failed"});
            }
        });
    },

    saveProject: function (req, callback) {

        Project.create(req).exec(function (err, proj) {
            if (!err) {
                return callback(null, proj);

            } else {
                return callback(err, {"status": "failed"});
            }
        });

    },

    saveMultipleProject: function (req, callback) {

        for (var i = 0; i < req.length; i++) {
            for (var m = 0; m < sails.config.globals.elancAppMainDataObj.projIds.length; m++) {
                if (req[i].jobId == sails.config.globals.elancAppMainDataObj.projIds[i].jobId) {
                    req.splice(i, 1);
                }
            }
        }


        for (var i = 0; i < req.length; i++) {
            //for (var m = 0; m < sails.config.globals.elancAppMainDataObj.projIds.length; m++) {
            //  if (req[i].jobId != sails.config.globals.elancAppMainDataObj.projIds[i].jobId) {
            Project.create(req[i]).exec(function (err, proj) {
                if (!err) {
                    return callback(null, proj);

                } else {
                    return callback(err, {"status": "failed"});
                }
            });
            //}
            //}
        }

    },

    editProject: function (pid, req, callback) {
        Project.update({jobId: pid}, req, function (err, proj) {
            if (!err) {
                if (proj.length == 0) {
                    return callback(null, {errorType: "Project Details", errorMessage: "cann't edit ! No Project with this ID"});
                } else {
                    return callback(null, proj);
                }

            } else {
                return callback(err, {"status": "failed"});
            }
        });
    },

    deleteProject: function (pid, callback) {
        Project.destroy({jobId: pid}).exec(function (err, proj) {
            if (!err) {
                if (proj.length == 0) {
                    return callback(null, {errorType: "Project Details", errorMessage: "cann't delete ! No Project with this ID"});
                } else {
                    return callback(null, proj);
                }
            } else {
                return callback(err, {"status": "failed"});
            }
        });
    },

    elanceTitle: function () {

        phantom.create(function (ph) {
            ph.createPage(function (page) {
                page.open('http://www.google.com', function (status) {
                    console.log('opened google?', status);
                    var title = page.evaluate(function () {
                        return document.title;
                    });
                    console.log('page title is ' + title);
                });
            });
            ph.exit();
        });

        //return crypto.createHash('md5').update("vijay").digest('hex');


    }
};

