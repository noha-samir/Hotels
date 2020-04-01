
var constants = require("./constants");

//create a comparison between the hotel name and the input hotel name
//remove all spaces and 'hotel' word and lowerCase the string to be easier for searching
//then return the condition statement
module.exports.assignNameFilter = function (filterConditions, hotelName, selectedHotelName) {

    if (filterConditions != "") {
        filterConditions = filterConditions + "&& ";
    }

    hotelName = hotelName.toLowerCase().replace(/hotel/g, '').replace(/ /g, '');
    selectedHotelName = selectedHotelName.toLowerCase().replace(/hotel/g, '').replace(/ /g, '');

    return filterConditions = filterConditions + "'" + hotelName + "'" + " == " + "'" + selectedHotelName + "' ";
};

//create a comparison between the hotel price and the input hotel price
//then return the condition statement
module.exports.assignPriceFilter = function (filterConditions, hotelPrice, selectedPriceRange, priceRangeType) {

    if (filterConditions != "") {
        filterConditions = filterConditions + "&& ";
    }
    let operation;
    if (priceRangeType == constants.lowPriceRange) {
        operation = " >= ";
    } else {
        operation = " <= ";
    }
    return filterConditions = filterConditions + hotelPrice + operation + selectedPriceRange + " ";
};

//convert date from (dd-mm-yyyy) format to new Date() formate
module.exports.dateFormater = function (inputDate) {

    var arrDate = inputDate.split("-");
    inputDate = new Date(arrDate[2], arrDate[1] - 1, arrDate[0]);

    return inputDate;
};

//compare values of varibale of every object by select and assign levels to them to be sorted 
module.exports.compareValues = function (key, ascSort) {
    if (ascSort) {
        order = 'asc';
    } else {
        order = 'desc';
    }
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}