//var mysql = require('mysql');
var async = require('async');
var Helper = require('../../helper');
var Request = require("request");
var constants = require("../../constants");

function Hotel() {
    this.id = null;
    this.name = null;
    this.price = null;
    this.city = null;
    this.availability = [];
}

// get hotel info from additional URL 
Hotel.prototype.getAllHotels = function (callback) {
    Request.get({
        "url": constants.hotelsInfoURL,
    }, (error, response, body) => {
        if (error) {
            callback(error);
        }
        else {
            let responseBody = JSON.parse(body);
            if (response.statusCode == 200) {
                let hotels = responseBody.hotels;
                callback(null, hotels);
            } else {
                let error = new Error();
                error.message = "Connection Error!!!";
                error.status = responseBody.status;
                callback(error);
            }
        }
    });
};

module.exports = Hotel;
