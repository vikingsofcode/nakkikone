var Joi = require('joi');
var Hoek = require('hoek');


exports.register = function (plugin, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);

    //app cache to store user information once logged in.
    var cache = plugin.cache({
        expiresIn: 3 * 24 * 60 * 60 * 1000
    });
    plugin.app.cache = cache;

    //Bind the object to the plugin to be accessible in handlers
    plugin.bind({
        cache: plugin.app.cache
    });

    plugin.route({
        method: 'GET',
        path: options.basePath + '/login',
        config: {
            auth: 'github', 
            handler: function(request, reply) {
                var account = request.auth.credentials;
                var sid = account.profile.id.toString();
                //cache object bounded to the plugin is available here.
                this.cache.set(sid, {
                    account: account
                }, 0, function(err) {
                    if (err) {
                        reply(err);
                    }
                    request.auth.session.set({
                        sid: sid
                    });
                    return reply.redirect('/#/weiner');
                });
            }
        }
    });

    next();
};


exports.register.attributes = {
    name: 'login'
};
