"use strict";
(global as any).APP = 'WBR';
import express from 'express';
import { Logger, HttpLogger } from 'logger';


class App {
    public express: express.Application = <express.Application>{};
    public i = require('morgan')('tiny');

    constructor() {
        Logger.silly('App/constructor()');
        this.express = express();
        this.express.use(HttpLogger);
        this.routes();
    }

    private routes(): void {
        Logger.silly('App/routes()');
        this.express.use(express.Router().use('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            Logger.debug('Rediecting url from ', { remote: req.ip });
            res.redirect(process.env.ACE_HTTP_REDIRECT_TO + req.originalUrl);
        }));
    }
}
export default new App().express;
