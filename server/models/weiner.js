var Joi = require('joi');
var uuid = require('node-uuid');
var async = require('async');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

var Weiner = function () {
};

Weiner.Schema = mongoose.Schema({
    weinerFrom: {
        userid: { type: String, index: true},
        username: String
    },
    weinerTo: [{
        userid: { type: String, index: true},
        avatar: String
    }],
    content: String,
    created: Date
});

Weiner.Schema.method.validate = function(obj) {
  var schema = {
    weinerFrom: Joi.object().required().keys({
        userid: Joi.string(),
        username: Joi.string()
    }),
    weinerTo: Joi.array().required().keys({
        userid: Joi.string(),
        avatar: Joi.string()
    }),
    content: Joi.string(),
    created: Joi.date
  };
  return Joi.validate(obj, schema);
};

Weiner.Model = mongoose.model('weiners', Weiner.Schema);
Weiner.ensureIndexes = Weiner.Model.ensureIndexes();

Weiner.create = function (weiner, callback) {

    var self = this;

    async.auto({
        newWeiner: function (done, results) {
            var document = {
                weinerFrom: weiner.weinerFrom,
                weinerTo: weiner.weinerTo,
                content: weiner.content,
                created: new Date()
            };

            var weinersave = new Weiner.Model(document);
            weinersave.save(done);
        }
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        callback(null, results.newWeiner[0]);
    });
};


Weiner.findByCredentials = function (Weinername, password, callback) {

    var self = this;

    async.auto({
        Weiner: function (done) {

            var query = {
                Weinername: Weinername
            };

            Weiner.Model.findOne(query, done);
        },
        passwordMatch: ['Weiner', function (done, results) {

            if (!results.Weiner) {
                return done(null, false);
            }

            var source = results.Weiner.password;
            bcrypt.compare(password, source, done);
        }]
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        if (results.passwordMatch) {
            return callback(null, results.Weiner);
        }

        callback();
    });
};
Weiner.findByWeinername = function (Weinername, callback) {

    var query = { Weinername: Weinername };
    Weiner.Model.findOne(query, callback);
};

Weiner.findByWeinerId = function (Weinerid, callback) {
    var query = { WeinerId: Weinerid };
    Weiner.Model.findOne(query, callback);
};


module.exports = Weiner;
