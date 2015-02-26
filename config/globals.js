/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.globals.html
 */
module.exports.globals = {

    /****************************************************************************
     *                                                                           *
     * Expose the lodash installed in Sails core as a global variable. If this   *
     * is disabled, like any other node module you can always run npm install    *
     * lodash --save, then var _ = require('lodash') at the top of any file.     *
     *                                                                           *
     ****************************************************************************/

    // _: true,

    /****************************************************************************
     *                                                                           *
     * Expose the async installed in Sails core as a global variable. If this is *
     * disabled, like any other node module you can always run npm install async *
     * --save, then var async = require('async') at the top of any file.         *
     *                                                                           *
     ****************************************************************************/

    // async: true,

    /****************************************************************************
     *                                                                           *
     * Expose the sails instance representing your app. If this is disabled, you *
     * can still get access via req._sails.                                      *
     *                                                                           *
     ****************************************************************************/

    // sails: true,

    /****************************************************************************
     *                                                                           *
     * Expose each of your app's services as global variables (using their       *
     * "globalId"). E.g. a service defined in api/models/NaturalLanguage.js      *
     * would have a globalId of NaturalLanguage by default. If this is disabled, *
     * you can still access your services via sails.services.*                   *
     *                                                                           *
     ****************************************************************************/

    // services: true,

    /****************************************************************************
     *                                                                           *
     * Expose each of your app's models as global variables (using their         *
     * "globalId"). E.g. a model defined in api/models/User.js would have a      *
     * globalId of User by default. If this is disabled, you can still access    *
     * your models via sails.models.*.                                           *
     *                                                                           *
     ****************************************************************************/

    // models: true

    elancAppMainDataObj: {},

    elancAppMainDataObjLocal: {
        userData : {},
        userInfo : {},
        tokenDataElance: {},
        tokenDataPodio: {},
        projTypes: [
            {name: "php"}
        ],
        projIds: [],
        webredirecrUrlElance: 'http://localhost:1338/back',
        webredirecrUrlPodio: 'https://5189afc3.ngrok.com/podioauth',
        webredirecrUrlPodioHookJobPost : "https://5189afc3.ngrok.com/jobCreate",
        webredirecrUrlPodioHookProposalUpdate : "https://5189afc3.ngrok.com/proposalUpdate",
        client_id_elance: "54db1119e4b0ce56b5a32eb8",
        client_id_podio: "elanceapi",
        client_secret_elance: "3zINaEeIe4K9OPMZTNol0A",
        client_secret_podio: "WRExsjEHUe1ZUwQvSkjoKTpIk0L1gZKxlFLDcsXctVpNLMyqzH63MrZCya0sLYtH",
        getAccessToken : function(userId, type){
            for(var i=0; i<this.userData.length; i++){
                if(this.userData[i].userInfo.user_id == userId){
                    if(type == "elance" ){
                        return this.userData[i].elanceAuth.access_token;
                    }else{
                        return this.userData[i].podioAuth.access_token;
                    }

                }
            }
        },

        getRefreshToken : function(userId, type){
            for(var i=0; i<this.userData.length; i++){
                if(this.userData[i].userInfo.user_id == userId){
                    if(type == "elance" ){
                        return this.userData[i].elanceAuth.refresh_token;
                    }else{
                        return this.userData[i].podioAuth.refresh_token;
                    }

                }
            }
        }

    },

    elancAppMainDataObjRemote: {
        userData : {},
        userInfo : {},
        tokenDataElance: {},
        tokenDataPodio: {},
        projTypes: [
            {name: "php"}
        ],
        projIds: [],
        webredirecrUrlElance: 'http://54.88.90.102/back',
        webredirecrUrlPodio: 'http://54.88.90.102/podioauth',
        webredirecrUrlPodioHookJobPost : "http://54.88.90.102/jobCreate",
        webredirecrUrlPodioHookProposalUpdate : "http://54.88.90.102/proposalUpdate",
        client_id_elance: "54ee5c47e4b0ce56b5a32ed6",
        client_id_podio: "elanceapimain",
        client_secret_elance: "6goKMXnTwo_XiFk1MC3qCA",
        client_secret_podio: "0V3Eg4vcLCWWebvDIuPRmE8bu18TadatfLCJLp1WCkeebPxGh8knjKXieEYYF71U",
        getAccessToken : function(userId, type){
            for(var i=0; i<this.userData.length; i++){
                if(this.userData[i].userInfo.user_id == userId){
                    if(type == "elance" ){
                        return this.userData[i].elanceAuth.access_token;
                    }else{
                        return this.userData[i].podioAuth.access_token;
                    }

                }
            }
        },

        getRefreshToken : function(userId, type){
            for(var i=0; i<this.userData.length; i++){
                if(this.userData[i].userInfo.user_id == userId){
                    if(type == "elance" ){
                        return this.userData[i].elanceAuth.refresh_token;
                    }else{
                        return this.userData[i].podioAuth.refresh_token;
                    }

                }
            }
        }
    },

    podioAppIds :{
        proposal : "11169426",
        category : "11333622",
        subcategory : "11333626"
    }

};
