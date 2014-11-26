var Joi = require('joi');
var uuid = require('node-uuid');
var async = require('async');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

var User = function () {
};

User.Schema = mongoose.Schema({
    userId: { type: Number, unique: true, index: true},
    username: { type: String, unique: true },
    displayName: String,
    email: { type: String, unique: true },
    avatar: String,
    created: Date
});

User.Schema.method.validate = function(obj) {
  var schema = {
    userId: Joi.number(),
    username: Joi.string().required(),
    displayName: Joi.string(),
    email: Joi.string(),
    avatar: Joi.string(),
    created: Joi.date()
  };
  return Joi.validate(obj, schema);
};

User.Model = mongoose.model('users', User.Schema);
User.ensureIndexes = User.Model.ensureIndexes();

User.create = function (auth, callback) {

    var self = this;

    async.auto({
        newUser: function (done, results) {
            var document = {
                userId: auth.id,
                username: auth.login,
                displayName: auth.name,
                email: auth.email,
                avatar: auth.avatar_url,
                created: new Date()
            };

            var user = new User.Model(document);
            user.save(done);
        }
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        callback(null, results.newUser[0]);
    });
};


User.findByCredentials = function (username, password, callback) {

    var self = this;

    async.auto({
        user: function (done) {

            var query = {
                username: username
            };

            User.Model.findOne(query, done);
        },
        passwordMatch: ['user', function (done, results) {

            if (!results.user) {
                return done(null, false);
            }

            var source = results.user.password;
            bcrypt.compare(password, source, done);
        }]
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        if (results.passwordMatch) {
            return callback(null, results.user);
        }

        callback();
    });
};
User.findByUsername = function (username, callback) {

    var query = { username: username };
    User.Model.findOne(query, callback);
};

User.findByUserId = function (userid, callback) {
    var query = { userId: userid };
    User.Model.findOne(query, callback);
};


module.exports = User;
