import { Request, Response } from 'express';
import { TournamentModel } from '../models/tournament';

export const getAllTournaments = async (_req: Request, res: Response): Promise<void> => {
    try {
        const allTournaments = await TournamentModel.findAll({
            where:{
                isActive: true
            }
        })
        res.status(200).json(allTournaments);
    } catch (error: any) {
      res.status(500).json({
        error: 'Something went wrong'
      });
    }
};