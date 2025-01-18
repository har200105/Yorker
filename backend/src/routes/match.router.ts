import express from "express";
import { getMatchesByTournament, getMatchLeaderBoard, getPlayersByMatch, submitMatchScores } from "../controller/match.controller";

const matchRouter = express.Router();

matchRouter.get('/all/:tournamentId',getMatchesByTournament);
matchRouter.get('/all-players/:matchId',getPlayersByMatch);
matchRouter.get('/leader-board/:matchId',getMatchLeaderBoard);
matchRouter.post('/submit-scores/:matchId',submitMatchScores);

export default matchRouter;