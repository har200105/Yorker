import { Application } from 'express';
import { healthCheck } from './controller/health.controller';
import tournamentRouter from './routes/tournament.router';
import matchRouter from './routes/match.router';
import userRouter from './routes/user.router';



export const appRoutes = (app: Application): void => {
    app.use('/health',healthCheck);
    app.use('/api/v1/user',userRouter);
    app.use('/api/v1/tournament',tournamentRouter);
    app.use('/api/v1/match',matchRouter);

    
};

