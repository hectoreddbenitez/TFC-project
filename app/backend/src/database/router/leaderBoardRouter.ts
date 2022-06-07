import { Router } from 'express';
import LeaderBoardController from '../controllers/leaderBoardController';

const router: Router = Router();
const leaderBoardController = new LeaderBoardController();

router.get('/leaderboard/home', leaderBoardController.leaderBoardHome);

export default router;
