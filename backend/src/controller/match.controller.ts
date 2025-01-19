import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { MatchModel } from "../models/match"
import { PlayerModel } from '../models/player';
import { UserModel } from '../models/user';
import { UserTeamModel, UserTeamPlayerModel } from '../models/userTeam';
import { TeamModel } from '../models/team';
import { TournamentModel } from '../models/tournament';
import { sequelize } from '../database';
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
      console.log('Returning cached matches');
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
      console.log('Returning cached players');
      res.status(200).json(JSON.parse(cachedPayload));
      return;
    }

    const match = await MatchModel.findOne({
      where: { id: matchId }, include: [
        { model: TeamModel, as: 'teamA', attributes: ['id', 'name', 'logo'] },
        { model: TeamModel, as: 'teamB', attributes: ['id', 'name', 'logo'] },
        { model: TournamentModel, as: 'tournament', attributes: ['id', 'name'] },
      ],
    }) as any;

    if (!match) {
      res.status(404).json({ error: "Match with the given ID not found" });
      return;
    }

    const { teamAId, teamBId } = match.dataValues;
    const teamA = match.dataValues.teamA;
    const teamB = match.dataValues.teamB;

    const players = await PlayerModel.findAll({
      where: {
        teamId: {
          [Op.or]: [teamAId, teamBId],
        },
      },
      order: [['credits', 'DESC']],
      include: [
        { model: TeamModel, as: 'team', attributes: ['id', 'name'] },
      ]
    }) as any;

    const dataResponse = players.reduce((acc: any, player: any) => {
      const teamKey = player.dataValues.team.name;
      if (!acc[teamKey]) {
        acc[teamKey] = [];
      }
      acc[teamKey].push(player);
      return acc;
    }, { [teamA.name]: [], [teamB.name]: [] } as { [key: string]: any[] });

    const payload = { matchId: match.id, matchName: match.name, date: match.date, teamA: match.teamA, teamB: match.teamB, venue: match.venue, players: dataResponse };
    client.setEx(cacheKey,3600,JSON.stringify(payload));
    res.status(200).json(payload);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMatchLeaderBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const matchId = req.params.matchId;
    console.log(req.currentUser);
    const userId = req.currentUser.id;
    console.log(userId);

    const match = await MatchModel.findByPk(matchId);
    if (!match) {
      res.status(404).json({ error: "Match with the given ID not found" });
      return;
    }

    // if(!match.dataValues.matchWonById){
    //   res.status(400).json({error: "Match is yet to be completed"});
    //   return;
    // }

    const userTeams = await UserTeamModel.findAll({
      where: { matchId, userId },
      include: [
        {
          model: UserTeamPlayerModel,
          as: 'user_team_players',
        },
        {
          model: UserModel,
          as: 'user',
        },
      ],
    });


    const leaderboard = userTeams.map((team) => {
      console.log(team);
      const userTeamPlayers = team.get('user_team_players') as any;
      const user = team.get('user') as any;
      const totalPoints = userTeamPlayers.reduce((sum: any, player: any) => sum + player.points, 0);

      return {
        teamId: team.dataValues.id,
        userName: user.username,
        totalPoints,
      };
    });

    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    console.log(leaderboard);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "An error occurred while fetching the leaderboard" });
  }
};



export const submitMatchScores = async (req: Request, res: Response): Promise<void> => {

  const matchId = req.params.matchId;
  const { scoreBoard,matchWonBy,wonByEntity,wonByQuantity,isCalledOff,isTie,tossWonBy } = req.body; 

  const match = await MatchModel.findByPk(matchId);

  if(!match){
    res.status(500).json({error: "Message not found"}); 
    return;
  }

  publishDirectMessage(serverChannel, 
    'yorker-app',
    'process-match-scores',
    JSON.stringify({ type: 'getSellers', 'count':1 }),
    'Matches scores are published');

  await match.update({
    scoreboard:scoreBoard,
    matchWonById:matchWonBy,
    wonByEntity,
    wonByQuantity,
    isCalledOff,
    isTie,
    tossWonById: tossWonBy
  });

  if (!scoreBoard || !Array.isArray(scoreBoard)) {
    res.status(400).json({ error: "Invalid or missing scoreBoard data" });
    return;
  }

  const transaction = await sequelize.transaction();
  try {

    for (const playerStats of scoreBoard) {
      const { id: playerId, runs, wickets } = playerStats;

      if (!playerId || runs === undefined || wickets === undefined) {
        throw new Error(`Invalid data for player: ${JSON.stringify(playerStats)}`);
      }

      const userTeamPlayer: any = await UserTeamPlayerModel.findOne({
        where: { playerId },
        transaction,
      });

      if (!userTeamPlayer) {
        throw new Error(`Player with ID ${playerId} not found`);
      }

      const userTeamId = userTeamPlayer.userTeamId;

      const userTeam = await UserTeamModel.findOne({
        where: { id: userTeamId, matchId },
        transaction,
      });

      if (!userTeam) {
        throw new Error(`Player with ID ${playerId} does not belong to match ID ${matchId}`);
      }

      const points = ((10 * wickets) + (1 * runs));

      await UserTeamPlayerModel.update(
        { runs, wickets, points },
        { where: { id: userTeamPlayer.id }, transaction }
      );

      console.log(`Updated Player ID ${playerId} -> Runs: ${runs}, Wickets: ${wickets}, Points: ${points}`);
    }

    const userTeams: any = await UserTeamModel.findAll({ where: { matchId }, transaction });

    for (const userTeam of userTeams) {
      const userTeamId = userTeam.id;

      const totalPoints = await UserTeamPlayerModel.sum('points', {
        where: { userTeamId },
        transaction,
      });

      await UserTeamModel.update(
        { pointsObtained: totalPoints, isScoredComputed: true },
        { where: { id: userTeamId }, transaction }
      );

      console.log(`Updated User Team ID ${userTeamId} -> Total Points: ${totalPoints}`);
    }

    await transaction.commit();
    res.status(200).json({ message: "Scores and points calculated successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error calculating scores:", error);
    res.status(500).json({ error: "An error occurred while calculating scores" });
  }
};