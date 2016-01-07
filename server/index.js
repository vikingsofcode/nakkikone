import Hapi from 'hapi';
import Glue from 'glue';
import path from 'path';

const config = require('../config');

const composeOptions = {
  relativeTo: __dirname
};

const manifest = {
  server: {
    debug: {
      request: ['error']
    },
    connections: {
      routes: {
        security: true
      },
      router: {
        stripTrailingSlash: true
      }
    }
  },
  connections: [
    {
      port: config.server.port,
      labels: ['web']
    }
  ],
  plugins: {
    'lout': {},
    'inert': {},
    'vision': {},
    'visionary': {
      engines: {
          jsx: require('hapi-react-views')
      },
      path: path.join(__dirname, 'views')
    },
    'hapi-mongo-models': {
      mongodb: {
        url: config.mongodb.url
      },
      models: {
        Weiner: './server/models/weiner',
        User: './server/models/user'
      },
      autoIndex: true
    },
    'hapio': {},
    'hapi-auth-cookie': {},
    'bell': {},
    'yar': {
      name: config.session.name,
      cache: {
        expiresIn: 24 * 60 * 60 * 1000
      },
      cookieOptions: {
        password: config.session.cookiepwd,
        isSecure: false
      }
    },
    './plugins/auth': {},
    './plugins/api/weiner': [{ select: ['web'] }],
    './plugins/api/login': [{ select: ['web'] }],
    './plugins/api/user': [{ select: ['web'] }],
    './plugins/web/index': [{ select: ['web'] }]
  }
};

Glue.compose(manifest, composeOptions, function (err, server) {
  if(err) {
    throw err;
  }

  server.start(() => {
    console.log('Server started');
  });
});
