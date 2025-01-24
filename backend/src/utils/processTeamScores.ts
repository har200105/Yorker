import { Transaction } from 'sequelize';
import { sequelize } from '../database';
import { UserTeamModel, UserTeamPlayerModel } from '../models/userTeam';
import { MatchModel } from '../models/match';

const processTeamScores = async (matchId: string): Promise<void> => {

    const match = await MatchModel.findByPk(matchId);
    const scoreBoard = match?.dataValues.scoreboard;

    if(!scoreBoard || !scoreBoard.length){
        return;
    }

    const transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    });
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
    } catch (error) {

    }
}

export { processTeamScores };