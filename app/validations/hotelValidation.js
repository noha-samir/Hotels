const Joi = require('joi');
var async = require('async');

//JOI validation to the input object
const searchSchema = Joi.object().keys({
    name: Joi.string().allow('').error(new Error("Hotel name must be string!!!")),
    city: Joi.string().allow('').error(new Error("City name must be string!!!")),
    lowPriceRange: Joi.number().positive().allow('').error(new Error("Price ranges must be positive numbers!!!")),
    highPriceRange: Joi.number().positive().allow('').error(new Error("Price ranges must be positive numbers!!!")),
    fromDate: Joi.date().allow('').error(new Error("fromDate must be a date!!!")),
    toDate: Joi.date().allow('').error(new Error("toDate must be a date!!!")),
    sortedByName: Joi.boolean().error(new Error("sortedByName must be a boolean value!!!")),
    sortedByPrice: Joi.boolean().error(new Error("sortedByPrice must be a boolean value!!!")),
    ascSort: Joi.boolean().error(new Error("ascSort must be a boolean value!!!"))
});

module.exports.searchByFilters = function (req, res, next) {
    async.waterfall([
        function (callback) {
            Joi.validate(req.body, searchSchema, { stripUnknown: false }, { abortEarly: true }, function (err) {
                if (!err) {
                    callback(null);
                }
                else {
                    callback(err);
                }
            });
        }
    ], function (err) {
        if (!err) {
            next();
        }
        else {
            next(err);
        }
    });

}

//*******************************************************************//