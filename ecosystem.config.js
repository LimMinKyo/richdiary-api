module.exports = {
  apps: [
    {
      name: 'richdiary-api',
      script: 'dist/main.js',
      instances: 0,
      exec_mode: 'cluster',
    },
  ],
};
