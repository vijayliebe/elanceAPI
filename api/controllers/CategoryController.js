/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var pollingtoevent = require("polling-to-event");
var rp = require('request-promise');

module.exports = {

    getElanceCategory: function (req, res) {
        var url = "https://api.elance.com/api2/categories?access_token=" + sails.config.globals.elancAppMainDataObj.tokenDataElance.access_token;

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


            Category.find({user_id: sails.config.globals.elancAppMainDataObj.userInfo.user_id}).exec(function (err, categories) {
                if (!err) {
                    var categoriesFormatted = {};

                    _.each(categories, function (category) {
                        categoriesFormatted[category.catId] = category;
                    });

                    _.each(categoriesData, function (category) {
                        if (!_.has(categoriesFormatted, category.catId)) {
                            // create a new category in db

                            (function (category) {
                                sails.services.podioapi.podioCreateJobCategory(category);
                            }(category));

                        }
                    });
                }
            });

        });


    }
};

