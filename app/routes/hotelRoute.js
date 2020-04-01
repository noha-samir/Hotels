var router = require('express').Router();
var hotelController = require('../controllers/hotelController');
var hotelValidation = require('../validations/hotelValidation');

//Our search API
router.post('/search', hotelValidation.searchByFilters, hotelController.controllerSearchByFilters);

module.exports = router;