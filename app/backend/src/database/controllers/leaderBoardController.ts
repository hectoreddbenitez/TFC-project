import { Request, Response } from 'express';
import LeaderBoardService from '../service/leaderBoardService';

const DEU_ERRADO = 'Algo deu errado';

export default class LeaderBoardController {
  constructor(private leaderBoardService = new LeaderBoardService()) {}

  public leaderBoardHome = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
      const leaderBoard = await this.leaderBoardService.orderBoardHome();

      return res.status(200).json(leaderBoard);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: DEU_ERRADO });
    }
  };
}
