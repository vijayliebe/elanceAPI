/**
 * SubcategoryController
 *
 * @description :: Server-side logic for managing subcategories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var pollingtoevent = require("polling-to-event");
var rp = require('request-promise');

module.exports = {

    getElanceSubCategory: function (req, res) {
        var url = "https://api.elance.com/api2/categories?access_token=" + sails.config.globals.elancAppMainDataObj.tokenDataElance.access_token;
        var processFlag = true;
        var itemInsert = false;

        emitter = pollingtoevent(function (done) {
            rp.get(url, function (err, req, data) {
                done(err, data);
            });

        }, {
            longpolling: true,
            interval: 1000 * 60 * 60 * 24 // every 24 hr.
        });


        emitter.on("longpoll", function (data) {
            console.log("longpoll emitted at %s, with data %j", Date.now());

            var _data = JSON.parse(data);
            if (_data.error) return;

            var categoriesData = _data.data;


            Subcategory.find({user_id: sails.config.globals.elancAppMainDataObj.userInfo.user_id}).exec(function (err, categories) {
                if (!err) {
                    var categoriesFormatted = {};

                    _.each(categories, function (category) {
                        categoriesFormatted[category.catId] = category;
                    });

                    _.each(categoriesData, function (category) {

                        _.each(category.children, function (subCategory) {

                            if (!_.has(categoriesFormatted, subCategory.catId)) {
                                // create a new category in db

                                (function (subCategory) {
                                    sails.services.podioapi.podioCreateJobSubCategory(subCategory);
                                }(subCategory));

                            }
                        });

                    });
                }
            });

        });

    }

}


