import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { MatchModel } from "src/models/match"
import { PlayerModel } from 'src/models/player';
import { UserModel } from 'src/models/user';
import { UserTeamModel, UserTeamPlayerModel } from 'src/models/userTeam';



export const getMatchesByTournament = async(_req: Request, res: Response):Promise<void> => {
    const matches = await MatchModel.findAll({
        where:{
            tournamentId:_req.params.tournamentId   
        }
    });
    res.status(200).json(matches);
}


export const getPlayersByMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { matchId } = req.params;

        const match = await MatchModel.findOne({ where: { id: matchId } });
        if (!match) {
            res.status(404).json({ error: "Match with the given ID not found" });
            return;
        }

        const { teamAId, teamBId } = match.dataValues;

        const players = await PlayerModel.findAll({
            where: {
                teamId: {
                    [Op.or]: [teamAId, teamBId],
                },
            },
        });

        const dataResponse = players.reduce((acc, player) => {
            const teamKey = player.dataValues.teamId;
            if (!acc[teamKey]) {
                acc[teamKey] = [];
            }
            acc[teamKey].push(player);
            return acc;
        }, { [teamAId]: [], [teamBId]: [] } as { [key: string]: any[] });

        res.status(200).json(dataResponse);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMatchLeaderBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      const matchId = req.params.id;
  
      const match = await MatchModel.findByPk(matchId);
      if (!match) {
        res.status(404).json({ error: "Match with the given ID not found" });
        return;
      }
  
      const userTeams = await UserTeamModel.findAll({
        where: { matchId },
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
  
      res.status(200).json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "An error occurred while fetching the leaderboard" });
    }
  };
  
  