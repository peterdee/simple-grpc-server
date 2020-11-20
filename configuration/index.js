const { env: environment = {} } = process;

module.exports = {
  DATABASE_CONNECTION_STRING: environment.DATABASE_CONNECTION_STRING || '',
  ENVS: {
    development: 'development',
    heroku: 'heroku',
    production: 'production',
  },
  ENV: environment.ENV || this.ENVS.development,
  PORT: Number(environment.PORT) || 6844,
};
