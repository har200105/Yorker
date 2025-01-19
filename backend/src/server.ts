import http from 'http';
import 'express-async-errors';
import { winstonLogger } from './shared/logger';
import { Logger } from 'winston';
import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
// import { checkConnection } from './shared/elasticsearch';
import { appRoutes } from './routes';
import { Channel } from 'amqplib';
import { config } from './config';
import { associate } from './models';
import { UserModel } from './models/user';
import { createConnection } from './queues/connection';
import { subscribeMessages } from './queues/subscriber';


const SERVER_PORT = 4002;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'yorkerServer', 'debug');

export let serverChannel: Channel;

declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
  }
}


export function start(app: Application): void {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  // startElasticSearch();
  errorHandler(app);
  startServer(app);
  associate();
}

function securityMiddleware(app: Application): void {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: config.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
  app.use(async (req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      console.log("here")
      const token = req.headers.authorization.split(' ')[1];
      const payload = verify(token, "your_access_token_secret") as any;
      const user = await UserModel.findByPk(payload.id, {
        attributes: { exclude: ['password'] },
        raw: true
      });
      req.currentUser = user;
      console.log(user);
    }
    next();
  });
  app.use('/health', (_req: Request, res: Response): void => {
    try {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'unhealthy',
        error: error?.message
      });
    }
  });
}

function standardMiddleware(app: Application): void {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
}

function routesMiddleware(app: Application): void {
  appRoutes(app);
}

async function startQueues(): Promise<void> {
  serverChannel = await createConnection() as Channel;
  await subscribeMessages(serverChannel);
}

// function startElasticSearch(): void {
//   checkConnection();
// //   createIndex('matches');
// }

function errorHandler(app: Application): void {
  app.use((error: any, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `${error.comingFrom}:`, error);
    res.status(error.statusCode).json(error.serializeErrors());
    next();
  });
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'startServer() method error:', error);
  }
}