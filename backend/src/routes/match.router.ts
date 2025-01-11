import express from "express";
import { getMatchesByTournament, getMatchLeaderBoard, getPlayersByMatch } from "../controller/match.controller";

const matchRouter = express.Router();

matchRouter.get('/all/:tournamentId',getMatchesByTournament);
matchRouter.get('/all-players/:matchId',getPlayersByMatch);
matchRouter.get('/leader-board/:matchId',getMatchLeaderBoard);

export default matchRouter;