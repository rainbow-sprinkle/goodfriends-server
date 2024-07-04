module.exports = {
    apps : [{
      name: 'user.api',
      script: '/home/user/server/dist/server.js',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'user.client',
      script: '/home/user/client/server.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}

// NODE_ENV: 'development'
// NODE_ENV: 'production'