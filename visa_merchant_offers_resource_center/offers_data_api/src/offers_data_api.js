/* ----------------------------------------------------------------------------------------------------------------------
* © Copyright 2018 Visa. All Rights Reserved.
*
* NOTICE: The software and accompanying information and documentation (together, the “Software”) remain the property of
* and are proprietary to Visa and its suppliers and affiliates. The Software remains protected by intellectual property
* rights and may be covered by U.S. and foreign patents or patent applications. The Software is licensed and not sold.
*
* By accessing the Software you are agreeing to Visa's terms of use (developer.visa.com/terms) and privacy policy
* (developer.visa.com/privacy). In addition, all permissible uses of the Software must be in support of Visa products,
* programs and services provided through the Visa Developer Program (VDP) platform only (developer.visa.com).
* THE SOFTWARE AND ANY ASSOCIATED INFORMATION OR DOCUMENTATION IS PROVIDED ON AN “AS IS,” “AS AVAILABLE,” “WITH ALL
* FAULTS” BASIS WITHOUT WARRANTY OR CONDITION OF ANY KIND. YOUR USE IS AT YOUR OWN RISK.
---------------------------------------------------------------------------------------------------------------------- */

/*jshint -W069 */
/**
 * 
 * @class offers_data_api
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var offers_data_api = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');
    var randomstring = require('randomstring');
    var expect = require('chai').expect;
    var req = request.defaults();
    var fs = require('fs');

    function offers_data_api(options) {

        if (typeof options !== 'object') {
            throw new Error('"authCredientials" object is missing. Constructor should be called with a json object');
        }

        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : 'https://sandbox.api.visa.com';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }

        var missingValues = [];

        if (options.userId) {
            this.userId = options.userId;
        } else {
            missingValues.push('userId');
        }

        if (options.userId) {
            this.password = options.password;
        } else {
            missingValues.push('password');
        }

        if (options.key) {
            this.keyFile = options.key;
        } else {
            missingValues.push('key');
        }

        if (options.cert) {
            this.certificateFile = options.cert;
        } else {
            missingValues.push('cert');
        }

        if (options.ca) {
            this.caFile = options.ca;
        } else {
            missingValues.push('ca');
        }

        if (missingValues.length > 0) {
            var errorString = missingValues.join(", ");
            if (missingValues.length === 1) {
                throw new Error(errorString + " is missing in authCredientials.");
            } else {
                throw new Error(errorString + " are missing in authCredientials.");
            }
        }
    }

    /**
     * Request for all offers
     * @method
     * @name offers_data_api#retrieveAllOffers
     * @param {string} xClientTransactionId - 
     *
     */
    offers_data_api.prototype.retrieveAllOffers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/vmorc/offers/v1/all';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            key: fs.readFileSync(this.keyFile),
            cert: fs.readFileSync(this.certificateFile),
            ca: fs.readFileSync(this.caFile),
            headers: headers,
            body: body
        };

        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                console.log("error " + JSON.stringify(error));
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });

                }
            }
        });

        return deferred.promise;
    };
    /**
     * Request for offers by an offer id
     * @method
     * @name offers_data_api#retrieveOffersByOfferId
     * @param {string} xClientTransactionId - 
     * @param {} offerid - 
     *
     */
    offers_data_api.prototype.retrieveOffersByOfferId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/vmorc/offers/v1/byofferid';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }

        if (parameters['offerid'] !== undefined) {
            queryParameters['offerid'] = parameters['offerid'];
        }
        if (parameters['offerid'] === undefined) {
            deferred.reject(new Error('Missing required  parameter from path parameters: offerid'));
            return deferred.promise;
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            key: fs.readFileSync(this.keyFile),
            cert: fs.readFileSync(this.certificateFile),
            ca: fs.readFileSync(this.caFile),
            headers: headers,
            body: body
        };

        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                console.log("error " + JSON.stringify(error));
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });

                }
            }
        });

        return deferred.promise;
    };
    /**
     * Request for offers by content id
     * @method
     * @name offers_data_api#retrieveOffersByContentId
     * @param {string} xClientTransactionId - 
     * @param {} contentid - 
     *
     */
    offers_data_api.prototype.retrieveOffersByContentId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/vmorc/offers/v1/bycontentid';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }

        if (parameters['contentid'] !== undefined) {
            queryParameters['contentid'] = parameters['contentid'];
        }
        if (parameters['contentid'] === undefined) {
            deferred.reject(new Error('Missing required  parameter from path parameters: contentid'));
            return deferred.promise;
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            key: fs.readFileSync(this.keyFile),
            cert: fs.readFileSync(this.certificateFile),
            ca: fs.readFileSync(this.caFile),
            headers: headers,
            body: body
        };

        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                console.log("error " + JSON.stringify(error));
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });

                }
            }
        });

        return deferred.promise;
    };
    /**
     * Request for offers by filter
     * @method
     * @name offers_data_api#retrieveOffersByFilter
     * @param {string} xClientTransactionId - 
     *
     */
    offers_data_api.prototype.retrieveOffersByFilter = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/vmorc/offers/v1/byfilter';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            key: fs.readFileSync(this.keyFile),
            cert: fs.readFileSync(this.certificateFile),
            ca: fs.readFileSync(this.caFile),
            headers: headers,
            body: body
        };

        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                console.log("error " + JSON.stringify(error));
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });

                }
            }
        });

        return deferred.promise;
    };

    return offers_data_api;
})();

exports.offers_data_api = offers_data_api;