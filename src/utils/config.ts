const dev = {
  mongoUri: 'mongodb://127.0.0.1:27017',
  PORT: 5000,
  HOST: 'http://127.0.0.1:5000',
  API_VERSION: '/api/v1',
  TEST_API_PREFIX: '/test',
  JWT_SECRET: 'H^sh0utEveryFvck!n9N!gha',
  SECRET_KEY: 'asdfkaosdjfaskdf',
  JWT_ISSUER: 'http://localhost:5000',
  TOKEN_EXPIRE: 4.32e7,
  VERF_EXPIRE: '4h',
  dbName: 'Signup',
  supportEmailConfig: {
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'noreply@tuagye.com',
      pass: 'Serwaah1@',
    },
  },
};

const prod = {
  ...dev,
  mongoUri: `mongodb+srv://evans:vanilla@devtuagye.g99dv.mongodb.net/${dev.dbName}?retryWrites=true&w=majority`,
  host: 'https://tuagye.com',
};

const environment = {
  test: dev,
  development: dev,
  production: prod,
};

export default environment[process.env.NODE_ENV as 'development' | 'production'];
