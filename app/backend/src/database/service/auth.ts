import fs = require("fs");
import jwt = require("jsonwebtoken");
import User from "../interfaces/User";

const SECRET = fs.readFileSync("./jwt.evaluation.key", "utf8");
export default class Authenticator {
  public static tokenGenerator(user: User) {
    const jwtConfig = { expiresIn: "7d" };
    const token = jwt.sign({ data: user }, SECRET, jwtConfig);
    return token;
  }

  public static tokenValidator(token: string) {
    const decoded = jwt.verify(token, SECRET) as jwt.JwtPayload;
    console.log({ decoded });
    const { role } = decoded.data;
    return role;
  }
}
