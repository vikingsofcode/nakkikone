'use strict';

const Joi = require('joi');

const internals = {};
const config = require('../../../config');

import _ from 'lodash';

internals.applyRoutes = function (server, next) {

    const Weiner = server.plugins['hapi-mongo-models'].Weiner;
    const User = server.plugins['hapi-mongo-models'].User;
    const io = server.plugins['hapi-io'].io;

    let findWeiners = () => {
      Weiner.find((err, results) => {
        if (err) {
          return io.emit('weiner:error', err);
        }
        return io.emit('weiner:list', { weiners: results });
      });
    }

    io.on('connection', (socket) => {

      socket.on('weiner:create', (data) => {
        Joi.validate(data, Weiner.schema, (err) => {
          if (err) {
            return io.emit('weiner:error', err);
          }

          Weiner.create(data, (err, weiner) => {
            if (err) {
              return io.emit('weiner:error', err);
            }
            findWeiners();
          });
        });
      });

      socket.on('weiner:get', () => {
        findWeiners();
      });

      socket.on('weiner:set:done', (data) => {
        const update = {
          status: 'DONE'
        };

        Weiner.findByIdAndUpdate(data._id, { $set: update }, (err, weiner) => {
          if (err) {
            return io.emit('weiner:error', err);
          }
          return io.emit('weiner:done', { weiner: weiner });
        });
      });

      socket.on('weiner:set:checked', (data) => {

        Weiner.findById(data.id, (err, weiner) => {
          if (err) {
            return io.emit('weiner:error', err);
          }

          let index = _.findIndex(weiner.weinerTo, { 'userId': data.checkedWeiner.userId });

          weiner.weinerTo[index].userChecked = true;

          Weiner.updateWeinerTo(weiner, (err, savedWeiner) => {
            if (err) {
              return (err);
            }

              return io.emit('weiner:checked', { weiner: savedWeiner }), findWeiners();
          })

        });


      });

    });

    server.route({
        method: 'GET',
        path: '/weiner',
        config: {
          plugins: {
            'hapi-io': 'connection:online'
          }
        },
        handler: (request, reply) => {

          if (!request.yar.get(config.session.name)) {
            return reply({ authError: true }).redirect('/'), io.emit('user:error', { authError: true });
          }

          const loggedUser = request.yar.get(config.session.name)._id;

          const update = {
            online: true
          };

          User.findByIdAndUpdate(loggedUser, { $set: update }, (err, user) => {
            if (err) {
              return io.emit('user:error', err);
            }
            return io.emit('user:online', { userOnline: user });
          });

          return reply.view('App', { user: request.yar.get(config.session.name) });
        }
    });

    next();
};


exports.register = function (server, options, next) {

    server.dependency('hapi-mongo-models', internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'weiners'
};
