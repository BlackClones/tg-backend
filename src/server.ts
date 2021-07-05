/* Imports for Server Bootstrap: reflect metadata must be imported at top */
import 'reflect-metadata';
import cors from 'cors';
import express, { Response, Request, NextFunction } from 'express';
import { getMetadataArgsStorage, RoutingControllersOptions } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUiExpress from 'swagger-ui-express';
import helmet from 'helmet';

/* App Utils, Controllers and Middlewares */
import { LoggerMiddleware, HttpErrorHandler } from './middlewares';

import { swaggerSpecOptions } from './utils/swaggerConfig';
import config from './utils/config';

/* API Routes, Middlewares and Controllers */
const routeControllerOptions: RoutingControllersOptions = {
  controllers: [],
  middlewares: [LoggerMiddleware, HttpErrorHandler],
  defaultErrorHandler: false,
  routePrefix: `${config.API_VERSION}`,
  //   cors: {
  //   "origin": "http://localhost,https://localhost,https://*",
  //   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  //   "preflightContinue": true,
  //   "optionsSuccessStatus": 204
  // },
};

const server = express();

/* Parse routing-controllers classes into OpenAPI spec: */
const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage, routeControllerOptions, {
  ...swaggerSpecOptions,
});

/* --- Custom Settings for Express, add policies and config parameters on init --- */
server.set('secret', config.SECRET_KEY);
server.use(helmet());
server.use(cors());

server.use(function (_req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // If needed
  if ('OPTIONS' == _req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

/* Use root path for documentation */
server.use('/dev-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
server.use('/docs', (_req: Request, res: Response) => {
  /* Parse routing-controllers classes into OpenAPI spec: */
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, routeControllerOptions, {
    ...swaggerSpecOptions,
  });
  res.set({ 'Access-Control-Allow': '*' });
  res.set({ 'Access-Control-Allow-Origin': '*' });
  res.status(200).json(spec);
});

/* Root UI & API Routes [swagger docs, healthcheck] */
server.use('/_healthcheck', (_req: Request, res: Response) => {
  res.status(200).json({ uptime: process.uptime() });
});

export default server;
export { routeControllerOptions };
