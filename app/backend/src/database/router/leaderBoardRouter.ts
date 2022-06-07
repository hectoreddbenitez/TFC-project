import { Router } from 'express';
import LeaderBoardController from '../controllers/leaderBoardController';

const router: Router = Router();
const leaderBoardController = new LeaderBoardController();

router.get('/leaderboard/home', leaderBoardController.leaderBoardHome);
router.get('/leaderboard/away', leaderBoardController.leaderBoardAway);

export default router;
