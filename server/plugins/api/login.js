var Joi = require('joi');
var Hoek = require('hoek');


exports.register = function (plugin, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);

    plugin.route({
        method: ['GET', 'POST'],
        path: options.basePath + '/login',
        config: {
            auth: 'github',
            handler: function(request, reply) {
                var account = request.auth.credentials;
                var sid = account.profile.id.toString();
                request.session.set('weiner-auth', {userId: sid});
                return reply(request.session.get('weiner-auth')).redirect('#/weiner');
            }
        }
    });


    plugin.route({
      method: 'GET',
      path: options.basePath + '/weiner',
      handler: function(request, reply) {
        if(!request.session.get('weiner-auth')) {
          return reply.redirect('/');
        }
        return reply(request.session.get('weiner-auth'));
      }
    });

    next();
};


exports.register.attributes = {
    name: 'login'
};
