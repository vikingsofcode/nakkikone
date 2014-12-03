var Joi = require('joi');
var Hoek = require('hoek');

exports.register = function (plugin, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);

    plugin.route({
        method: ['GET', 'POST'],
        path: options.basePath + '/login',
        config: {
          auth: 'github',
          pre: [{
            assign: 'user',
            method: function (request, reply) {
              var account = request.auth.credentials;
              var sid = account.profile.id.toString();
              var auth = account.profile.raw;
              var User = request.server.plugins.models.User;
              var io = request.server.plugins.hapio.io;
              User.findByUserId(sid, function (err, user) {
                if (err) {
                  return reply(err);
                }

                if (user === null) {
                  User.create(auth, function (err, created) {
                    if (err) {
                      return reply(err);
                    }
                    io.emit('event:user:create', {created: created});

                    return reply(created);
                  });
                } else {
                  return reply(user);
                }

              });
            }
          }]
        },
        handler: function(request, reply) {
          request.session.set('weiner-auth', request.pre.user);
          return reply(request.session.get('weiner-auth')).redirect('#/weiner');
        }
    });

    plugin.route({
      method: 'GET',
      path: options.basePath + '/weiner',
      handler: function(request, reply) {

        var io = request.server.plugins.hapio.io;
        if(!request.session.get('weiner-auth') && !request.auth.isAuthenticated) {
          return reply.redirect('/');
        }

        io.emit('event:user:auth', {user: request.session.get('weiner-auth')});

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
