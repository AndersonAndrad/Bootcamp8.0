// dependencies
import express from 'express';

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
  }
  router(){
    this.server.use(routes);
  }
}

export default new App().server;