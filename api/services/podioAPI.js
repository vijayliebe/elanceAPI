var pollingtoevent = require("polling-to-event");
var request = require("request");
var rp = require('request-promise');
var async = require('asyncjs');

module.exports = {

    podioCreateJobCategory: function (category) {

        rp({
            uri: "https://api.podio.com/item/app/" + sails.config.globals.podioAppIds.category + "?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json"
            },
            body: {
                "fields": {
                    "category-of-work": category.catName
                },
                "file_ids": [],
                "tags": []
            }

        })
            .then(function (body) {
                console.log('Saving category success -podio');

                category.user_id = sails.config.globals.elancAppMainDataObj.userInfo.user_id;

                Category.savecategory(category, function (err, proj) {
                    if (err) {
                        console.log('Saving category Failed');
                    } else {
                        console.log('Saving category success -local');
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    podioCreateJobSubCategory: function (category) {
        rp({
            uri: "https://api.podio.com/item/app/" + sails.config.globals.podioAppIds.subcategory + "?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json"
            },
            body: {
                "fields": {
                    "subcategory-of-work": category.catName
                },
                "file_ids": [],
                "tags": []
            }

        })
            .then(function (body) {
                console.log('Saving sub-category success -podio');

                category.user_id = sails.config.globals.elancAppMainDataObj.userInfo.user_id;

                Subcategory.savesubcategory(category, function (err, proj) {
                    if (err) {
                        console.log('Saving sub-category Failed');
                    } else {
                        console.log('Saving csub-ategory success -local');
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    podioCreateProposal: function (proposal) {
//        rp({
//            uri: "https://api.podio.com/item/app/" + sails.config.globals.podioAppIds.proposal + "?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
//            method: "POST",
//            json: true,
//            headers: {
//                "content-type": "application/json"
//            },
//            body: {
//                "fields": {
//                    "title": jobData.name,
//                    "va-name": joProposalsData.providerName,
//                    "status": [],
//                    "text-2": "TESTING",
//                    "proposal-amount": "220",
//                    "delivery-timeframe": "TESTING",
//                    "rate": joProposalsData.hourlyRate,
//                    "jobs-started-in-the-last-12-months": "TESTING",
//                    "text-3": "TESTING",
//                    "earnings-from-the-last-12-months": "TESTING",
//                    "average-job-rating": "TESTING",
//                    "job": [
//                        {
//                            "value": item_id
//                        }
//                    ],
//                    "va-team": []
//                },
//                "file_ids": [],
//                "tags": []
//            }
//
//        })
//            .then(function (body) {
//                console.log('Saving sub-category success -podio');
//
//                category.user_id = sails.config.globals.elancAppMainDataObj.userInfo.user_id;
//
//                Subcategory.savesubcategory(category, function (err, proj) {
//                    if (err) {
//                        console.log('Saving sub-category Failed');
//                    } else {
//                        console.log('Saving csub-ategory success -local');
//                    }
//                });
//            })
//            .catch(function(error){
//                console.log(error);
//            });
    },

    podioSpaces: function (req, callback) {

        rp('https://api.podio.com/space/top?oauth_token=' + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token)
            .then(function (body) {
                var _data = JSON.parse(body);
                return callback(null, _data);
            })
            .catch(function () {
                return callback(error, {"status": "failed"});
            });
    },

    podioAppCreate: function (spaceID) {
        spaceID = parseInt(spaceID);

        var categoryAppID, subCategoryAppID, skillAppID, jobPostAppID, proposalAppID;
        var categoryPayload = {
            "space_id": spaceID,
            "config": {
                "allow_edit": true,
                "tasks": [],
                "yesno": false,
                "silent_creates": false,
                "yesno_label": null,
                "thumbs": false,
                "app_item_id_padding": 1,
                "show_app_item_id": false,
                "default_view": "table",
                "allow_tags": true,
                "item_name": "Category of Work",
                "allow_attachments": true,
                "allow_create": true,
                "app_item_id_prefix": "",
                "disable_notifications": false,
                "fivestar": false,
                "thumbs_label": null,
                "type": "standard",
                "rsvp": false,
                "description": "Elance categories of Work",
                "usage": null,
                "fivestar_label": null,
                "approved": false,
                "icon": "251.png",
                "allow_comments": true,
                "name": "Category of Work",
                "icon_id": 251,
                "silent_edits": false,
                "rsvp_label": null,
                "external_id": null
            },
            "fields": [
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "plain",
                            "size": "small"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Category of Work",
                        "visible": true,
                        "delta": 0,
                        "hidden": false,
                        "unique": false
                    }
                }
            ]
        };

        var subCategoryPayload = {
            "space_id": spaceID,
            "config": {
                "allow_edit": true,
                "tasks": [],
                "yesno": false,
                "silent_creates": false,
                "yesno_label": null,
                "thumbs": false,
                "app_item_id_padding": 1,
                "show_app_item_id": false,
                "default_view": "table",
                "allow_tags": true,
                "item_name": "Subcategory of Work",
                "allow_attachments": true,
                "allow_create": true,
                "app_item_id_prefix": "",
                "disable_notifications": false,
                "fivestar": false,
                "thumbs_label": null,
                "type": "standard",
                "rsvp": false,
                "description": null,
                "usage": null,
                "fivestar_label": null,
                "approved": false,
                "icon": "251.png",
                "allow_comments": true,
                "name": "Subcategory of Work",
                "icon_id": 251,
                "silent_edits": false,
                "rsvp_label": null,
                "external_id": null
            },
            "fields": [
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "plain",
                            "size": "small"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Subcategory of Work",
                        "visible": true,
                        "delta": 0,
                        "hidden": false,
                        "unique": false
                    }
                }
            ]
        };

        var specificSkillPayload = {
            "space_id": spaceID,
            "config": {
                "allow_edit": true,
                "tasks": [],
                "yesno": false,
                "silent_creates": false,
                "yesno_label": null,
                "thumbs": false,
                "app_item_id_padding": 1,
                "show_app_item_id": false,
                "default_view": "table",
                "allow_tags": true,
                "item_name": "Specific Skills",
                "allow_attachments": true,
                "allow_create": true,
                "app_item_id_prefix": "",
                "disable_notifications": false,
                "fivestar": false,
                "thumbs_label": null,
                "type": "standard",
                "rsvp": false,
                "description": null,
                "usage": null,
                "fivestar_label": null,
                "approved": false,
                "icon": "251.png",
                "allow_comments": true,
                "name": "Specific Skills",
                "icon_id": 251,
                "silent_edits": false,
                "rsvp_label": null,
                "external_id": null
            },
            "fields": [
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "plain",
                            "size": "small"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Specific Skills",
                        "visible": true,
                        "delta": 0,
                        "hidden": false,
                        "unique": false
                    }
                }
            ]
        };

        var jobPostPayload = {
            "space_id": spaceID,
            "config": {
                "allow_edit": true,
                "tasks": [],
                "yesno": false,
                "silent_creates": false,
                "yesno_label": null,
                "thumbs": false,
                "app_item_id_padding": 1,
                "show_app_item_id": false,
                "default_view": "badge",
                "allow_tags": true,
                "item_name": "New post/ listing",
                "allow_attachments": true,
                "allow_create": true,
                "app_item_id_prefix": "",
                "disable_notifications": false,
                "fivestar": false,
                "thumbs_label": null,
                "type": "standard",
                "rsvp": false,
                "description": null,
                "usage": null,
                "fivestar_label": null,
                "approved": false,
                "icon": "251.png",
                "allow_comments": true,
                "name": "Job posting test3",
                "icon_id": 251,
                "silent_edits": false,
                "rsvp_label": null,
                "external_id": null
            },
            "fields": [
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "plain",
                            "size": "small"
                        },
                        "required": true,
                        "mapping": null,
                        "label": "Name of Job",
                        "visible": true,
                        "delta": 0,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "category",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "multiple": false,
                            "options": [
                                {
                                    "status": "active",
                                    "text": "Post Job to Elance",
                                    "id": 1,
                                    "color": "DCEBD8"
                                }
                            ],
                            "display": "inline"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Automations",
                        "visible": true,
                        "delta": 1,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": "Your job description is critical in receiving quality proposals. Please enter more than 100 characters.",
                        "settings": {
                            "format": "html",
                            "size": "large"
                        },
                        "required": true,
                        "mapping": null,
                        "label": "Describe It",
                        "visible": true,
                        "delta": 2,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "app",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "referenceable_types": [
                                categoryAppID
                            ]
                        },
                        "required": true,
                        "mapping": null,
                        "label": "Category of Work",
                        "visible": true,
                        "delta": 3,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "app",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "referenceable_types": [
                                subCategoryAppID
                            ]
                        },
                        "required": true,
                        "mapping": null,
                        "label": "Subcategory of Work",
                        "visible": true,
                        "delta": 4,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "app",
                    "label": "Specific Skills",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "referenceable_types": [ skillAppID ]
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Specific Skills",
                        "visible": true,
                        "delta": 5,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "category",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "multiple": false,
                            "options": [
                                {
                                    "status": "active",
                                    "text": "Hourly",
                                    "id": 1,
                                    "color": "DCEBD8"
                                },
                                {
                                    "status": "active",
                                    "text": "Fixed",
                                    "id": 2,
                                    "color": "DCEBD8"
                                }
                            ],
                            "display": "inline"
                        },
                        "required": true,
                        "mapping": null,
                        "label": "Work Arrangement",
                        "visible": true,
                        "delta": 6,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "number",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "decimals": 0
                        },
                        "required": true,
                        "mapping": null,
                        "label": "Minimum Budget",
                        "visible": true,
                        "delta": 7,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "number",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "decimals": 0
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Maximum Budget",
                        "visible": true,
                        "delta": 8,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "category",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "multiple": false,
                            "options": [
                                {
                                    "status": "active",
                                    "text": "Public - with search engine",
                                    "id": 1,
                                    "color": "DCEBD8"
                                },
                                {
                                    "status": "active",
                                    "text": "Public - without search engine",
                                    "id": 2,
                                    "color": "DCEBD8"
                                },
                                {
                                    "status": "active",
                                    "text": "Private",
                                    "id": 3,
                                    "color": "DCEBD8"
                                }
                            ],
                            "display": "inline"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Job Posting Visibility",
                        "visible": true,
                        "delta": 9,
                        "hidden": false,
                        "unique": false
                    }
                }
            ]
        };

        var proposalPayload = {
            "space_id": spaceID,
            "config": {
                "allow_edit": true,
                "tasks": [],
                "yesno": false,
                "silent_creates": false,
                "yesno_label": null,
                "thumbs": false,
                "app_item_id_padding": 2,
                "show_app_item_id": true,
                "default_view": "badge",
                "allow_tags": true,
                "item_name": "Proposal",
                "allow_attachments": true,
                "allow_create": true,
                "app_item_id_prefix": "propo",
                "disable_notifications": false,
                "fivestar": false,
                "thumbs_label": null,
                "type": "standard",
                "rsvp": false,
                "description": null,
                "usage": null,
                "fivestar_label": null,
                "approved": false,
                "icon": "251.png",
                "allow_comments": true,
                "name": "Proposals",
                "icon_id": 251,
                "silent_edits": false,
                "rsvp_label": null,
                "external_id": null
            },
            "fields": [
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "plain",
                            "size": "small"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Title",
                        "visible": true,
                        "delta": 0,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "html",
                            "size": "large"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Proposal VA Name",
                        "visible": true,
                        "delta": 1,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "category",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "multiple": false,
                            "options": [
                                {
                                    "status": "active",
                                    "text": "Recieved",
                                    "id": 1,
                                    "color": "DCEBD8"
                                },
                                {
                                    "status": "active",
                                    "text": "Awarded",
                                    "id": 3,
                                    "color": "DCEBD8"
                                },
                                {
                                    "status": "active",
                                    "text": "Awarded and Allow another",
                                    "id": 2,
                                    "color": "DCEBD8"
                                }
                            ],
                            "display": "inline"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Status",
                        "visible": true,
                        "delta": 2,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "html",
                            "size": "large"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Proposal",
                        "visible": true,
                        "delta": 3,
                        "hidden": false,
                        "unique": false
                    },
                    "external_id": "text-2"
                },
                {
                    "type": "number",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "decimals": 0
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Proposal Amount",
                        "visible": true,
                        "delta": 4,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "html",
                            "size": "large"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Text",
                        "visible": false,
                        "delta": 4,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "html",
                            "size": "large"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Delivery Timeframe",
                        "visible": true,
                        "delta": 5,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "html",
                            "size": "large"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Rate",
                        "visible": true,
                        "delta": 6,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "plain",
                            "size": "small"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Jobs started in the last 12 months",
                        "visible": true,
                        "delta": 7,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "html",
                            "size": "large"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Text",
                        "visible": true,
                        "delta": 8,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "plain",
                            "size": "small"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Earnings from the last 12 months",
                        "visible": true,
                        "delta": 9,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "text",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "format": "html",
                            "size": "large"
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Average Job Rating",
                        "visible": true,
                        "delta": 10,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "app",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "referenceable_types": [
                                jobPostAppID
                            ]
                        },
                        "required": false,
                        "mapping": null,
                        "label": "Job",
                        "visible": true,
                        "delta": 11,
                        "hidden": false,
                        "unique": false
                    }
                },
                {
                    "type": "app",
                    "config": {
                        "default_value": null,
                        "description": null,
                        "settings": {
                            "referenceable_types": [

                            ]
                        },
                        "required": false,
                        "mapping": null,
                        "label": "VA team",
                        "visible": true,
                        "delta": 12,
                        "hidden": false,
                        "unique": false
                    },
                    "external_id": "va-team"
                }
            ]
        }
        //category app
        rp({
            uri: "https://api.podio.com/app?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json"
            },
            body: categoryPayload

        })
            .then(function (body) {
                //var _data = JSON.parse(body);
                //console.log(body);
                categoryAppID = body.app_id;
                sails.config.globals.podioAppIds.category = categoryAppID;
                jobPostPayload.fields[3].config.settings.referenceable_types[0] = body.app_id;
                console.log('Category App created');

                //saving category App in local DB
                body.user_id = sails.config.globals.elancAppMainDataObj.userInfo.user_id;
                Application.saveApplication(body, function (err, data) {
                    if (!err) {
                        console.log('saving category App in local DB');
                    }
                });

                //sub-category app
                rp({
                    uri: "https://api.podio.com/app?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
                    method: "POST",
                    json: true,
                    headers: {
                        "content-type": "application/json"
                    },
                    body: subCategoryPayload

                })
                    .then(function (body) {
                        //var _data = JSON.parse(body);
                        subCategoryAppID = body.app_id;
                        sails.config.globals.podioAppIds.subcategory = subCategoryAppID;
                        jobPostPayload.fields[4].config.settings.referenceable_types[0] = body.app_id;
                        console.log('Sub-category App created');

                        //saving Sub-category App in local DB
                        body.user_id = sails.config.globals.elancAppMainDataObj.userInfo.user_id;
                        Application.saveApplication(body, function (err, data) {
                            if (!err) {
                                console.log('saving Sub-category App in local DB');
                            }
                        });

                        // specific skill app
                        rp({
                            uri: "https://api.podio.com/app?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
                            method: "POST",
                            json: true,
                            headers: {
                                "content-type": "application/json"
                            },
                            body: specificSkillPayload

                        })
                            .then(function (body) {
                                //var _data = JSON.parse(body);
                                skillAppID = body.app_id;
                                jobPostPayload.fields[5].config.settings.referenceable_types[0] = body.app_id;
                                console.log('Specific skill App created');

                                //saving specific skill App in local DB
                                body.user_id = sails.config.globals.elancAppMainDataObj.userInfo.user_id;
                                Application.saveApplication(body, function (err, data) {
                                    if (!err) {
                                        console.log('saving specific skill App in local DB');
                                    }
                                });

                                //Job posting app
                                rp({
                                    uri: "https://api.podio.com/app?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
                                    method: "POST",
                                    json: true,
                                    headers: {
                                        "content-type": "application/json"
                                    },
                                    body: jobPostPayload

                                })
                                    .then(function (body) {
                                        jobPostAppID = body.app_id;
                                        proposalPayload.fields[12].config.settings.referenceable_types[0] = body.app_id;
                                        console.log('Job Post App created');

                                        //saving JobPost App in local DB
                                        body.user_id = sails.config.globals.elancAppMainDataObj.userInfo.user_id;
                                        Application.saveApplication(body, function (err, data) {
                                            if (!err) {
                                                console.log('saving JobPost App in local DB');
                                            }
                                        });

                                        //proposal app
                                        rp({
                                            uri: "https://api.podio.com/app?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
                                            method: "POST",
                                            json: true,
                                            headers: {
                                                "content-type": "application/json"
                                            },
                                            body: proposalPayload

                                        })
                                            .then(function (body) {
                                                console.log('proposal App created');
                                                proposalAppID = body.app_id;
                                                sails.config.globals.podioAppIds.proposal = categoryAppID;


                                                //saving proposal App in local DB
                                                body.user_id = sails.config.globals.elancAppMainDataObj.userInfo.user_id;
                                                Application.saveApplication(body, function (err, data) {
                                                    if (!err) {
                                                        console.log('saving proposal App in local DB');
                                                    }
                                                });

                                                //create web-hook for job post app
                                                rp({
                                                    uri: "https://api.podio.com/hook/app/" + jobPostAppID + "?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
                                                    method: "POST",
                                                    json: true,
                                                    headers: {
                                                        "content-type": "application/json"
                                                    },
                                                    body: {
                                                        "url": sails.config.globals.elancAppMainDataObj.webredirecrUrlPodioHookJobPost + "/" + sails.config.globals.elancAppMainDataObj.userInfo.user_id,
                                                        "type": "item.create"
                                                    }

                                                })
                                                    .then(function (body) {
                                                        console.log('JobPost webhook created');
                                                        //create web-hook for proposal app - update
                                                        rp({
                                                            uri: "https://api.podio.com/hook/app/" + proposalAppID + "?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
                                                            method: "POST",
                                                            json: true,
                                                            headers: {
                                                                "content-type": "application/json"
                                                            },
                                                            body: {
                                                                "url": sails.config.globals.elancAppMainDataObj.webredirecrUrlPodioHookProposalUpdate + "/" + sails.config.globals.elancAppMainDataObj.userInfo.user_id,
                                                                "type": "item.update"
                                                            }

                                                        })
                                                            .then(function (body) {

                                                                console.log('proposal webhook created');
                                                                setTimeout(function () {
                                                                    sails.controllers.category.getElanceCategory(categoryAppID);
                                                                    sails.controllers.subcategory.getElanceSubCategory(subCategoryAppID);
                                                                }, 5000);


                                                            })
                                                            .catch(console.error);


                                                    })
                                                    .catch(console.error);

                                            })
                                            .catch(console.error);


                                    })
                                    .catch(console.error);
                            })
                            .catch(function (error) {
                                console.log('Specific skill App created-failed');
                            });
                    })
                    .catch(console.error);
            })
            .catch(console.error);


    },

    podioWebHookCreate: function (app_id, type) {
        rp({
            uri: "https://api.podio.com/hook/app/app_id?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json"
            },
            body: {
                "url": sails.config.globals.elancAppMainDataObj.webredirecrUrlPodioHookJobPost,
                "type": "item.create"
            }

        })
            .then(function (body) {
            })
            .catch(console.error);
    },

    podioSaveProposalItem: function (currentProject, jobData, elanceProposal, callback) {
        Application.find({user_id: 2718133, "config.item_name": "Proposal"}).exec(function (err, appDetail) {
            if (err) {
                console.log('Failed');
            } else {
                var appID = appDetail[0].app_id;
                rp({
                    uri: "https://api.podio.com/item/app/" + appID + "?oauth_token=" + sails.config.globals.elancAppMainDataObj.tokenDataPodio.access_token,
                    method: "POST",
                    json: true,
                    headers: {
                        "content-type": "application/json"
                    },
                    body: {
                        "fields": {
                            "title": jobData.name,
                            "proposal-va-name": elanceProposal.providerName,
                            "status": [],
                            "proposal": "TESTING",
                            "proposal-amount": "220",
                            "text": "TESTING",
                            "delivery-timeframe": "TESTING",
                            "rate": elanceProposal.hourlyRate,
                            "jobs-started-in-the-last-12-months": "TESTING",
                            "text-2": "TESTING",
                            "earnings-from-the-last-12-months": "TESTING",
                            "average-job-rating": "TESTING",
                            "job": [
                                {
                                    "value": currentProject.item_id
                                }
                            ],
                            "va-team": []
                        },
                        "file_ids": [],
                        "tags": []
                    }

                }).then(function (body) {
                    callback(null, body);
                })
                    .catch(function (error) {
                        console.log(error);
                    })
            }
        });


    },

    podioGetItemById : function(podioAccess, itemId, callback){

                rp({
                    uri: "https://api.podio.com/item/" + itemId + "?oauth_token=" + podioAccess,
                    method: "GET",
                    timeout: 10000,
                    followRedirect: true,
                    maxRedirects: 10
                }).then(function(body){
                    var _data = JSON.parse(body);
                    return callback(null, _data);
                })
                    .catch(function(error){
                        console.log(error)
                    });

    }
}