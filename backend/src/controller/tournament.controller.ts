import { Request, Response } from 'express';
import { TournamentModel } from '../models/tournament';
import { client } from '../redis/redis.connection';

export const getAllTournaments = async (_req: Request, res: Response): Promise<void> => {
    try {
      if (!client.isOpen) {
        await client.connect();
      }
      const cacheKey = `tournaments:all`;
      const cachedTournaments = await client.get(cacheKey);
      if (cachedTournaments) {
        res.status(200).json(JSON.parse(cachedTournaments));
        return;
      }
      const allTournaments = await TournamentModel.findAll({
            where:{
                isActive: true
            }
        })
      client.setEx(cacheKey,3600,JSON.stringify(allTournaments));
      res.status(200).json(allTournaments);
    } catch (error: any) {
      res.status(500).json({
        error: 'Something went wrong'
      });
    }
};