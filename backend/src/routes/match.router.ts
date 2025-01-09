import express from "express";
import { getMatchesByTournament, getPlayersByMatch } from "src/controller/match.controller";

const matchRouter = express.Router();

matchRouter.get('all/:tournamentId',getMatchesByTournament);
matchRouter.get('all-players/:matchId',getPlayersByMatch);


export default matchRouter;