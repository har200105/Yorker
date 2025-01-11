import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { MatchModel } from "../models/match"
import { PlayerModel } from '../models/player';
import { UserModel } from '../models/user';
import { UserTeamModel, UserTeamPlayerModel } from '../models/userTeam';
import { TeamModel } from '../models/team';
import { TournamentModel } from '../models/tournament';



export const getMatchesByTournament = async (_req: Request, res: Response): Promise<void> => {
  try {
    const matches = await MatchModel.findAll({
      where: {
        tournamentId: _req.params.tournamentId,
      },
      include: [
        { model: TeamModel, as: 'teamA', attributes: ['id', 'name'] },
        { model: TeamModel, as: 'teamB', attributes: ['id', 'name'] },
        { model: TournamentModel, as: 'tournament', attributes: ['id', 'name'] },
      ],
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'An error occurred while fetching matches' });
  }
};

export const getPlayersByMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { matchId } = req.params;

        const match = await MatchModel.findOne({ where: { id: matchId }, include: [
          { model: TeamModel, as: 'teamA', attributes: ['id', 'name'] },
          { model: TeamModel, as: 'teamB', attributes: ['id', 'name'] },
          { model: TournamentModel, as: 'tournament', attributes: ['id', 'name'] },
        ], }) as any;
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

        res.status(200).json(dataResponse);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMatchLeaderBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      const matchId = req.params.id;
      const userId = req.currentUser.id;
  
      const match = await MatchModel.findByPk(matchId);
      if (!match) {
        res.status(404).json({ error: "Match with the given ID not found" });
        return;
      }
  
      const userTeams = await UserTeamModel.findAll({
        where: { matchId,userId },
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
  

      const leaderboard = userTeams.map((team) => {
        const userTeamPlayers = team.get('userTeamPlayers') as any;
        const user = team.get('user') as any;
        const totalPoints = userTeamPlayers.reduce((sum: any, player: any) => sum + player.points, 0);
  
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
  
  