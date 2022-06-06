import { Router } from 'express';
import MatchController from '../controllers/matchesController';
import teamValidator from '../middlewares/matchesMiddleware';

const router: Router = Router();
const matchController = new MatchController();

router.get('/matches', matchController.listAllMatches);
router.post('/matches', teamValidator, matchController.createNewMatch);
router.patch('/matches/:id', matchController.matchScoreUpdate);
router.patch('/matches/:id/finish', matchController.inProgressUpdate);

export default router;
