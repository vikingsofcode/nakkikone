'use strict';

const Joi = require('joi');

const internals = {};

internals.applyRoutes = function (server, next) {

    const io = server.plugins.hapio.io;

    server.route({
      method: ['GET', 'POST'],
        path: '/login',
        config: {
          auth: 'github',
          pre: [{
            assign: 'user',
            method: function (request, reply) {
              console.log(request.auth);
              return reply(request.auth);
            }
          }],
          handler: function(request, reply) {
            console.log(request.pre.user);
            request.session.set('weiner-auth', request.pre.user);

            return reply(request.session.get('weiner-auth')).redirect('/weiner');
          }
        }
    })

    server.route({
      method: 'GET',
      path: '/weiner',
      handler: function(request, reply) {
        console.log("made to weiners");
      }
    })


    next();
};


exports.register = function (server, options, next) {

    server.dependency(['yar'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'login'
};
