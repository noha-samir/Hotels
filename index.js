var app = require('express')();
var compression = require("compression");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var async = require('async');

app.get('/', (req, res) => res.send('helloooo'));


var server = app.listen(3000, function () {
    console.log('App is listening!');
});

app.use(morgan('dev'));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//handling /api route
app.use('/api', require('./indexRoutes'));

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 400);
    res.json({
        "custom-error-code": error.code,
        "developer-message": error.developerMessage,
        "user-message": error.message,
        "additional-data": error.additionalData
    });
});

module.exports = app;