var Joi = require('joi');
var Hoek = require('hoek');
var authPlugin = require('../auth');


exports.register = function (plugin, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);
    
    plugin.route({
        method: 'GET',
        path: options.basePath + '/weiners',
        handler: function (request, reply) {
            var Weiner = request.server.plugins.models.Weiner;
            var io = request.server.plugins.hapio.io;
            Weiner.Model.find(function (err, results) {
                if (err) {
                    return reply(err);
                }

                io.emit('event:weiner:get', {weiners: results});
                io.on('event:weiner:save', function(socket) {
                  socket.emit('event:weiner:get', {weiners: results});
                });
                reply(results);
            });
        }
    });

    plugin.route({
        method: 'POST',
        path: options.basePath + '/weiners',
        handler: function (request, reply) {
          var doc = request.payload;
          var Weiner = request.server.plugins.models.Weiner;
          var io = request.server.plugins.hapio.io;
          Weiner.create(doc, function (err, weiner) {
            if (err) {
              return reply(err);
            }
            io.emit('event:weiner:save', {weiner: weiner});
            return reply(weiner);
          });

        }
    });

    plugin.route({
        method: 'PUT',
        path: options.basePath + '/weiners/{id}/checked',
        handler: function (request, reply) {
          var id = request.payload._id;
          var Weiner = request.server.plugins.models.Weiner;
          var io = request.server.plugins.hapio.io;
          var update = {
            status: 'DONE'
          };

          Weiner.Model.findByIdAndUpdate(id, update, function (err, weiner) {
            if (err) {
              return reply(err);
            }
            io.emit('event:weiner:done', {weiner: weiner});
            reply(weiner);
          });
        }
    });

    plugin.route({
        method: 'PUT',
        path: options.basePath + '/weiners/{id}/check',
        handler: function (request, reply) {
          var id = request.params.id;
          var Weiner = request.server.plugins.models.Weiner;
          var io = request.server.plugins.hapio.io;
          var update = {
            weinerTo: [{
              _id: request.payload[0]._id,
              userid: request.payload[0].userid,
              avatar: request.payload[0].avatar,
              userChecked: request.payload[0].userChecked
            }]
          };

          Weiner.Model.findByIdAndUpdate({_id: id, weinerTo: {userid: request.payload[0].userid}}, update, function (err, weiner) {
            if (err) {
              return reply(err);
            }

            io.emit('event:weiner:check', {weiner: weiner});
            reply(weiner);
          });
        }
    });

    next();
};


exports.register.attributes = {
    name: 'weiners'
};
