'use strict';

const Joi = require('joi');

const internals = {};

internals.applyRoutes = function (server, next) {

    const Weiner = server.plugins['hapi-mongo-models'].Weiner;
    const io = server.plugins.hapio.io;

    io.on('connection', (socket) => {

      socket.on('weiner:create', (data) => {
        Joi.validate(data, Weiner.schema, (err) => {
            if (err) {
              return io.emit('weiner:error', err);
            }

            Weiner.create(data, function (err, weiner) {
              if (err) {
                return io.emit('weiner:error', err);
              }
              return io.emit('weiner:saved', {weiner: weiner});
            });
        });
      });


    });

    // plugin.route({
    //     method: 'GET',
    //     path: options.basePath + '/weiners',
    //     handler: function (request, reply) {
    //         var Weiner = request.server.plugins.models.Weiner;
    //         var io = request.server.plugins.hapio.io;
    //         Weiner.Model.find(function (err, results) {
    //             if (err) {
    //                 return reply(err);
    //             }
    //             // Emit results to listers
    //             io.emit('event:weiner:get', {weiners: results});
    //             io.on('event:weiner:save', function(socket) {
    //               socket.emit('event:weiner:get', {weiners: results});
    //             });
    //
    //             io.on('event:weiner:done', function(socket) {
    //               socket.emit('event:weiner:get', {weiners: results});
    //             });
    //
    //             io.on('event:weiner:check', function(socket) {
    //               socket.emit('event:weiner:get', {weiners: results});
    //             });
    //
    //             reply(results);
    //         });
    //     }
    // });
    //
    // plugin.route({
    //     method: 'POST',
    //     path: options.basePath + '/weiners',
    //     handler: function (request, reply) {
    //       var doc = request.payload;
    //       var Weiner = request.server.plugins.models.Weiner;
    //       var io = request.server.plugins.hapio.io;
    //       Weiner.create(doc, function (err, weiner) {
    //         if (err) {
    //           return reply(err);
    //         }
    //         io.emit('event:weiner:save', {weiner: weiner});
    //         return reply(weiner);
    //       });
    //
    //     }
    // });
    //
    // plugin.route({
    //     method: 'PUT',
    //     path: options.basePath + '/weiners/{id}/done',
    //     handler: function (request, reply) {
    //       var id = request.payload._id;
    //       var Weiner = request.server.plugins.models.Weiner;
    //       var io = request.server.plugins.hapio.io;
    //       var update = {
    //         status: 'DONE'
    //       };
    //
    //       Weiner.Model.findByIdAndUpdate(id, update, function (err, weiner) {
    //         if (err) {
    //           return reply(err);
    //         }
    //         io.emit('event:weiner:done', {weiner: weiner});
    //         reply(weiner);
    //       });
    //     }
    // });
    //
    // plugin.route({
    //     method: 'PUT',
    //     path: options.basePath + '/weiners/{id}/check',
    //     handler: function (request, reply) {
    //       var id = request.params.id;
    //       var Weiner = request.server.plugins.models.Weiner;
    //       var io = request.server.plugins.hapio.io;
    //       var update = {
    //         weinerTo: [{
    //           _id: request.payload[0]._id,
    //           userid: request.payload[0].userid,
    //           avatar: request.payload[0].avatar,
    //           userChecked: true
    //         }]
    //       };
    //
    //       Weiner.Model.findByIdAndUpdate({_id: id, weinerTo: {userid: request.payload[0].userid}}, update, function (err, weiner) {
    //         if (err) {
    //           return reply(err);
    //         }
    //
    //         io.emit('event:weiner:check', {weiner: weiner});
    //         reply(weiner);
    //       });
    //     }
    // });


    next();
};


exports.register = function (server, options, next) {

    server.dependency('hapi-mongo-models', internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'weiners'
};
