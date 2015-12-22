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
