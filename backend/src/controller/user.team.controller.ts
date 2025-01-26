import { Request, Response } from 'express';
import { MatchModel } from '../models/match';
import { PlayerModel } from '../models/player';
import { UserTeamModel, UserTeamPlayerModel } from '../models/userTeam';
import { Op } from 'sequelize';
import { TeamModel } from '../models/team';

export const createUserTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const matchId = req.params.matchId;
    const { players, captainId, viceCaptainId } = req.body;

    const match = await MatchModel.findByPk(matchId);

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    if (!players || players.length !== 11) {
      res.status(400).json({ error: "11 players are required to create a team" });
      return;
    }

    const foundPlayers = await PlayerModel.findAll({
      where: {
        id: {
          [Op.in]: players,
        },
      },
    });

    if (foundPlayers.length !== 11) {
      res.status(400).json({ error: "Some players are invalid or not found" });
      return;
    }

    const teamAId = match.dataValues.teamAId;
    const teamBId = match.dataValues.teamBId;
    let teamACount = 0;
    let teamBCount = 0;

    foundPlayers.forEach((player) => {
      if (player.dataValues.teamId === teamAId) {
        teamACount++;
      } else if (player.dataValues.teamId === teamBId) {
        teamBCount++;
      }
    });

    if (teamACount > 7 || teamBCount > 7) {
      res.status(400).json({ error: "Each team can have a maximum of 7 players" });
      return;
    }


    if (!players.includes(captainId) || !players.includes(viceCaptainId)) {
      res.status(400).json({ error: "Captain and Vice-Captain must be part of the team" });
      return;
    }

    if (captainId === viceCaptainId) {
      res.status(400).json({ error: "Captain and Vice-Captain cannot be the same player" });
      return;
    }


    const userTeam = await UserTeamModel.create({
      userId: req.currentUser.id,
      matchId,
    });

    const teamPlayers = foundPlayers.map((player) => ({
      userTeamId: userTeam.dataValues.id,
      playerId: player.dataValues.id,
      isCaptain: player.dataValues.id === captainId,
      isViceCaptain: player.dataValues.id === viceCaptainId,
      points: 0,
    }));

    await UserTeamPlayerModel.bulkCreate(teamPlayers);

    res.status(201).json({ message: "Team created successfully", userTeam });
  } catch (error) {
    console.error("Error creating user team:", error);
    res.status(500).json({ error: "An error occurred while creating the team" });
  }
};

export const getUserTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const userTeams = await UserTeamModel.findAll({
      where: {
        userId: req.currentUser.id,
      },
      include: [
        {
          model: UserTeamPlayerModel,
          as: 'userTeamPlayers',
          include: [
            {
              model: PlayerModel,
            },
          ],
        },
        {
          model: MatchModel,
          as: 'match'
        }
      ],
    });

    res.status(200).json({ userTeams });
  } catch (error) {
    console.error("Error fetching user teams:", error);
    res.status(500).json({ error: "An error occurred while fetching user teams" });
  }
};

export const getUserTeamsByMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const matchId = req.params.matchId;

    const userTeams = await UserTeamModel.findAll({
      where: {
        matchId,
        userId: req.currentUser.id,
      },
      raw:true,
      nest:true,
      include: [
        {
          model: MatchModel,
          include: [
            { model: TeamModel, as: 'teamA', attributes: ['id', 'name', 'logo'] },
            { model: TeamModel, as: 'teamB', attributes: ['id', 'name', 'logo'] },
          ]
        }
      ]
    });

    const response = await Promise.all(userTeams.map(async(userTeam: any) =>{ 
      const captain = await UserTeamPlayerModel.findOne({
        raw:true,
        nest:true,
        where:{
          isCaptain: true,
          userTeamId: userTeam.id
        },
        include:[
          {
            model: PlayerModel,
            include:[
              {
                model:TeamModel
              }
            ]
          }
        ],
        
      }) as any;

      const viceCaptain = await UserTeamPlayerModel.findOne({
        raw:true,
        nest:true,
        where:{
          isViceCaptain: true,
          userTeamId: userTeam.id
        },
        include:[
          {
            model: PlayerModel,
            include:[
              {
                model:TeamModel
              }
            ]
          }
        ],
        
      }) as any;


      userTeam.captain = captain.player;
      userTeam.viceCaptain = viceCaptain.player;
      return userTeam;
    }));

    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user teams for the match:", error);
    res.status(500).json({ error: "An error occurred while fetching user teams for the match" });
  }
};


export const getPlayersByTeamId = async (req: Request, res: Response): Promise<void> => {
  const userTeam = await UserTeamModel.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: MatchModel,
      },
      {
        model: UserTeamPlayerModel,
        as: 'userTeamPlayers', 
        include: [
          {
            model: PlayerModel,
            include:[
              {
                model:TeamModel
              }
            ]
          },
        ],
      },
    ],
  }) as any;

  // Rename 'userTeamPlayers' to 'players' in the response
  const response = {
    ...userTeam?.toJSON(),
    players: userTeam?.userTeamPlayers,  // Rename here
  };

  // Delete the old 'userTeamPlayers' field to avoid duplication
  delete response.userTeamPlayers;

  res.status(200).json(response);
};
