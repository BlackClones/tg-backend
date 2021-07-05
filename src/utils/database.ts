import mongoose from 'mongoose';
import config from './config';
import logger from './logger';

mongoose.connect(config.mongoUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  dbName: config.dbName,
  useFindAndModify: false,
  useCreateIndex: true,
});

const database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error'));
database.once('open', () => {
  logger.debug('connected to local database');
});

export default database;
