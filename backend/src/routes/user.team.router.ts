import express from "express";
import { createUserTeam, getPlayersByTeamId, getUserTeams, getUserTeamsByMatch } from "../controller/user.team.controller";

const userTeamRouter = express.Router();

userTeamRouter.get('/all',getUserTeams);
userTeamRouter.post('/create/:matchId',createUserTeam);
userTeamRouter.get('/match/:matchId',getUserTeamsByMatch);
userTeamRouter.get('/players/:id',getPlayersByTeamId);


export default userTeamRouter;