'use strict';

const Joi = require('joi');

const internals = {};

internals.applyRoutes = function (server, next) {

    const Weiner = server.plugins['hapi-mongo-models'].Weiner;
    const io = server.plugins.hapio.io;

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

        Weiner.findByIdAndUpdate(data._id, update, (err, weiner) => {
          if (err) {
            return io.emit('weiner:error', err);
          }
          return io.emit('weiner:done', { weiner: weiner });
        });
      });

      socket.on('weiner:set:checked', (data) => {
        const update = {
          weinerTo: [{
            _id: data._id,
            userid: data.userid,
            avatar: data.avatar,
            userChecked: true
          }]
        };

        Weiner.findByIdAndUpdate({_id: data._id, weinerTo: { userid: data.userid}}, update, (err, weiner) => {
          if (err) {
            return io.emit('weiner:error', err);
          }

          return io.emit('weiner:checked', { weiner: weiner });
        });

      });

    });

    server.route({
        method: 'GET',
        path: '/weiner',
        handler: (request, reply) => {
          if (!request.session.get('weiner-auth') && !request.auth.isAuthenticated) {
            return reply({ authError: true }).redirect('/'), io.emit('user:error', { authError: true });
          }

          return reply.view('App', { user: request.session.get('weiner-auth'), isAuthenticated: request.auth.isAuthenticated });
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
