var Joi = require('joi');
var uuid = require('node-uuid');
var async = require('async');
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
        avatar: String,
        userChecked: Boolean
    }],
    content: String,
    created: Date,
    status: String
});

Weiner.Schema.method.validate = function(obj) {
  var schema = {
    weinerFrom: Joi.object().required().keys({
        userid: Joi.string(),
        username: Joi.string()
    }),
    weinerTo: Joi.array().required().keys({
        userid: Joi.string(),
        avatar: Joi.string(),
        userChecked: Joi.boolean()
    }),
    content: Joi.string(),
    created: Joi.date,
    status: Joi.string()
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
                created: new Date(),
                status: weiner.status
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

Weiner.findByWeinerId = function (Weinerid, callback) {
    var query = { WeinerId: Weinerid };
    Weiner.Model.findOne(query, callback);
};



module.exports = Weiner;
