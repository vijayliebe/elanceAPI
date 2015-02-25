//var projectModel = require('../models/Project');
//var userModel = require('../models/User');
//var projectTypeModel = require('../models/ProjectType');
//var request = require("request");
//module.exports = {
//
//    elancAppMainData: function () {
//
//        if (!sails.config.globals.elancAppMainDataObj.tokenData.access_token) {
//            console.log('No access token');
//            return userModel.getToken(null, function (err, token) {
//                if (err) {
//                    console.log('Error');
//                } else {
//                    console.log('success');
//                    sails.config.globals.elancAppMainDataObj.tokenData = token;
//                }
//            });
//        }
//
//
//        return projectTypeModel.getProjectType(null, function (err, proj) {
//            if (err) {
//                console.log('Error');
//            } else {
//                console.log('success');
//                sails.config.globals.elancAppMainDataObj.projTypes = proj;
//            }
//        });
//
//
//        return projectModel.projectlist(null, function (err, proj) {
//            if (err) {
//                console.log('Error');
//            } else {
//                console.log('success');
//                sails.config.globals.elancAppMainDataObj.projIds = [];
//                for (var i = 0; i < proj.length; i++) {
//                    sails.config.globals.elancAppMainDataObj.projIds.push = proj[i].jobId;
//                }
//            }
//        });
//
//
//    },
//
//    getAllElanceJobs: function () {
//        var intervalTime = 1000;
//        var intervalTime2 = 1000;
//        setInterval(function () {
//            var projTypes = sails.config.globals.elancAppMainDataObj.projTypes;
//            var i = 0;
//            var jobsExternalCallVar = setInterval(function () {
//                jobsExternalCall()
//            }, intervalTime2);
//
//            function jobsExternalCall() {
//                request({
//                    uri: "https://api.elance.com/api2/jobs?keywords=" + projTypes[i].name + "&access_token=" + sails.config.globals.elancAppMainDataObj.tokenData[0].access_token,
//                    method: "GET",
//                    timeout: 10000,
//                    followRedirect: true,
//                    maxRedirects: 10
//                }, function (error, response, body) {
//                    var data = JSON.parse(body);
//                        console.log(data);
//
//                        if (data.data.pageResults.length !=0 ) {
//                            return projectModel.saveProject(data.data.pageResults, function (err, proj) {
//                                if (err) {
//                                    console.log('Error');
//                                } else {
//                                    console.log('success');
//                                    i = i + 1;
//                                    intervalTime2 = 10000;
//                                    if (i == projTypes.length) stopJobsExternalCall();
//                                }
//                            });
//                        }
//
//                });
//            }
//
//            function stopJobsExternalCall() {
//                clearInterval(jobsExternalCallVar);
//            }
//
//
//            intervalTime = 1000 * 60 * 60;
//        }, intervalTime);
//
//    }
//}