import { Request, Response } from 'express';
import ErrorCode from '../interfaces/Error';
import Authenticator from '../service/auth';
import LoginService from '../service/loginService';

export default class LoginControler {
  constructor(private loginService = new LoginService()) {}

  public login = async (req: Request, res: Response): Promise<Response | undefined> => {
    try {
      const { email, password } = req.body;
      const response = await this.loginService.authenticate(email, password);
      if (response instanceof ErrorCode) {
        return res.status(response.code).json({ message: response.message });
      }
      const token = Authenticator.tokenGenerator(response);

      return res.status(200).json({ user: response, token });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Algo deu errado' });
    }
  };

  public loginValidator = async (
    req: Request,
    res: Response
  ): Promise<Response | undefined> => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: 'Token not found' });
      }
      const response = Authenticator.tokenValidator(token);
      return res.status(200).json(response);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Algo deu errado' });
    }
  };
}
