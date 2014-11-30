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
            Weiner.Model.find(function (err, results) {
                if (err) {
                    return reply(err);
                }
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

          Weiner.create(doc, function (err, weiner) {
            if (err) {
              return reply(err);
            }
            return reply(weiner);
          });

        }
    });

    plugin.route({
        method: 'PUT',
        path: options.basePath + '/weiners/{id}/done',
        handler: function (request, reply) {
          var id = request.payload._id;
          var Weiner = request.server.plugins.models.Weiner;

          var update = {
            status: 'DONE'
          };

          Weiner.Model.findByIdAndUpdate(id, update, function (err, weiner) {
            if (err) {
              return reply(err);
            }
            reply(weiner);
          });
        }
    });

    next();
};


exports.register.attributes = {
    name: 'weiners'
};
