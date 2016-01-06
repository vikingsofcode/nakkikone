'use strict';

const Joi = require('joi');

const internals = {};

internals.applyRoutes = function (server, next) {

    const User = server.plugins['hapi-mongo-models'].User;
    const io = server.plugins.hapio.io;

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
            request.session.set('weiner-auth', request.pre.user);

            return reply(request.session.get('weiner-auth')).redirect('/weiner');
          }
        }
    });

    server.route({
      method: 'GET',
      path: '/weiner',
      handler: (request, reply) => {
        if (!request.session.get('weiner-auth') && !request.auth.isAuthenticated) {
          return reply({authError: true}).redirect('/');
        }



        io.emit('user:online', { user: request.session.get('weiner-auth') });

      }
    });

    server.route({
      method: 'GET',
      path: '/logout',
      handler: (request, reply) => {
        request.session.reset();

        const update = {
          online: false
        };

        const loggedUser = User.findByUserId(request.session.get('weiner-auth').userId, (err, user) => {
          if (err) {
            return err;
          }
          return user;
        })

        User.findByIdAndUpdate(loggedUser._id, update, (err, user) => {
          if (err) {
            return io.emit('user:error', err);
          }
          return io.emit('user:offline', { userOffline: user });
        });
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
