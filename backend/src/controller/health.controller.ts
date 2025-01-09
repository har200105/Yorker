import { Request, Response } from 'express';

export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'unhealthy',
      error: error?.message
    });
  }
};
