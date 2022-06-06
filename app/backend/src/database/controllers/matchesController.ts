import { Request, Response } from 'express';
import ErrorCode from '../interfaces/Error';
import Authenticator from '../service/auth';
import MatchService from '../service/matchService';

const DEU_ERRADO = 'Algo deu errado';
const TOKEN_NOT_FOUND = 'Token not found';

export default class MatchController {
  constructor(private matchService = new MatchService()) {}

  public listAllMatches = async (req: Request, res: Response): Promise<Response> => {
    const isInProgres: string = req.query.inProgress as string;
    if (isInProgres) {
      const filteredMatches = await this.matchService.filterByQuery(isInProgres);
      return res.status(200).json(filteredMatches);
    }
    const allMatches = await this.matchService.findAll();

    return res.status(200).json(allMatches);
  };

  public createNewMatch = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
      const token = req.headers.authorization;
      const newMatch = req.body;
      if (!token) {
        return res.status(401).json({ message: TOKEN_NOT_FOUND });
      }
      Authenticator.tokenValidator(token);

      const response = await this.matchService.create(newMatch);
      if (response instanceof ErrorCode) {
        return res.status(response.code).json({ message: response.message });
      }
      return res.status(201).json(response);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: DEU_ERRADO });
    }
  };

  public inProgressUpdate = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
      const token = req.headers.authorization;
      const { id } = req.params;
      if (!token) {
        return res.status(401).json({ message: TOKEN_NOT_FOUND });
      }
      await Authenticator.tokenValidator(token);

      const response = await this.matchService.inProgressUpdate(JSON.parse(id));
      if (response instanceof ErrorCode) {
        return res.status(response.code).json({ message: response.message });
      }
      return res.status(200).json({ message: 'Finished' });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: DEU_ERRADO });
    }
  };

  public matchScoreUpdate = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
      const token = req.headers.authorization;
      const { id } = req.params;
      const updateScore = req.body;
      if (!token) {
        return res.status(401).json({ message: TOKEN_NOT_FOUND });
      }
      await Authenticator.tokenValidator(token);

      const response = await this.matchService.matchScoreUpdate(JSON.parse(id), updateScore);
      if (response instanceof ErrorCode) {
        return res.status(response.code).json({ message: response.message });
      }
      return res.status(200).json({ message: 'Match updated susecfully!' });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: DEU_ERRADO });
    }
  };
}
