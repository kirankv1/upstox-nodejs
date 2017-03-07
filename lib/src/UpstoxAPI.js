/**
 * @fileoverview
 * @author renuka.misal@rksv.in (RenukaMisal92)
 */

// External Dependencies
var _ = require('lodash');
var promise =  require('bluebird');

// Internal Dependencies
var RestHelper = require('./../utils/helper.js');

/**
 * @classdesc API client class. You need to initialise a single instance of this class per `api_key`.
 * This module provides an easy to use wrapper over the HTTP APIs.
 * The HTTP calls have been converted to methods and their JSON responses.
 *
 * ~~~~
 *
 * var Upstox = require("Upstox");
 * var up = new Upstox("your_apikey", "your_apiSecretKey");
 * up.getSessionToken("clientId", "password")
 *    .then(function(response) {
 * 		start();
 * 	})
 *    .catch(function(err) {
 * 		console.log(err.response);
 * 	})
 *
 * start(){
 * 	   up.getProfile()
 * 	      .then(function(response){
 * 	           //get the result here
 *         })
 *         .catch(function(error){
               //catch the error here
 *          });
 * }
 * ~~~~
 *

 * @constructor
 * @name Upstox
 * @param {string} apiKey Assigned to you used to authenticate the developers app
 * @param {string} apiSecretKey
 * @param {string} sessionToken optional
 * @example <caption>Initialize Upstox object</caption>
 * var Upstox = require("Upstox");
 * var up = new Upstox("your_apikey", "your_apiSecretKey");
 *
 */
function Upstox(apiKey, apiSecretKey, sessionToken) {

    /**
     * @type {{apiKey: *, apiSecretKey: *, sessionToken: *}}
     * @memberOf Upstox
     */
    this.auth = {
        apiKey: apiKey,
        apiSecretKey: apiSecretKey,
        sessionToken : sessionToken
    };
}

/**
 * @method setToken
 * @description method to associate the sessionToken with the class object.
 * @memberOf Upstox
 * @instance
 * @param {string} sessionToken Token generated after the users logged in successfully with its Upstox client_id(username) and password.
 */
Upstox.prototype.setToken = function(sessionToken){
    var __this = this;
    __this.auth.sessionToken = sessionToken;
};

/**
 * @method getSessionToken
 * @description Method to get the session token required to authenticate user
 * @memberOf Upstox
 * @param {object} params
 * @param {string} params.username valid client id for UPSTOX
 * @param {string} params.password valid password associated with the users client id
 * @return promise
 */
Upstox.prototype.getSessionToken = function(params) {

    var HTTP_METHOD = "POST";
    var __this = this,
        success = {},
        sessionToken;

    return new promise(function (resolve, reject) {
        RestHelper.restify("login", HTTP_METHOD, params, __this.auth)
            .then(function (response) {
                success = response.body;
                success["sessionToken"] = response.headers["set-cookie"][0];
                __this.setToken(response.headers["set-cookie"][0]);
                resolve(success);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

/**
 * @method getProfile
 * @description Method to get the profile details
 * @memberOf Upstox
 * @return {res}
 */
Upstox.prototype.getProfile = function () {

    var __this = this;
    var HTTP_METHOD = "GET";

    return RestHelper.restify("profile", HTTP_METHOD, null, __this.auth );
};

/**
 * @method getHoldings
 * @description Get the user's holdings.
 * @memberOf Upstox
 * @return {res}
 */
Upstox.prototype.getHoldings = function () {

    var __this = this;
    var HTTP_METHOD = "GET";
    return RestHelper.restify("holdings", HTTP_METHOD, null, __this.auth);
};

/**
 * @method getLimits
 * @description Get the user's account limits for equity and commodity.
 * @memberOf Upstox
 * @return {res}
 */
Upstox.prototype.getLimits = function () {

    var __this = this;
    var HTTP_METHOD = "GET";
    return RestHelper.restify("limits", HTTP_METHOD, null, __this.auth);
};

/**
 * @method positions
 * @description Get the user's day positions.
 * @memberOf Upstox
 * @return {res}
 */
Upstox.prototype.getPositions = function () {

    var __this = this;
    var HTTP_METHOD = "GET";
    return RestHelper.restify("positions", HTTP_METHOD, null, __this.auth);
};

/**
 * Placing an order
 *
 * @method placeOrder
 * @memberOf Upstox
 * @param {object} params
 * @param {string} params.transaction_type
 * @param {string} params.exchange
 * @param {string} params.symbol
 * @param {string} params.quantity
 * @return {res}
 */
Upstox.prototype.placeOrder = function(params){

    var __this = this;
    var HTTP_METHOD = "POST";
    return RestHelper.restify("placeOrder", HTTP_METHOD, params, __this.auth);
};

/**
 * Get the orders placed
 * @method getOrders
 * @memberOf Upstox
 * @return {res}
 */
Upstox.prototype.getOrders = function(){

    var __this = this;
    var HTTP_METHOD = "GET";
    return RestHelper.restify("getOrders", HTTP_METHOD, null, __this.auth)
};

/**
 * @method modifyOrder
 * @description Modify the order by updating the order quantity
 * @memberOf Upstox
 * @param {Object} params
 * @param {number} params.order_id
 * @param {number} params.quantity
 * @return {res}
 */
Upstox.prototype.modifyOrder = function(params){

    var __this = this;
    var HTTP_METHOD = "PUT";
    return RestHelper.restify("modifyOrder", HTTP_METHOD, params, __this.auth)
};

/**
 * @method cancelOrder
 * @description Cancel the order
 * @memberOf Upstox
 * @param {object} params
 * @param {number} params.order_id
 * @return {res}
 */
Upstox.prototype.cancelOrder = function(params){

    var __this = this;
    var HTTP_METHOD = "DELETE";
    return RestHelper.restify("cancelOrder", HTTP_METHOD, params, __this.auth)
};

/**
 * @method getInstruments
 * @description Get Instruments list
 * @memberOf Upstox
 * @param [params]
 * @param {string} [params.exchange] optional name of the exchange to get specific BOD details
 * @return {res}
 */
Upstox.prototype.getInstruments = function(params){

    var __this = this;
    var HTTP_METHOD = "GET";

    return RestHelper.restify("instruments", HTTP_METHOD, params, __this.auth)

};

/**
 * @method LiveFeed
 * @description Get Instruments list
 * @memberOf Upstox
 * @param params
 * @param {string} params.exchange name of the exchange to get live feeds of.
 * @param {string} params.instrument name of the instrument to get live feeds of.
 * @param {string} [params.miniType] name of the exchange to get live feeds of.
 * @return {res}
 */
Upstox.prototype.getLiveFeeds = function(params){

    var __this = this;
    var HTTP_METHOD = "GET";

    if(!params.miniType){
        params["miniType"] = "";
    }

    return RestHelper.restify("liveFeeds", HTTP_METHOD, params, __this.auth)

};


/**
 * @method setSessionHook
 * @description set a callback hook for session (`TokenError` -- timeout, expiry etc.) errors.
 * An `access_token` (login session) can become invalid for a number of
 * reasons, but it doesn't make sense for the client to
 * try and catch it during every API call.
 *
 * A callback method that handles session errors
 * can be set here and when the client encounters
 * a token error at any point, it'll be called.
 *
 * This callback, for instance, can log the user out of the UI,
 * clear session cookies, or initiate a fresh login.
 *
 * @memberOf Upstox
 * @instance
 * @param {function} cb Callback
 */
Upstox.prototype.setSessionHook = function(cb) {
    self.sessionHook = cb;
};
module.exports.Upstox = Upstox;