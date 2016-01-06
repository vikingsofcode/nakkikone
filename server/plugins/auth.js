'use strict';

const internals = {};


internals.applyStrategy = function (server, next) {

  server.auth.strategy('github', 'bell', {
    provider: 'github',
    password: 'weiner-auth',
    clientId: '1867816b74ff75a9a504',
    clientSecret: '66c0a60a8507d103069190529b9b78b21430f9ce',
    isSecure: false
  });

  next();
}

exports.register = function(server, options, next) {
  server.dependency('bell', internals.applyStrategy);

  next();
}

exports.register.attributes = {
  name: 'auth'
};
