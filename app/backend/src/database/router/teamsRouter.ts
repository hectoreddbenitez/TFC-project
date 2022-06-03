import { Router } from 'express';
import TeamsController from '../controllers/teamsController';

const router: Router = Router();
const teamsController = new TeamsController();

router.get('/teams', teamsController.listAllTeams);
router.get('/teams/:id', teamsController.listTeamsById);

export default router;
