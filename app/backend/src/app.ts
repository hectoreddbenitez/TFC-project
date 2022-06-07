import * as express from 'express';
import loginRouter from './database/router/loginRouter';
import teamsRouter from './database/router/teamsRouter';
import matchesRouter from './database/router/matchesRouter';
import leaderBoardRouter from './database/router/leaderBoardRouter';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
    // ...
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(express.json());
    this.app.use(loginRouter);
    this.app.use(teamsRouter);
    this.app.use(matchesRouter);
    this.app.use(leaderBoardRouter);
  }

  public start(PORT: string | number):void {
    console.log(`rodando na porta ${PORT}`);
    this.app.listen(PORT);
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
