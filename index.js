'use strict';

const debug = require('debug')('mark-openapi-docs');

function uncaughtExceptionHandler(error) {
    console.log('Process Exiting - Uncaught Exception');
    console.log(error);
    process.exit(1);
}

function uncaughtRejectionHandler(error) {
    console.log('Process Exiting - Uncaught Rejection');
    console.log(error);
    process.exit(1);
}

const sigbreakHandler = () => {
    console.log('Process Exiting - SIGBREAK');
    console.log(error);
    process.exit(1);
};

// global exception handler
process.on('uncaughtException', uncaughtExceptionHandler);

// Enable to crash on errors eaten by promises
process.on('unhandledRejection', uncaughtRejectionHandler);

// exit handler
process.on('SIGBREAK', sigbreakHandler);

/**
 * Module dependencies.
 */
const app = require('./app');
const http = require('http');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.emit('ready');
console.log('**ready**');

/**
 * Initalize Socket
 */
// const socket = require('./lib/socket/socket');
// new socket.ClientSocket(server);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ?
        `Pipe ${port}` :
        `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ?
        `pipe ${addr}` :
        `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}

module.exports = server;