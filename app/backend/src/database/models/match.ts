import { Model, BOOLEAN, INTEGER } from 'sequelize';
import db from '.';
// import OtherModel from './OtherModel';

class Match extends Model {
  public id: number;

  public homeTeam: number;

  public homeTeamGoals: number;

  public awayTeam: number;

  public awayTeamGoals: number;

  public inProgress: boolean;

  public dataValues: any;
}

Match.init({
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  homeTeam: { type: INTEGER, allowNull: false },
  homeTeamGoals: { type: INTEGER, allowNull: false },
  awayTeam: { type: INTEGER, allowNull: false },
  awayTeamGoals: { type: INTEGER, allowNull: false },
  inProgress: { type: BOOLEAN, allowNull: false },
}, {
  // UNDERSCORED >>>> converte o camelCase em underline, qundo for true
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

/**
  * `Workaround` para aplicar as associations em TS:
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

export default Match;
