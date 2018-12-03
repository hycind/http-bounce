(global as any).APP = 'WBR';
import chai from 'chai';
import sinon from 'sinon';

const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);
import { WebServer } from '../src';

const ACE_HOST_IP = process.env.ACE_HOST_IP || '127.0.0.1';
const ACE_HOST_HTTP_PORT = process.env.ACE_HOST_HTTP_PORT || '8080';
const ACE_HTTP_REDIRECT_TO = process.env.ACE_HTTP_REDIRECT_TO || 'https://localhost';
// 
// http://backend.turing.io/module4/lessons/unit_testing_express_server
// 
describe('Web Bouncer test suite', function () {
    beforeEach(() => {
        (global as any).APP = 'WBR';
    });
    it('Should fail when HOST IP env variable is not set', async () => {
        process.env.ACE_HOST_IP = '';
        expect(() => new WebServer()).to.throw('Expected host IP address not set')
    });

    it('Should fail when HOST HTTP PORT env variable is not set', async () => {
        process.env.ACE_HOST_IP = ACE_HOST_IP;
        process.env.ACE_HOST_HTTP_PORT = '';
        expect(() => new WebServer()).to.throw('Expected host HTTP port not set')
    });

    it('Should fail when HOST REDIRECT env variable is not set', async () => {
        process.env.ACE_HOST_IP = ACE_HOST_IP;
        process.env.ACE_HOST_HTTP_PORT = ACE_HOST_HTTP_PORT;
        process.env.ACE_HTTP_REDIRECT_TO = '';
        expect(() => new WebServer()).to.throw('Expected host HTTP redirect not set')
    });

    it('Should redirect for a GET (long url)', async () => {
        process.env.ACE_HTTP_REDIRECT_TO = ACE_HTTP_REDIRECT_TO;
        const server = new WebServer();
        let res: any = await chai.request(server.Server).get('/user/12/code?value=100').redirects(0).catch(err => {
            console.log('ERR')
        });
        expect(res.status).to.equal(302);
        expect(res.text.substring(res.text.lastIndexOf(" ") + 1)).to.equal(process.env.ACE_HTTP_REDIRECT_TO + '/user/12/code?value=100');
        await server.Server.close(() => {
            console.log(`CLOSED`);
        });
    });
});

describe('Error handlers', () => {
    let sandBox: sinon.SinonSandbox, closeStub: sinon.SinonSpy, exitStub, srvStub: sinon.SinonSpy;
    let server: WebServer;

    before(() => {
        process.env.ACE_HOST_HTTP_PORT = '48081';
        server = new WebServer();
    });
    after(async () => {
        await server.Server.close(() => {
            console.log(`CLOSED`);
        });
    });
    beforeEach(() => {
        sandBox = sinon.createSandbox({ useFakeTimers: true });
        closeStub = sandBox.stub(server, <any>'gracefulShutdown');
        exitStub = sandBox.stub(process, 'exit');
    });

    afterEach(() => {
        sandBox.restore();
    })

    it(`should call 'process.on()' when receiving a SIGTERM`, () => {
        process.once('SIGTERM', async () => {
            await sinon.assert.calledOnce(closeStub);
        });
        process.kill(process.pid, 'SIGTERM');
    })

    it(`should call 'server.on()' when receiving a EACCESS`, () => {
        expect(() => { server.Server.emit('EACCESS') }).to.throw('Not authorized');
    })

    it(`should call 'server.on()' when receiving a EADDRINUSE`, () => {
        expect(() => { server.Server.emit('EADDRINUSE') }).to.throw('Port in use');
    })

    it(`should call 'process.on()' when receiving a SIGINT`, () => {
        process.once('SIGINT', async () => {
            await sinon.assert.calledOnce(closeStub);
        });
        process.kill(process.pid, 'SIGINT');
    })
});
