var async = require('async');
var Helper = require('../../helper');
var constants = require("../../constants");
var HotelModel = require('../models/hotelModel'); //for DB connections 

module.exports.searchByFilters = function (hotels, filters, sorting, finalCallback) {
    let searchResultWithIDs = [];
    let availabilities = [];
    let datesDictionary = [];
    let arrOfIDs = [];
    let searchOutput = [];
    let datesFilter = true;
    let count = 0;
    //Validate sorting choices 
    if (sorting.sortedByName && sorting.sortedByPrice) {
        let err = new Error();
        err.message = "You have to select only one sorting !!!";
        finalCallback(err);
    }
    //Get all hotels without any filtering and return these hotels with sort options
    else if (filters.hotelName == "" && filters.cityName == "" && filters.lowPriceRange == null
        && filters.highPriceRange == null && filters.fromDate == "" && filters.toDate == "") {
        //No sort option provided
        if (!sorting.sortedByName && !sorting.sortedByPrice) {
            finalCallback(null, hotels);
        }
        //Sort by name
        else if (sorting.sortedByName) {
            hotels.sort(Helper.compareValues('name', sorting.ascSort));
            finalCallback(null, hotels);
        }
        //Sort by price
        else {
            hotels.sort(Helper.compareValues('price', sorting.ascSort));
            finalCallback(null, hotels);
        }
    }
    //Get all hotels with filtering
    else {
        async.waterfall([
            //validate over price range
            function (callback) {
                if (filters.lowPriceRange != null && filters.highPriceRange != null) {
                    if (filters.lowPriceRange > filters.highPriceRange) {
                        console.log(filters.lowPriceRange, "lol", filters.highPriceRange)
                        let err = new Error();
                        err.message = "Max price range should be greater than Min price range !!!";
                        callback(err);
                    } else {
                        callback(null);
                    }
                } else {
                    callback(null);
                }
            },
            //validate over date range
            function (callback) {
                //If no dates added return no error.
                if (filters.fromDate == "" && filters.toDate == "") {
                    callback(null);
                }
                //If the two dates added check the validation of the interval then return no error.
                else if (filters.fromDate != "" && filters.toDate != "") {
                    let selectedFromDate = Helper.dateFormater(filters.fromDate);
                    let selectedToDate = Helper.dateFormater(filters.toDate);
                    if (selectedFromDate < selectedToDate) {
                        callback(null);
                    } else {
                        let err = new Error();
                        err.message = "Invalid date interval !!!";
                        callback(err);
                    }
                }
                //If one of them added and the other one didn't return error
                else {
                    let err = new Error();
                    err.message = "You can't select one date only you have to select the interval !!!";
                    callback(err);
                }
            },
            //Generate filter conditions by (name,city,price)
            //Concatinate all the available dates together sorted in availabilities array
            //Return results of first filter (name,city,price) with ID for every result in our case will be the index of the array
            function (callback) {
                async.eachSeries(hotels, function (hotelElement, nextCallback) {

                    let filterConditions = "";

                    if (filters.hotelName != "") {
                        filterConditions = Helper.assignNameFilter(filterConditions, hotelElement.name, filters.hotelName);
                    }
                    if (filters.cityName != "") {
                        filterConditions = Helper.assignNameFilter(filterConditions, hotelElement.city, filters.cityName);
                    }
                    if (filters.lowPriceRange != null) {
                        let priceRangeType = constants.lowPriceRange;
                        filterConditions = Helper.assignPriceFilter(filterConditions, hotelElement.price, filters.lowPriceRange, priceRangeType);
                    }
                    if (filters.highPriceRange != null) {
                        let priceRangeType = constants.highPriceRange;
                        filterConditions = Helper.assignPriceFilter(filterConditions, hotelElement.price, filters.highPriceRange, priceRangeType);
                    }

                    if (filterConditions == "" || eval(filterConditions)) {
                        if (filters.fromDate != "" || filters.toDate != "") {
                            availabilities = availabilities.concat(hotelElement.availability);
                        } else {
                            datesFilter = false;
                        }
                        searchResultWithIDs.push({ "index": count, "hotel": hotelElement });
                    }

                    count++;
                    nextCallback(null);

                }, function (err) {
                    callback(err);
                });
            },
            //Grouping the available dates with its hotel ID.
            function (callback) {
                if (datesFilter == true) {
                    for (let index = 0; index < searchResultWithIDs.length; index++) {
                        let lengthOfDates = searchResultWithIDs[index].hotel.availability.length;
                        let fromIndex;
                        if (datesDictionary.length == 0) {
                            fromIndex = 0
                        } else {
                            fromIndex = datesDictionary[datesDictionary.length - 1].toIndex + 1;
                        }
                        datesDictionary.push({ "fromIndex": fromIndex, "toIndex": fromIndex + lengthOfDates - 1, "ID": searchResultWithIDs[index].index });
                    }
                }
                callback(null);
            },
            //Detecting which date belongs to its hotel by assigning each cell in availabilities to its hotel ID
            function (callback) {
                if (datesFilter == true) {
                    arrOfIDs = availabilities.slice();
                    for (let index2 = 0; index2 < datesDictionary.length; index2++) {
                        arrOfIDs.fill(datesDictionary[index2].ID, datesDictionary[index2].fromIndex, datesDictionary[index2].toIndex + 1);
                    }
                }
                callback(null);
            },
            //Generate filter conditions by (dates)
            //BY getting all the IDs of the valid dates 
            function (callback) {
                let arrOfIndeces = [];

                let selectedFromDate = Helper.dateFormater(filters.fromDate);
                let selectedToDate = Helper.dateFormater(filters.toDate);

                for (let index = 0; index < availabilities.length; index++) {
                    const elementOfDateInterval = availabilities[index];
                    let availableFromDate = Helper.dateFormater(elementOfDateInterval.from);
                    let availableToDate = Helper.dateFormater(elementOfDateInterval.to);
                    if (selectedFromDate >= availableFromDate
                        && selectedFromDate <= availableToDate
                        && selectedToDate >= availableFromDate
                        && selectedToDate <= availableToDate) {
                        arrOfIndeces.push(index);
                    }
                }
                callback(null, arrOfIndeces);
            },
            //Detecting which ID belongs to which hotel then return the result
            function (arrOfIndeces, callback) {
                if (datesFilter == true) {
                    for (let index3 = 0; index3 < arrOfIndeces.length; index3++) {
                        const element = arrOfIndeces[index3];
                        searchOutput.push(hotels[arrOfIDs[element]]);
                    }
                } else {
                    for (let index3 = 0; index3 < searchResultWithIDs.length; index3++) {
                        const element = searchResultWithIDs[index3];
                        searchOutput.push(element.hotel);
                    }
                }
                callback(null, searchOutput);
            },
            //Sort results
            function (searchOutput, callback) {
                //No sort option provided
                if (!sorting.sortedByName && !sorting.sortedByPrice) {
                    callback(null, searchOutput);
                }
                //Sort by name 
                else if (sorting.sortedByName) {
                    searchOutput.sort(Helper.compareValues('name', sorting.ascSort));
                    callback(null, searchOutput);
                }
                //Sort by price
                else {
                    searchOutput.sort(Helper.compareValues('price', sorting.ascSort));
                    callback(null, searchOutput);
                }
            }
        ], function (err, searchOutput) {
            finalCallback(err, searchOutput);
        });
    }
};