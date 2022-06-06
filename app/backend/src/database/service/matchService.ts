import ErrorCode from '../interfaces/Error';
import IMatch from '../interfaces/Match';
import Match from '../models/match';
import Team from '../models/teams';

export default class MatchService {
  private matchModel;

  private teamModel;

  constructor() {
    this.matchModel = Match;
    this.teamModel = Team;
  }

  public async findAll(): Promise<Match[]> {
    const matches = await this.matchModel.findAll({ include: [{
      model: this.teamModel,
      as: 'teamHome',
      attributes: ['teamName'],
    },
    {
      model: this.teamModel,
      as: 'teamAway',
      attributes: ['teamName'],
    }],
    attributes: { exclude: ['home_team', 'away_team'] },
    });
    return matches as Match[];
  }

  public async filterByQuery(param: string): Promise<Match[]> {
    const toBoolean = JSON.parse(param);
    const filteredMatches = await this.matchModel.findAll({ where: { inProgress: toBoolean },
      include: [{
        model: Team,
        as: 'teamHome',
        attributes: ['teamName'],
      },
      {
        model: Team,
        as: 'teamAway',
        attributes: ['teamName'],
      }],
      attributes: { exclude: ['home_team', 'away_team'] },
    });

    return filteredMatches as Match[];
  }

  public async create(newMatch: IMatch): Promise<IMatch | ErrorCode> {
    // if (newMatch.inProgress === false) {
    //   const errorPayload = new ErrorCode('Can not save an "in progress" match', 401);
    //   return (errorPayload);
    // }
    const team1 = await this.teamModel.findOne({ where: { id: newMatch.homeTeam } });
    const team2 = await this.teamModel.findOne({ where: { id: newMatch.awayTeam } });
    if (!team1 || !team2) {
      const errorPayload = new
      ErrorCode('There is no team with such id!', 404);
      return (errorPayload);
    }
    const createdMatch = await this.matchModel.create(newMatch);
    return createdMatch;
  }

  public async inProgressUpdate(id: number): Promise<ErrorCode | boolean> {
    const response = await this.matchModel.findOne({ where: { id } });
    if (!response) {
      const errorPayload = new ErrorCode('Match not found', 401);
      return (errorPayload);
    }

    await this.matchModel.update({ inProgress: false }, { where: { id } });
    return true;
  }

  public async matchScoreUpdate(id: number, body: Partial<IMatch>): Promise<ErrorCode | void> {
    const response = await this.matchModel.findOne({ where: { id } });
    if (!response) {
      const errorPayload = new ErrorCode('Match not found', 401);
      return (errorPayload);
    }

    await this.matchModel.update(
      {
        homeTeamGoals: body.homeTeamGoals,
        awayTeamGoals: body.awayTeamGoals },
      { where: { id } },
    );
  }
}
