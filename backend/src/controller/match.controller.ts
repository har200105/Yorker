import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { MatchModel } from "src/models/match"
import { PlayerModel } from 'src/models/player';
import { UserTeamModel } from 'src/models/userTeam';



export const getMatchesByTournament = async(_req: Request, res: Response):Promise<void> => {
    const matches = await MatchModel.findAll({
        where:{
            tournamentId:_req.params.tournamentId   
        }
    });
    res.status(200).json(matches);
}


export const getPlayersByMatch = async (_req: Request, res: Response): Promise<void> => {
    try {
        const match = await MatchModel.findOne({
            where: {
                id: _req.params.matchId
            }
        });

        if (!match) {
            res.status(404).json({
                error: "Match with given id not found"
            });
            return;
        }

        const players = await PlayerModel.findAll({
            where: {
                teamId: {
                    [Op.or]: [match.dataValues.teamAId, match.dataValues.teamBId],
                }
            }
        });

        const teamAId = match.dataValues.teamAId;
        const teamBId = match.dataValues.teamBId;

        const dataResponse: { [key: string]: any[] } = {
            [teamAId]: [],
            [teamBId]: []
        };

        players.forEach((player) => {
            const teamKey = player.dataValues.teamId === teamAId ? teamAId : teamBId;
            dataResponse[teamKey].push(player);
        });

        res.status(200).json(dataResponse);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

export const getMatchLeaderBoard = async(_req: Request,res: Response): Promise<void> => {
    
    const match = await MatchModel.findByPk(_req.params.id);
    
    if(!match){
        res.status(500).json({
            error: "Match with given id not found"
        });
        return;
    }
    
    const userTeams = await UserTeamModel.findAll({
        where:{
            matchId: match.dataValues.id
        }
    });

    res.status(200).json(userTeams);

}

