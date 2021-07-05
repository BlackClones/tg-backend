const dev = {
  serviceName: 'Authenticator Microservice',
  mongoUri: 'mongodb://127.0.0.1:27017',
  // mongoUri: 'mongodb://admin:secret@0.0.0.0:27017',
  AMQP_URI: 'amqps://exar:suppersecret@b-bcac0242-2868-4e5f-9b32-a9315da3fae1.mq.eu-west-2.amazonaws.com/',
  // AMQP_URI: 'amqps://b-33f76d48-18c9-4f37-a5ac-3797903f5ace-1.mq.eu-west-2.amazonaws.com:5671',
  PORT: 5000,
  HOST: 'http://localhost',
  API_VERSION: '/v1',
  TEST_API_PREFIX: '/test',
  SECRET_KEY: 'H^sh0utEveryFvck!n9N!gha',
  JWT_ISSUER: 'https://api.worldtreeconsulting.com/authorizer',
  JWT_AUD: 'https://api.worldtreeconsulting.com',
  JWT_ALGO: 'HS256',
  TOKEN_EXPIRE: 4.32e7,
  SUPERADMIN_TOKEN: 'SVzF3Ykc5NVpXVWlMREFzTVpTeDFjR1JoZEdVc1pHVnNaWFJszVVHRjViV1Z1Z',
};

const prod = {
  ...dev,
  //mongoUri: 'mongodb://wapp1-fargate-nlb-6e6740013066db9f.elb.eu-west-2.amazonaws.com:27017',
  mongoUri: 'mongodb://services.dev.worldtreeconsulting.com:27017',
};

const environment = {
  test: dev,
  local: dev,
  development: dev,
  production: prod,
};

export default environment[process.env.NODE_ENV as 'development' | 'production'];
