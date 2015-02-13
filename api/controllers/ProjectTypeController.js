/**
 * ProjectTypeController
 *
 * @description :: Server-side logic for managing projecttypes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    getProjectType: function (req, res) {
        return ProjectType.getProjectType(req.body, function (err, proj) {
            if (err) {
                res.forbidden();
            } else {
                res.json(proj);
                //res.redirect('/project');
            }
        });
    },

    saveProjectType: function (req, res) {
        return ProjectType.saveProjectType(req.body, function (err, proj) {
            if (err) {
                res.forbidden();
            } else {
                res.json(proj);
                //res.redirect('/project');
            }
        });
    }
	
};

