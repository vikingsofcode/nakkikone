'use strict';

const Joi = require('joi');

const internals = {};
const config = require('../../../config');

internals.applyRoutes = function (server, next) {

    const User = server.plugins['hapi-mongo-models'].User;
    const io = server.plugins['hapi-io'].io;

    server.route({
      method: ['GET', 'POST'],
        path: '/login',
        config: {
          auth: 'github',
          pre: [{
            assign: 'user',
            method: (request, reply) => {
              let account = request.auth.credentials;
              let sid = account.profile.id;
              let auth = account.profile.raw;

              User.findByUserId(sid, (err, user) => {
                if (err) {
                  return reply('Error finding user:', err);
                }

                if (user === null) {
                  User.create(auth, (err, created) => {
                    if (err) {
                      return reply('Error creating a new user:', err);
                    }

                    return io.emit('user:created', { newUser: created }), reply(created);
                  })
                } else {
                  return reply(user);
                }
              });
            }
          }],
          handler: (request, reply) => {
            request.yar.set(config.session.name, request.pre.user);

            return reply(request.yar.get(config.session.name)).redirect('/weiner');
          }
        }
    });

    server.route({
      method: 'POST',
      path: '/logout',
      config: {
        plugins: {
          'hapi-io': 'disconnect'
        }
      },
      handler: (request, reply) => {
        const loggedUser = request.yar.get(config.session.name)._id;

        const update = {
          online: false
        };

        User.findByIdAndUpdate(loggedUser, { $set: update }, (err, user) => {
          if (err) {
            return io.emit('user:error', err);
          }
          return io.emit('user:offline', { userOffline: user });
        });

        request.yar.reset();
        return reply.redirect('/');
      }
    });


    next();
};


exports.register = function (server, options, next) {

    server.dependency(['yar', 'hapi-mongo-models'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'login'
};
