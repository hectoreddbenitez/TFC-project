import { Request, Response } from 'express';
import TeamService from '../service/teamService';

export default class TeamsController {
  constructor(private teamService = new TeamService()) {}

  public listAllTeams = async (_req: Request, res: Response) => {
    const response = await this.teamService.findAll();

    return res.status(200).json(response);
  };

  public listTeamsById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.teamService.findById(JSON.parse(id));

    return res.status(200).json(response);
  };
}
