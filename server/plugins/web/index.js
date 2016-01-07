'use strict';
let path       = require('path'),
    publicPath = path.join(__dirname, '../../../build/'),
    imgPath    = path.join(__dirname, '../../../client/media'),
    baseUrl    = '/';

const config = require('../../../config');

exports.register = function (server, options, next) {

  server.route({
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        
        if (request.yar.get(config.session.name)) {
          return reply.redirect('/weiner');
        } else {
          return reply.view('Default');
        }

      }

  });

  // Template partials
  server.route({
    path: baseUrl + 'views/{name}',
    method: 'GET',
    handler: function(request, reply) {
      reply.view('views/' + request.params.name);
    }
  });

  server.route({
    method: 'GET',
    path: baseUrl + 'public/{path*}',
    handler: {
      directory: {
          path: publicPath
      }
    }
  });

  server.route({
    method: 'GET',
    path: baseUrl + 'img/{path*}',
    handler: {
      directory: {
          path: imgPath
      }
    }
  });

  next();
};

exports.register.attributes = {
  name: 'index',
  dependencies: 'visionary'
};
