import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import logger from './utils/logger';
import config from './utils/config';
import server, { routingControllersOptions } from './server';
import database from './utils/database';
import { setLogLevel, LogLevels } from '@typegoose/typegoose';
import { __WHOAMI__ } from './utils/whoami';
setLogLevel(LogLevels.TRACE);

async function bootstrap() {
  /* Who are we? */
  logger.info(__WHOAMI__);

  /* Setup Express Server to use Routing Controllers */
  await useExpressServer(server, routingControllersOptions);

  /* Database Connection Pool:: A Declaration */
  logger.debug('waiting for database connection');
  database;

  /* Start & Listen on HTTP Server */
  await server.listen({ port: config.PORT });
  logger.info(`Running at http://${config.HOST}:${config.PORT}`);
}

process.on('unhandledRejection', (err) => {
  if (err) {
    console.error(err);
  }
  process.exit(1);
});

bootstrap();
