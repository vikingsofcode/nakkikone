var mongoose = require('mongoose');

exports.register = function (plugin, options, next) {

    var models = {
      User: require('../models/user'),
      Weiner: require('../models/weiner')
    };

    var db = mongoose.connection;

    mongoose.connect('mongodb://localhost/weiner-machine');

    db.on('error', console.error.bind(console, 'mongo connection error:'));

    db.once('open', function () {
      Object.keys(models).forEach(function (model) {
          plugin.expose(model, models[model]);
      });
      next();
    });

};


exports.register.attributes = {
    name: 'models'
};