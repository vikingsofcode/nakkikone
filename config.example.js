module.exports = {
  server: {
    port: 6678
  },
  mongodb: {
    url: 'mongodb://localhost:27017/weiner-machine'
  },
  auth: {
    github: {
      password: 'weiner-auth',
      clientId: '',
      clientSecret: '',
      isSecure: false
    }
  },
  session: {
    name: 'weiner-session',
    cookiepwd: 'weiner-auth'
  }
}
