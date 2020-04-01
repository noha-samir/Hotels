var async = require('async');
var HotelRepo = require('../repositories/hotelRepository');
var Hotel = require('../models/hotelModel');

module.exports.controllerSearchByFilters = function (req, res, next) {

    let filters = {
        "hotelName": req.body.name,
        "cityName": req.body.city,
        "lowPriceRange": Number(req.body.lowPriceRange),
        "highPriceRange": Number(req.body.highPriceRange),
        "fromDate": req.body.fromDate,
        "toDate": req.body.toDate
    };

    let sorting = {
        "sortedByName": req.body.sortedByName,
        "sortedByPrice": req.body.sortedByPrice,
        "ascSort": req.body.ascSort
    };

    async.waterfall([
        // get all hotels
        function (callback) {
            let aHotel = new Hotel();
            aHotel.getAllHotels(function (err, arrOfHotels) {
                callback(err, arrOfHotels);
            });
        },
        // send all these hotels , filters and sortings to hotels repository to do some logic
        function (hotels, callback) {
            HotelRepo.searchByFilters(hotels, filters, sorting, function (err, returnedObject) {
                callback(err, returnedObject);
            });
        }
    ], function (err, returnedObject) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json(returnedObject);
        }
    });
};