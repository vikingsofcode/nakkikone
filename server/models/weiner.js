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
        userid: Joi.string().required(),
        username: Joi.string().required()
    }),
    weinerTo: Joi.array().items(Joi.object().keys({
      userid: Joi.string().required(),
      avatar: Joi.string().required(),
      userChecked: Joi.boolean().required()
    })),
    content: Joi.string(),
    created: Joi.date(),
    status: Joi.string()
});

Weiner.indexes = [
    { key: { 'weinerFrom.userid': 1, unique: true } },
    { key: { 'weinerTo.userid': 1, unique: true } }
];


module.exports = Weiner;
