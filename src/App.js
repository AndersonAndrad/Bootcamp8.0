// dependencies
import express from 'express';
import path from 'path';

// files
import routes from './routes';

// database
import './database/index';

class App{
  constructor(){
    this.server = express();

    this.middlewares();
    this.router();
  }

  middlewares(){
    this.server.use(express.json());
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')));
  }

  router(){
    this.server.use(routes);
  }
}

export default new App().server;