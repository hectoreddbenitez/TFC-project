import TeamModel from '../models/teams';

export default class TeamService {
  private model;

  constructor() {
    this.model = TeamModel;
  }

  public async findAll(): Promise<TeamModel[]> {
    const response = await this.model.findAll();

    return response as TeamModel[];
  }

  public async findById(id: number): Promise<TeamModel> {
    const response = await this.model.findByPk(id);

    return response as TeamModel;
  }
}
