import { Transaction } from 'sequelize';
import { sequelize } from '../database';
import { UserTeamModel, UserTeamPlayerModel } from '../models/userTeam';
import { MatchModel } from '../models/match';

const processTeamScores = async (matchId: string): Promise<void> => {
    console.log("processTeamScores : ", matchId);

    const match = await MatchModel.findByPk(matchId);
    const scoreBoard = match?.dataValues.scoreboard;

    if (!scoreBoard || !scoreBoard.length) {
        console.log("its empty");
        return;
    }
    console.log(scoreBoard);

    const transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    });

    try {
        for (const playerStats of scoreBoard) {
            const { playerId, runs, wickets } = playerStats;

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

            let points = (10 * wickets) + (1 * runs);
            if (userTeamPlayer.isCaptain) {
                points *= 2;
            }
            if (userTeamPlayer.isViceCaptain) {
                points *= 1.5;
            }

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

        // Assign ranks based on pointsObtained
        const rankedTeams: any = await UserTeamModel.findAll({
            where: { matchId },
            order: [['pointsObtained', 'DESC']],
            transaction,
        });

        let currentRank = 1;
        let previousPoints = null;
        let rankToAssign = 1;

        for (const [_, team] of rankedTeams.entries()) {
            if (previousPoints !== null && team.pointsObtained < previousPoints) {
                rankToAssign = currentRank;
            }
            await UserTeamModel.update(
                { leaderBoardRank: rankToAssign },
                { where: { id: team.id }, transaction }
            );

            console.log(`Assigned Rank ${rankToAssign} to User Team ID ${team.id} with ${team.pointsObtained} points`);

            previousPoints = team.pointsObtained;
            currentRank++;
        }

        await match.update(
            { isCompleted: true, status: 'completed' },
            { transaction }
        );

        await transaction.commit();
    } catch (error) {
        console.error(`Error in processing team scores : ${error}`);
        await transaction.rollback();
    }
};

export { processTeamScores };
