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
            request.session.set('weiner-auth', 
              { 
                userId: sid,
                username: account.profile.username, 
                displayName: account.profile.displayName, 
                email: account.profile.email,
                avatar: account.profile.raw.avatar_url
            });
            return reply(request.session.get('weiner-auth')).redirect('#/weiner');
          }
        }
    });

    plugin.route({
      method: 'GET',
      path: options.basePath + '/weiner',
      handler: function(request, reply) {
        if(!request.session.get('weiner-auth') && !request.auth.isAuthenticated) {
          return reply.redirect('/');
        }
        return reply(request.session.get('weiner-auth'));
      }
    });

    plugin.route({
      method: 'GET',
      path: options.basePath + '/logout',
      handler: function(request, reply) {
        request.session.reset();
        return reply.redirect('/');
      }
    });


    next();
};


exports.register.attributes = {
    name: 'login'
};
