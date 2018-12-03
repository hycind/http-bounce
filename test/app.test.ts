import chai from 'chai';
import chaiHttp = require('chai-http');

import { App } from '../src/app';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Base Route test suite', () => {
  it('Should redirect for a GET ', async () => {
    let res: any = await chai.request(App).get('/').redirects(0).catch(err => {
      console.log('ERR')
    });
    // console.log(`RESPONSE: ${JSON.stringify(res, null, 2)}`)
    expect(res.status).to.equal(302);
  });

  it('Should redirect for a POST ', async () => {
    let res: any = await chai.request(App).post('/').redirects(0).catch(err => {
      console.log('ERR')
    });
    // console.log(`RESPONSE: ${JSON.stringify(res, null, 2)}`)
    expect(res.status).to.equal(302);
  });

  it('Should redirect for a PUT ', async () => {
    let res: any = await chai.request(App).put('/').redirects(0).catch(err => {
      console.log('ERR')
    });
    // console.log(`RESPONSE: ${JSON.stringify(res, null, 2)}`)
    expect(res.status).to.equal(302);
  });

  it('Should redirect for a DELETE ', async () => {
    let res: any = await chai.request(App).del('/').redirects(0).catch(err => {
      console.log('ERR')
    });
    // console.log(`RESPONSE: ${JSON.stringify(res, null, 2)}`)
    expect(res.status).to.equal(302);
  });
});