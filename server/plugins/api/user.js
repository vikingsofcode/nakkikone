var Joi = require('joi');
var Hoek = require('hoek');
var authPlugin = require('../auth');


exports.register = function (plugin, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);

    plugin.route({
        method: 'GET',
        path: options.basePath + '/users',
        handler: function (request, reply) {
            var User = request.server.plugins.models.User;
            User.Model.find(function (err, results) {
                if (err) {
                    return reply(err);
                }
                reply(results);
            });
        }
    });

    plugin.route({
        method: 'GET',
        path: options.basePath + '/users/{id}',
        config: {
            auth: 'github'
        },
        handler: function (request, reply) {

            var User = request.server.plugins.models.User;

            User.findById(request.params.id, function (err, user) {

                if (err) {
                    return reply(err);
                }

                if (!user) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply(user);
            });
        }
    });


    plugin.route({
        method: 'GET',
        path: options.basePath + '/users/my',
        config: {
            auth: 'github'
        },
        handler: function (request, reply) {

            var User = request.server.plugins.models.User;
            var id = request.auth.credentials.user._id.toString();
            var fields = User.fieldsAdapter('username email roles');

            User.findById(id, fields, function (err, user) {

                if (err) {
                    return reply(err);
                }

                if (!user) {
                    return reply({ message: 'Document not found. That is strange.' }).code(404);
                }

                reply(user);
            });
        }
    });


    plugin.route({
        method: 'POST',
        path: options.basePath + '/users',
        config: {
            auth: 'github',
            validate: {
                payload: {
                    username: Joi.string().token().required(),
                    password: Joi.string().required(),
                    email: Joi.string().email().required()
                }
            },
            pre: [
                {
                    assign: 'usernameCheck',
                    method: function (request, reply) {

                        var User = request.server.plugins.models.User;
                        var conditions = {
                            username: request.payload.username
                        };

                        User.findOne(conditions, function (err, user) {

                            if (err) {
                                return reply(err);
                            }

                            if (user) {
                                var response = {
                                    message: 'Username already in use.'
                                };

                                return reply(response).takeover().code(409);
                            }

                            reply(true);
                        });
                    }
                }, {
                    assign: 'emailCheck',
                    method: function (request, reply) {

                        var User = request.server.plugins.models.User;
                        var conditions = {
                            email: request.payload.email.toLowerCase()
                        };

                        User.findOne(conditions, function (err, user) {

                            if (err) {
                                return reply(err);
                            }

                            if (user) {
                                var response = {
                                    message: 'Email already in use.'
                                };

                                return reply(response).takeover().code(409);
                            }

                            reply(true);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            var User = request.server.plugins.models.User;
            var username = request.payload.username;
            var password = request.payload.password;
            var email = request.payload.email;

            User.create(username, password, email, function (err, user) {

                if (err) {
                    return reply(err);
                }

                reply(user);
            });
        }
    });


    plugin.route({
        method: 'PUT',
        path: options.basePath + '/users/{id}',
        config: {
            auth: 'github',
            validate: {
                payload: {
                    isActive: Joi.boolean().required(),
                    username: Joi.string().token().required(),
                    email: Joi.string().email().required()
                }
            },
            pre: [
                {
                    assign: 'usernameCheck',
                    method: function (request, reply) {

                        var User = request.server.plugins.models.User;
                        var conditions = {
                            username: request.payload.username,
                            _id: { $ne: User._idClass(request.params.id) }
                        };

                        User.findOne(conditions, function (err, user) {

                            if (err) {
                                return reply(err);
                            }

                            if (user) {
                                var response = {
                                    message: 'Username already in use.'
                                };

                                return reply(response).takeover().code(409);
                            }

                            reply(true);
                        });
                    }
                }, {
                    assign: 'emailCheck',
                    method: function (request, reply) {

                        var User = request.server.plugins.models.User;
                        var conditions = {
                            email: request.payload.email.toLowerCase(),
                            _id: { $ne: User._idClass(request.params.id) }
                        };

                        User.findOne(conditions, function (err, user) {

                            if (err) {
                                return reply(err);
                            }

                            if (user) {
                                var response = {
                                    message: 'Email already in use.'
                                };

                                return reply(response).takeover().code(409);
                            }

                            reply(true);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            var User = request.server.plugins.models.User;
            var id = request.params.id;
            var update = {
                $set: {
                    isActive: request.payload.isActive,
                    username: request.payload.username,
                    email: request.payload.email.toLowerCase()
                }
            };

            User.findByIdAndUpdate(id, update, function (err, user) {

                if (err) {
                    return reply(err);
                }

                reply(user);
            });
        }
    });


    plugin.route({
        method: 'PUT',
        path: options.basePath + '/users/my',
        config: {
            auth: 'github',
            validate: {
                payload: {
                    username: Joi.string().token().required(),
                    email: Joi.string().email().required()
                }
            },
            pre: [{
                assign: 'usernameCheck',
                method: function (request, reply) {

                    var User = request.server.plugins.models.User;
                    var conditions = {
                        username: request.payload.username,
                        _id: { $ne: request.auth.credentials.user._id }
                    };

                    User.findOne(conditions, function (err, user) {

                        if (err) {
                            return reply(err);
                        }

                        if (user) {
                            var response = {
                                message: 'Username already in use.'
                            };

                            return reply(response).takeover().code(409);
                        }

                        reply(true);
                    });
                }
            }, {
                assign: 'emailCheck',
                method: function (request, reply) {

                    var User = request.server.plugins.models.User;
                    var conditions = {
                        email: request.payload.email.toLowerCase(),
                        _id: { $ne: request.auth.credentials.user._id }
                    };

                    User.findOne(conditions, function (err, user) {

                        if (err) {
                            return reply(err);
                        }

                        if (user) {
                            var response = {
                                message: 'Email already in use.'
                            };

                            return reply(response).takeover().code(409);
                        }

                        reply(true);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            var User = request.server.plugins.models.User;
            var id = request.auth.credentials.user._id.toString();
            var update = {
                $set: {
                    username: request.payload.username,
                    email: request.payload.email
                }
            };
            var options = {
                fields: User.fieldsAdapter('username email')
            };

            User.findByIdAndUpdate(id, update, options, function (err, user) {

                if (err) {
                    return reply(err);
                }

                reply(user);
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'users'
};
