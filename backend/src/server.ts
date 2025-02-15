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
import { appRoutes } from './routes';
import { Channel } from 'amqplib';
import { associate } from './models';
import { UserModel } from './models/user';
import { createConnection } from './queues/connection';
import { subscribeMessages } from './queues/subscriber';
import { config } from './config';

const SERVER_PORT = 4002;
const log: Logger = winstonLogger('yorkerServer', 'debug');

export let serverChannel: Channel;
let httpServer: http.Server;

declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
  }
}

process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('SIGTERM', async () => {
  log.info('SIGTERM signal received. Closing server gracefully...');
  await shutdown();
});

process.on('SIGINT', async () => {
  log.info('SIGINT signal received. Closing server gracefully...');
  await shutdown();
});

async function shutdown() {
  try {
    if (serverChannel) {
      await serverChannel.close();
      log.info('AMQP Channel closed');
    }
    if (httpServer) {
      httpServer.close(() => {
        log.info('HTTP server closed');
        process.exit(0);
      });
    }
  } catch (error) {
    log.error('Error during shutdown:', error);
    process.exit(1);
  }
}

export function start(app: Application): void {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
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
      origin: "*",
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
  app.use(async (req: Request, _res: Response, next: NextFunction) => {
    if (req?.headers?.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = verify(token, config.ACCESS_TOKEN_SECRET_KEY!) as any;
        const user = await UserModel.findByPk(payload.id, {
          attributes: { exclude: ['password'] },
          raw: true
        });
        req.currentUser = user;
      } catch (error) {
        log.error('JWT Verification Error:', error);
      }
    }
    next();
  });
  app.use('/health', (_req: Request, res: Response): void => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
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
  try {
    serverChannel = await createConnection() as Channel;
    await subscribeMessages(serverChannel);
  } catch (error) {
    log.error('Error initializing queues:', error);
  }
}

function errorHandler(app: Application): void {
  app.use((error: any, _req: Request, res: Response, next: NextFunction) => {
    log.error(`${error.comingFrom}:`, error);
    res.status(error.statusCode || 500).json({ error: error.message });
    next();
  });
}

function startServer(app: Application): void {
  try {
    httpServer = new http.Server(app);
    log.info(`Server has started with process ID ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.error('Error starting server:', error);
  }
}