import { Application } from 'express';
import tournamentRouter from './routes/tournament.router';
import matchRouter from './routes/match.router';
import userRouter from './routes/user.router';
import userTeamRouter from './routes/user.team.router';



export const appRoutes = (app: Application): void => {
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/tournament', tournamentRouter);
    app.use('/api/v1/match', matchRouter);
    app.use('/api/v1/user-team',userTeamRouter);

};

