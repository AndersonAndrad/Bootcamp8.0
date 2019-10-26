// dependencies
import Sequelize from 'sequelize';

// database config
import config from '../config/database';

// models
import User from '../app/models/User';

const models = [];

class Database {
  constructor(){
    this.init();
  }

  init(){
    this.connection = new Sequelize(config);
    models
    .map(model => model.init(this.connection));
  }
}