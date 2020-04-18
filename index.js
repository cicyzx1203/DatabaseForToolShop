'use strict'

const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({port: 3000, host: 'localhost'});

const routes = require('./routes');


for (var route in routes) {
    server.route(routes[route]);
}


server.start((err) => {

  if (err) {
    throw err
  }
  console.log(`Server running at: ${server.info.uri}`)
});