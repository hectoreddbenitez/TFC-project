import * as sinon from 'sinon';
import * as chai from 'chai';
//  @ts-ignore
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

import { app } from '../app';
import UserModel from '../database/models/user';

import { Response } from 'superagent';

// let chaiLib = <any>chai;
// let chaiRequestLib = chaiLib.default.request;
const { expect } = chai;

describe('Testando endpoint /login', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(UserModel, 'findOne').resolves({
      id: 1,
        username: "Admin",
        role: "admin",
        email: "admin@admin.com",
        password:"$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW",
    } as UserModel);
  });

  after(() => {
    (UserModel.findOne as sinon.SinonStub).restore();
  });

  it('Quando é feita corretamente a requisição, com email e password válidos', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'secret_admin' });
    
    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.have.property('user');
    expect(chaiHttpResponse.body).to.have.property('token');
    expect(chaiHttpResponse.body.user).to.not.have.property('password');
  });

  // it.only('Quando é feita a requisição, com um email inválido', async () => {

  //   chaiHttpResponse = await chai
  //     .request(app)
  //     .post('/login')
  //     .send({ email: 'com', password: 'secret_admin' });
      
  //   console.log(chaiHttpResponse.body);

  //   expect(chaiHttpResponse).to.have.status(401);
  //   expect(chaiHttpResponse.body).to.not.have.property('user');
  //   expect(chaiHttpResponse.body).to.not.have.property('token');
  //   expect(chaiHttpResponse.body).to.have.property('message');
  //   expect(chaiHttpResponse.body.message).to.be('Incorrect email or password');
  // });
});
