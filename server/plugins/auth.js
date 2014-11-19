var bell = require('bell');


exports.register = function (plugin, options, next) {
        plugin.auth.strategy('github', 'bell', {
            provider: 'github',
            password: 'weiner-auth',
            clientId: '1867816b74ff75a9a504',
            clientSecret: '66c0a60a8507d103069190529b9b78b21430f9ce',
            isSecure: false
          });

    next();
};


exports.register.attributes = {
    name: 'auth'
};
