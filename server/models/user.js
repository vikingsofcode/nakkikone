const Joi = require('joi');
const async = require('async');
const ObjectAssign = require('object-assign');
const BaseModel = require('hapi-mongo-models').BaseModel;

const User = BaseModel.extend({
    constructor: function (attrs) {
        ObjectAssign(this, attrs);
    }
});

User._collection = 'Users';

User.schema = Joi.object().keys({
  userId: Joi.number(),
  username: Joi.string().required(),
  displayName: Joi.string(),
  email: Joi.string(),
  avatar: Joi.string(),
  created: Joi.date(),
  online: Joi.boolean()
});

User.indexes = [
    { key: { 'userId': 1, unique: true } },
    { key: { 'username': 1, unique: true } },
    { key: { 'email': 1, unique: true } }
];

// Create and save User to database.
User.create = function(auth, callback) {

    const self = this;

    async.auto({
        newUser: (done) => {

            const doc = {
                userId: auth.id,
                username: auth.login,
                displayName: auth.name,
                email: auth.email,
                avatar: auth.avatar_url,
                created: new Date(),
                online: true
            };

            self.insertOne(doc, done);
        }
    }, (err, results) => {

        if (err) {
          return callback(err);
        }

        callback(null, results.newUser[0]);
    });
};

// Find user by username
User.findByUsername = function (username, callback) {

    var query = { username: username };
    this.findOne(query, callback);
};

// Find user by id
User.findByUserId = function (userid, callback) {
    var query = { userId: userid };
    this.findOne(query, callback);
};

module.exports = User;
