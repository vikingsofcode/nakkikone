'use strict';

const Joi = require('joi');

const internals = {};
const config = require('../../../config');

internals.applyRoutes = function (server, next) {

    const User = server.plugins['hapi-mongo-models'].User;
    const io = server.plugins['hapi-io'].io;

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
      path: '/current-user',
      handler: (request, reply) => {

        const id = request.yar.get(config.session.name).userId;

        User.findByUserId(id, (err, user) => {
          if (err) {
            return reply(err);
          }

          if (!user) {
            return reply({ error: 'No user found lol!!' }).code(404);
          }

          return reply(user);
        })
      }
    });

    server.route({
      method: 'GET',
      path: '/weiner/profile',
      handler: (request, reply) => {

        if (request.yar.get(config.session.name)) {
          return reply.view('Profile');
        } else {
          return reply.redirect('/');
        }

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
