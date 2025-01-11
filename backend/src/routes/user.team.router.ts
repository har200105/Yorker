import express from "express";
import { createUserTeam, getUserTeams, getUserTeamsByMatch } from "../controller/user.team.controller";

const userTeamRouter = express.Router();

userTeamRouter.get('/all',getUserTeams);
userTeamRouter.post('/create/:matchId',createUserTeam);
userTeamRouter.get('/match/:matchId',getUserTeamsByMatch);


export default userTeamRouter;