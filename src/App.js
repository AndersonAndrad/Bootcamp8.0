// dependencies
import 'dotenv/config';
import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

// config
import SentryConfig from './config/setryConfig';

// files
import routes from './routes';

// database
import './database/index';

class App{
  constructor(){
    this.server = express();

    Sentry.init(SentryConfig);

    this.middlewares();
    this.router();
    this.exceptionHandler();
  }

  middlewares(){
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')));
  }

  router(){
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async(err, req, res, next) => {
      if(process.env.NODE_ENV == 'development') {
      const erros = await new Youch(err, req).toJSON();

      return res.status(500).json(erros);
      }

      return res.status(500).json({Status: 'Error, internal server'});
    })
  }
}

export default new App().server;