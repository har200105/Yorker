import express from "express";
import { getAllTournaments } from "../controller/tournament.controller";

const tournamentRouter = express.Router();

tournamentRouter.get('/all',getAllTournaments);

export default tournamentRouter;

