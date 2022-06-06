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
  describe('Quando é feita corretamente a requisição, com email e password válidos', async () => {
    let chaiHttpResponse: Response;

    before(async () => {
      sinon.stub(UserModel, 'findOne').resolves({
        id: 1,
        username: 'Admin',
        role: 'admin',
        email: 'admin@admin.com',
        password:
          '$2a$12$tENzvmLDTPQ0XN3JxKBfwuck6sgEb7D9Czg7fGNMG5ssdN.JMJZky',
      } as UserModel);
    });

    after(() => {
      (UserModel.findOne as sinon.SinonStub).restore();
    });

    it('a resposta é um objeto com status code 200, e as chaves user e token', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: '123456' });

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.have.property('user');
      expect(chaiHttpResponse.body).to.have.property('token');
      expect(chaiHttpResponse.body.user).to.not.have.property('password');
    });
  });

  describe('Quando é feita a requisição, com um email inválido', async () => {
    let chaiHttpResponse: Response;

    before(async () => {
      sinon.stub(UserModel, 'findOne').resolves();
    });

    after(() => {
      (UserModel.findOne as sinon.SinonStub).restore();
    });

    it('a resposta é um objeto com status code 401 e a chave message', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'errado@errado.com', password: '123456' });

      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body).to.not.have.property('user');
      expect(chaiHttpResponse.body).to.not.have.property('token');
      expect(chaiHttpResponse.body).to.have.property('message');
      expect(chaiHttpResponse.body.message).to.be.equal(
        'Incorrect email or password'
      );
    });
  });
});
