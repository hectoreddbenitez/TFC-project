import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';
import Match from './match';

class Team extends Model {
  public id: number;

  public teamName: string;
}

Team.init({
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  teamName: { type: STRING, allowNull: false },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

/**
  * `Workaround` para aplicar as associations em TS:
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

Match.belongsTo(Team, { foreignKey: 'home_team', as: 'teamHome' });
Match.belongsTo(Team, { foreignKey: 'away_team', as: 'teamAway' });

Team.hasMany(Match, { foreignKey: 'id', as: 'teamHome' });
Team.hasMany(Match, { foreignKey: 'id', as: 'teamAway' });

export default Team;
