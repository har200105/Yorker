import express from "express";
import { getAllTournaments } from "src/controller/tournament.controller";

const tournamentRouter = express.Router();

tournamentRouter.get('/all',getAllTournaments);

export default tournamentRouter;

