import Hapi from 'hapi';
import Glue from 'glue';
import path from 'path';

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
      }
    }
  },
  connections: [
    {
      port: 6678,
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
        url: 'mongodb://localhost:27017/weiner-machine'
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
      name: 'weiner-session',
      cache: {
        expiresIn: 24 * 60 * 60 * 1000
      },
      cookieOptions: {
        password: 'weiner-auth',
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
