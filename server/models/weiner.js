const Joi = require('joi');
const async = require('async');
const ObjectAssign = require('object-assign');
const BaseModel = require('hapi-mongo-models').BaseModel;

const Weiner = BaseModel.extend({
    constructor: function (attrs) {
        ObjectAssign(this, attrs);
    }
});

Weiner._collection = 'weiners';

Weiner.schema = Joi.object().keys({
    _id: Joi.object(),
    weinerFrom: Joi.object().keys({
        userId: Joi.number().required(),
        username: Joi.string().required()
    }).required(),
    weinerTo: Joi.array().items(Joi.object().keys({
      userId: Joi.number().required(),
      avatar: Joi.string().required(),
      userChecked: Joi.boolean().required()
    })).required(),
    content: Joi.string(),
    created: Joi.date(),
    status: Joi.number()
});

Weiner.indexes = [
    { key: { 'weinerFrom.userId': 1, unique: true } },
    { key: { 'weinerTo.userId': 1, unique: true } }
];

// Create and save weiner to database.
Weiner.create = function(weiner, callback) {

    const self = this;

    async.auto({
        newWeiner: (done) => {

            const doc = {
                weinerFrom: weiner.weinerFrom,
                weinerTo: weiner.weinerTo,
                content: weiner.content,
                created: new Date(),
                status: weiner.status
            };

            self.insertOne(doc, done);
        }
    }, (err, results) => {

        if (err) {
          return callback(err);
        }

        callback(null, results.newWeiner[0]);
    });
};

// Get weiner by id.
Weiner.findByWeinerId = function(weinerId, callback) {
    const query = { _id: weinerId };
    this.findOne(query, callback);
};

Weiner.updateWeinerTo = function(weiner, callback) {
  this.updateOne({_id: weiner._id}, {$set: { weinerTo: weiner.weinerTo }}, callback);
}

module.exports = Weiner;
