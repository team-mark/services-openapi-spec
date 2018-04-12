'use strict';

const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
// const logger = require('morgan');
// const bodyParser = require('body-parser');
// const session = require('express-session');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'web_deploy')));

// app.use('/', routes);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'web_deploy/index.html'));
});

/**
 * Configure remaining app middleware to catch 404s
 */

app.use((req, res) => {
    res.sendStatus(404);
});

/** 
 * Configure application error handlers
 */

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res) => {
        res.status(err.status || 500);
        res.send({
            errorType: err.message,
            errors: { err }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send({
        errorType: 'Internal Server Error'
    });
});

module.exports = app;
