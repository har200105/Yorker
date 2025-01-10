import express from "express";
import { createUserTeam, getUserTeams, getUserTeamsByMatch } from "src/controller/user.team.controller";

const userTeamRouter = express.Router();

userTeamRouter.get('/',getUserTeams);

userTeamRouter.get('/:matchId',getUserTeamsByMatch);

userTeamRouter.post('/create',createUserTeam);



export default userTeamRouter;