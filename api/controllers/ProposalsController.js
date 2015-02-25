/**
 * ProposalsController
 *
 * @description :: Server-side logic for managing proposals
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var proposalsService = require('../services/elanceProposal');
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

    getElanceProposals : function(req, res){
       // proposalsService.elanceProposals();

//        project.find().exec(function (err, projects) {
//            if (err) {
//                console.log('Failed');
//            } else {
//
//                _.each(projects, function(project){
//
//                    var item_id = project.item_id;
//
//                });
//
//
//
//            }
//        });

    }
};

