var bell = require('bell');


exports.register = function (plugin, options, next) {

    //app cache to store user information once logged in.
    var cache = plugin.cache({
        expiresIn: 3 * 24 * 60 * 60 * 1000
    });
    plugin.app.cache = cache;

    //Bind the object to the plugin to be accessible in handlers
    plugin.bind({
        cache: plugin.app.cache
    });
    

        plugin.auth.strategy('github', 'bell', {
            provider: 'github',
            password: 'hapiauth',
            isSecure: false,
            clientId: '1867816b74ff75a9a504',
            clientSecret: '66c0a60a8507d103069190529b9b78b21430f9ce'
          });

        plugin.auth.strategy('session', 'cookie', {
          password: 'hapiauth', // give any string you think is right password to encrypted
          cookie: 'sid-hapiauth', // cookie name to use, usually sid-<appname>
          redirectTo: '/#/weiner',
          isSecure: false,
          validateFunc: function(session, callback) {
              cache.get(session.sid, function(err, cached) {

                  if (err) {
                      return callback(err, false);
                  }

                  if (!cached) {
                      return callback(null, false);
                  }
                  console.log(session);
                  console.log(callback);
                  return callback(null, true, cached.item.account);
              });
          }
      });

    next();
};


exports.register.attributes = {
    name: 'auth'
};
