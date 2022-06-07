// import LeaderBoard from '../interfaces/LeaderBoard';
import sequelize = require('sequelize');
import Match from '../models/match';
import ILeaderBoard from '../interfaces/leaderBoard';
import Team from '../models/teams';

// Mentoria particular do Yan Brasileiro - Fera demais!
const QUERYES_SEQUIELIZE_LITERALS_HOME = {
  // cast() converte do tipo original para o tipo especificado apos os "as"
  query1: `cast(SUM(CASE 
    WHEN home_team_goals > away_team_goals THEN 3 
    WHEN home_team_goals < away_team_goals THEN 0
    ELSE 1 END) as UNSIGNED INTEGER)`,
  query2: 'cast(COUNT(home_team) as UNSIGNED INTEGER)',
  query3: `cast(SUM(CASE WHEN home_team_goals > away_team_goals THEN 1 ELSE 0 END)
   as UNSIGNED INTEGER)`,
  query4: `cast(SUM(CASE WHEN home_team_goals = away_team_goals THEN 1 ELSE 0 END)
   as UNSIGNED INTEGER)`,
  query5: `cast(SUM(CASE WHEN home_team_goals < away_team_goals THEN 1 ELSE 0 END)
   as UNSIGNED INTEGER)`,
  query6: 'cast(SUM(home_team_goals) as UNSIGNED INTEGER)',
  query7: 'cast(SUM(away_team_goals) as UNSIGNED INTEGER)',
  query8: 'cast(cast((SUM(home_team_goals) - SUM(away_team_goals)) as UNSIGNED INTEGER) as SIGNED)',
};

const QUERYES_SEQUIELIZE_LITERALS_AWAY = {
  // cast() converte do tipo original para o tipo especificado apos os "as"
  query1: `cast(SUM(CASE 
    WHEN away_team_goals > home_team_goals THEN 3 
    WHEN away_team_goals < home_team_goals THEN 0
    ELSE 1 END) as UNSIGNED INTEGER)`,
  query2: 'cast(COUNT(away_team) as UNSIGNED INTEGER)',
  query3: `cast(SUM(CASE WHEN home_team_goals < away_team_goals THEN 1 ELSE 0 END)
   as UNSIGNED INTEGER)`,
  query4: `cast(SUM(CASE WHEN home_team_goals = away_team_goals THEN 1 ELSE 0 END)
   as UNSIGNED INTEGER)`,
  query5: `cast(SUM(CASE WHEN home_team_goals > away_team_goals THEN 1 ELSE 0 END)
   as UNSIGNED INTEGER)`,
  query6: 'cast(SUM(away_team_goals) as UNSIGNED INTEGER)',
  query7: 'cast(SUM(home_team_goals) as UNSIGNED INTEGER)',
  query8: 'cast(cast((SUM(away_team_goals) - SUM(home_team_goals)) as UNSIGNED INTEGER) as SIGNED)',
};

function sortByPoints(a: ILeaderBoard, b: ILeaderBoard): number {
  let pointsDiference = b.totalPoints - a.totalPoints;
  if (pointsDiference === 0) {
    pointsDiference = b.totalVictories - a.totalVictories;
    if (pointsDiference === 0) {
      pointsDiference = b.goalsBalance - a.goalsBalance;
      if (pointsDiference === 0) {
        pointsDiference = b.goalsFavor - a.goalsFavor;
        if (pointsDiference === 0) {
          pointsDiference = b.goalsOwn - a.goalsOwn;
        }
      }
    }
  }
  return pointsDiference;
}

export default class LeaderBoardService {
  private matchModel;

  constructor() {
    this.matchModel = Match;
  }

  public async leaderBoardHome(): Promise<ILeaderBoard[]> {
    const matchResponse = await this.matchModel
      .findAll({ where: { inProgress: false },
        // atributo 'include' para fazer um pseudo 'JOIN' com o model, e assim a query funcione! quando é executada
        include: { model: Team, as: 'teamHome', attributes: { exclude: ['id', 'teamName'] } },
        attributes: [
          // sequilize subquery permite introduzir queryes padronizadas
          // https://sequelize.org/docs/v6/other-topics/sub-queries/
          [sequelize.literal('team_name'), 'name'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_HOME.query1), 'totalPoints'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_HOME.query2), 'totalGames'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_HOME.query3), 'totalVictories'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_HOME.query4), 'totalDraws'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_HOME.query5), 'totalLosses'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_HOME.query6), 'goalsFavor'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_HOME.query7), 'goalsOwn'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_HOME.query8), 'goalsBalance'],
        ],
        group: ['home_team'] });
    const response = matchResponse.map((m) => m.dataValues);
    return response as unknown as ILeaderBoard[];
  }

  public async orderBoardHome() {
    const result = await this.leaderBoardHome();
    const vaiSerSorteado = result.map((team) => (
      { ...team,
        efficiency: JSON.parse(
          ((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2),
        ) })) as unknown as ILeaderBoard[];

    return vaiSerSorteado
      .sort(sortByPoints);
  }

  public async leaderBoardAway(): Promise<ILeaderBoard[]> {
    const matchResponse = await this.matchModel
      .findAll({ where: { inProgress: false },
        include: { model: Team, as: 'teamAway', attributes: { exclude: ['id', 'teamName'] } },
        attributes: [
          // sequilize subquery permite introduzir queryes padronizadas
          // https://sequelize.org/docs/v6/other-topics/sub-queries/
          [sequelize.literal('team_name'), 'name'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_AWAY.query1), 'totalPoints'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_AWAY.query2), 'totalGames'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_AWAY.query3), 'totalVictories'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_AWAY.query4), 'totalDraws'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_AWAY.query5), 'totalLosses'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_AWAY.query6), 'goalsFavor'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_AWAY.query7), 'goalsOwn'],
          [sequelize.literal(QUERYES_SEQUIELIZE_LITERALS_AWAY.query8), 'goalsBalance'],
        ],
        group: ['away_team'] });
    const response = matchResponse.map((m) => m.dataValues);
    return response as unknown as ILeaderBoard[];
  }

  public async orderBoardAway() {
    const result1 = await this.leaderBoardAway();
    const vaiSerSorteadoAway = result1.map((teamAway) => (
      { ...teamAway,
        efficiency: JSON.parse(
          ((teamAway.totalPoints / (teamAway.totalGames * 3)) * 100).toFixed(2),
        ) })) as unknown as ILeaderBoard[];

    return vaiSerSorteadoAway
      .sort(sortByPoints);
  }
}
