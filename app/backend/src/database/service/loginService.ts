import bcrypt = require('bcryptjs');

import ErrorCode from '../interfaces/Error';
import UsersModel from '../models/user';
import User from '../interfaces/User';

export default class LoginService {
  private model;

  constructor() {
    this.model = UsersModel;
  }

  public async authenticate(email: string, pass: string): Promise<ErrorCode | User> {
    const response = await this.model.findOne({ where: { email } });

    if (!response) {
      const errorPayload = new ErrorCode('Incorrect email or password', 401);
      return errorPayload;
    }

    const passwordDb = response.password;
    const isPasswordOk = bcrypt.compareSync(pass, passwordDb);

    if (!isPasswordOk) {
      const errorPayload = new ErrorCode('Incorrect email or password', 401);
      return errorPayload;
    }
    const { id, username, role } = response;
    const user = { id, username, role, email };

    return user;
  }
}
