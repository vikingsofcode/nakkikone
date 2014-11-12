var path       = require('path'),
    publicPath = path.join(__dirname, '../../../client/'),
    imgPath    = path.join(__dirname, '../../../client/media'),
    baseUrl    = '/';

exports.register = function (plugin, options, next) {

  plugin.route({
      method: 'GET',
      path: '/',
      config: {
        auth: {
          strategy: 'session',
          mode: 'try'
        },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } }
      },
      handler: function (request, reply) {
        console.log(request.auth);
        console.log(request.session);
        return reply.view('index');
      }
  });

  // Template partials
  plugin.route({
    path: baseUrl + 'views/{name}',
    method: 'GET',
    handler: function(request, reply) {
      reply.view('views/' + request.params.name);
    }
  });

  plugin.route({
    method: 'GET',
    path: baseUrl + 'public/{path*}',
    handler: {
      directory: {
          path: publicPath
      }
    }
  });

  plugin.route({
    method: 'GET',
    path: baseUrl + 'img/{path*}',
    handler: {
      directory: {
          path: imgPath
      }
    }
  });

  plugin.route({
    method: 'GET',
    path: baseUrl + 'weiner',
    config: {
      auth: 'session',
      handler: function(request, reply) {
        console.log(request);
        reply('hola!');
      }
    }
  });

  next();
};

exports.register.attributes = {
  name: 'index'
};
