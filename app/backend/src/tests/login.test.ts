import * as sinon from "sinon";
import * as chai from "chai";
import chaiHttp from "chai-http";

import { app } from "../app";
import User from "../database/models/user";

import { Response } from "superagent";

chai.use(chaiHttp);

const { expect } = chai;

describe("Testando endpoint /login", () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(User, "findOne").resolves({
      id: 1,
      username: "Admin",
      role: "admin",
      email: "stranger@gmail.com",
      password: "demo1234",
    } as User);
  });

  after(() => {
    (User.findOne as sinon.SinonStub).restore();
  });

  it("Quando é feita corretamente a requisição, com email e password válidos", async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post("/login")
      .send({ email: "stranger@gmail.com", password: "demo1234" });

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.have.property("user");
    expect(chaiHttpResponse.body).to.have.property("token");
    expect(chaiHttpResponse.body.user).to.not.have.property("password");
  });

  // it("Seu sub-teste", () => {
  //   expect(false).to.be.eq(true);
  // });
});
