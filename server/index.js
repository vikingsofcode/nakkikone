var Hapi      = require('hapi'),
    path      = require('path');

var composeOptions = {
    relativeTo: __dirname
};

var manifest = {
  servers: [
    {
      host: 'localhost',
      port: 6678,
      options: {
        labels: ['web'],
        security: true,
        debug: {
          request: ['error']
        }
      }
    },
  ],
  plugins: {
    'bell': {},
    'hapi-auth-cookie': {},
    'visionary': {
      engines: { jade: 'jade' },
      path: path.join(__dirname, '../client/')
    },
    './plugins/auth': {},
    './plugins/api/login': { basePath: '/api' },
    './plugins/web/index': {}
  }
};

Hapi.Pack.compose(manifest, composeOptions, function(err, pack) {
  pack.start(function() {
    console.log('Hapi server started');
  });
});