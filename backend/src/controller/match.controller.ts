import { Request, Response } from 'express';
import { Op, Sequelize } from 'sequelize';
import { MatchModel } from "../models/match"
import { PlayerModel } from '../models/player';
import { UserModel } from '../models/user';
import { UserTeamModel, UserTeamPlayerModel } from '../models/userTeam';
import { TeamModel } from '../models/team';
import { TournamentModel } from '../models/tournament';
import { publishDirectMessage } from '../queues/publisher';
import { serverChannel } from '../server';
import { client } from '../redis/redis.connection';



export const getMatchesByTournament = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    const cacheKey = `matches:tournament:${_req.params.tournamentId}`;
    const cachedMatches = await client.get(cacheKey);
    if (cachedMatches) {
      res.status(200).json(JSON.parse(cachedMatches));
      return;
    }
    const matches = await MatchModel.findAll({
      where: {
        tournamentId: _req.params.tournamentId,
      },
      include: [
        { model: TeamModel, as: 'teamA', attributes: ['id', 'name', 'logo'] },
        { model: TeamModel, as: 'teamB', attributes: ['id', 'name', 'logo'] },
        { model: TournamentModel, as: 'tournament', attributes: ['id', 'name', 'tournamentLogo'] },
      ],
      order: [
        [Sequelize.literal(`CASE WHEN "matches"."status" = 'scheduled' THEN 1 ELSE 2 END`), 'ASC'],

      ],
    });

    await client.setEx(cacheKey, 3600, JSON.stringify(matches));

    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'An error occurred while fetching matches' });
  }
};


export const getPlayersByMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    if (!client.isOpen) {
      await client.connect();
    }
    const cacheKey = `matches:players:${matchId}`;
    const cachedPayload = await client.get(cacheKey);
    if (cachedPayload) {
      res.status(200).json(JSON.parse(cachedPayload));
      return;
    }

    const match = await MatchModel.findOne({
      where: { id: matchId }, include: [
        { model: TeamModel, as: 'teamA', attributes: ['id', 'name', 'logo'] },
        { model: TeamModel, as: 'teamB', attributes: ['id', 'name', 'logo'] },
        { model: TournamentModel, as: 'tournament', attributes: ['id', 'name'] },
      ],
      raw: true,
      nest:true
    }) as any;

    console.log("match.teamA :",match.teamA);

    if (!match) {
      res.status(404).json({ error: "Match with the given ID not found" });
      return;
    }

    const { teamAId, teamBId } = match;

    const players = await PlayerModel.findAll({
      where: {
        teamId: {
          [Op.or]: [teamAId, teamBId],
        },
      },
      order: [['credits', 'DESC']],
      include: [
        { model: TeamModel, as: 'team', attributes: ['id', 'name','logo'] },
      ]
    }) as any;


    const payload = { ...match, players: players };
    client.setEx(cacheKey, 3600, JSON.stringify(payload));
    res.status(200).json(payload);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMatchLeaderBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const matchId = req.params.matchId;

    const match = await MatchModel.findByPk(matchId);
    if (!match) {
      res.status(404).json({ error: "Match with the given ID not found" });
      return;
    }

    // if(!match.dataValues.matchWonById){
    //   res.status(400).json({error: "Match is yet to be completed"});
    //   return;
    // }

    console.log("running");

    const userTeams = await UserTeamModel.findAll({
      where: { matchId },
      include: [
        {
          model: UserTeamPlayerModel,
          as: 'userTeamPlayers',
        },
        {
          model: UserModel,
          as: 'user',
        },
      ],
    });

    console.log('leader board');


    const leaderboard = userTeams.map((team) => {
      // const userTeamPlayers = team.get('userTeamPlayers') as any;
      const user = team.get('user') as any;
      const totalPoints = team.dataValues.pointsObtained ?? 0;

      return {
        teamId: team.dataValues.id,
        userName: user.username,
        totalPoints,
      };
    });

    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "An error occurred while fetching the leaderboard" });
  }
};



export const submitMatchScores = async (req: Request, res: Response): Promise<void> => {

 try{
  const matchId = req.params.matchId;
  const { scoreBoard, matchWonBy, wonByEntity, wonByQuantity, isCalledOff, isTie, tossWonBy } = req.body;

  const match = await MatchModel.findByPk(matchId);

  console.log("matcjjjjjjjh :",match);

  if (!match) {
    res.status(500).json({ error: "Match not found" });
    return;
  }

  // if(match.dataValues.status == "completed"){
  //   res.status(413).json({error: "Match is already completed"});
  //   return;
  // }

  console.log("not completed");

  await match.update({
    scoreboard: scoreBoard,
    matchWonById: matchWonBy,
    wonByEntity,
    wonByQuantity,
    isCalledOff,
    isTie,
    tossWonById: tossWonBy
  });

  console.log("saved");

  if (!scoreBoard || !Array.isArray(scoreBoard)) {
    res.status(400).json({ error: "Invalid or missing scoreBoard data" });
    return;
  }

  publishDirectMessage(
    serverChannel,
    'yorker-app',
    'process-match-scores',
    JSON.stringify({ 'matchId': matchId }),
    'Matches scores are published');

  res.status(200).json({message:"Scoreboard successfully submitted"});
 }
 catch(error){
  console.log("error :",error);
 }


};