import { Router } from 'express';
import loginMiddlewares from '../middlewares/loginMiddlewares';
import LoginControler from '../controllers/loginController';

const router: Router = Router();
const loginController = new LoginControler();

router.post('/login', ...loginMiddlewares, loginController.login);
router.get('/login/validate', loginController.loginValidator);

export default router;
