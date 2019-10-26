// dependencies
import {Sequelize, Model} from 'sequelize';
import crypt from 'bcryptjs';

class User extends Model{
  static init(sequelize){
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN
    },{
      sequelize
    });

    this.addHook('beforeSave', async (user) =>{
      user.password_hash = await crypt.hash(user.password, 8)
    });

    return this;
  }
  checkPassword(password){
    return crypt.compare(password, this.password_hash);
  }

  }

export default User;