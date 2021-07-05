import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import logger from './utils/logger';
import config from './utils/config';
import server, { routeControllerOptions } from './server';
import database from './utils/database';
import { setLogLevel, LogLevels } from '@typegoose/typegoose';
setLogLevel(LogLevels.TRACE);

async function bootstrap() {
  /* Setup Express Server to use Routing Controllers */
  await useExpressServer(server, routeControllerOptions);

  /* Database Connection Pool:: A Declaration */
  logger.debug('waiting for database connection');
  await database;

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
