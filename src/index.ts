(global as any).APP = 'WBR'

import http from 'http';
import { Logger, HttpLogger } from 'logger';
import { App } from './app';
// 
export class WebServer {
    private server: http.Server;
    private host: string = '';
    private port: number = 0;

    public get Server(): http.Server {
        return this.server;
    }

    constructor() {
        Logger.silly('WebServer/constructor()');
        this.validate();
        this.server = App.listen(this.port, this.host, () => Logger.info(`Server listening on http://${this.host}:${this.port}/`));

        // 
        // TODO: https://stackoverflow.com/questions/43003870/how-do-i-shut-down-my-express-server-gracefully-when-its-process-is-killed
        // 
        this.server.on('EACCESS', () => {
            Logger.error('Not authorized');
            throw new Error('Not authorized');
        });

        this.server.on('EADDRINUSE', () => {
            Logger.error('Port in use');
            throw new Error('Port in use');
        });

        process.on('SIGTERM', () => {
            Logger.info('\nSIGTERM signal received. Closing HTTP server');
            this.gracefulShutdown();
        });

        process.on('SIGINT', () => {
            Logger.info('\SIGINT signal received. Closing HTTP server');
            this.gracefulShutdown();
        });
    }

    private validate() {
        Logger.silly('WebServer/validate()');
        if (!process.env.ACE_HOST_IP) {
            Logger.error('Expected host IP address not set');
            throw new Error('Expected host IP address not set');
        } else {
            this.host = process.env.ACE_HOST_IP;
        }
        if (!process.env.ACE_HOST_HTTP_PORT) {
            Logger.error('Expected host HTTP port not set');
            throw new Error('Expected host HTTP port not set');
        } else {
            this.port = Number(process.env.ACE_HOST_HTTP_PORT);
        }
        if (!process.env.ACE_HTTP_REDIRECT_TO) {
            Logger.error('Expected host HTTP redirect not set');
            throw new Error('Expected host HTTP redirect not set');
        }
        Logger.debug('WebServer/validate()', { hostname: process.env.ACE_HOST_NAME });
    }
    // 
    // TODO: https://stackoverflow.com/questions/43003870/how-do-i-shut-down-my-express-server-gracefully-when-its-process-is-killed
    // 
    private gracefulShutdown() {
        Logger.silly('WebServer/gracefulShutdown()');
        this.server.close(() => {
            Logger.info('Http server closed.');
            process.exit(0);
        });
    }
}

Logger.info('Starting...');
const server = new WebServer().Server;