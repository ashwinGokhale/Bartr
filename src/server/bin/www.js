/**
 * Module dependencies.
 */

import { app as server } from '../app'
// var app = require('../app');
var debug = require('debug')('server:server');
import * as functions from 'firebase-functions';

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
  let port = parseInt(val, 10);
  
  // named pipe
  if (isNaN(port)) return val;

  // port number
  if (port >= 0) return port;

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
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
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

server.on('error', onError);
server.on('listening', onListening);

export const bartr = functions.https.onRequest(server);
