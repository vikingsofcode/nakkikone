'use strict';

const Joi = require('joi');

const internals = {};

internals.applyRoutes = function (server, next) {

    const User = server.plugins['hapi-mongo-models'].User;
    const io = server.plugins.hapio.io;

    let findUsers = () => {
      User.find((err, results) => {
        if (err) {
          return io.emit('user:error', err);
        }
        return io.emit('user:list', { users: results });
      });
    }

    io.on('connection', (socket) => {
      socket.on('user:get', () => {
        findUsers();
      });
    });

    server.route({
      method: 'GET',
      path: '/weiner/profile',
      handler: (request, reply) => {
        return reply.view('Profile');
      }
    });

    next();
};


exports.register = function (server, options, next) {

    server.dependency('hapi-mongo-models', internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'user'
};
