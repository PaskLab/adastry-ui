module.exports = {
  apps: [
    {
      name: 'adastry.io',
      script: 'node build/index.js',
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production'
      },
      env_dev: {
        NODE_ENV: 'development'
      },
      out_file: './output.log',
      error_file: './error.log',
      time: true //prefix logs with standard formated timestamp
    }
  ]
};
