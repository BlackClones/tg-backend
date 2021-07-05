import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import { RoutingControllersOptions } from 'routing-controllers';

import * as swaggerUiExpress from 'swagger-ui-express';

import config from './utils/config';
import { HttpErrorHandler } from './middlewares/error.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthController } from './app/controllers/auth.controller';
import swaggerConfig from './utils/swaggerConfig';

const server = express();

const routingControllersOptions: RoutingControllersOptions = {
  routePrefix: config.API_VERSION,
  cors: true,
  defaultErrorHandler: false,
  controllers: [AuthController],
  middlewares: [HttpErrorHandler, LoggerMiddleware],
};

// server.use(function (_req: Request, res: Response, next: NextFunction) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
//   res.setHeader('Access-Control-Allow-Credentials', 'true'); // If needed
//   if ('OPTIONS' == _req.method) {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });

server.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerConfig));

// Render spec on root:
server.get('/', (_req, res) => {
  res.json(swaggerConfig);
});

server.use(helmet());
server.use(cors());

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

export default server;
export { routingControllersOptions };
