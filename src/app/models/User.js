// dependencies
import {Model} from 'sequelize';
import crypt from 'bcryptjs';

class User extends Model{
  static init(sequelize){
    super.init({
      name: sequelize.STRING,
      email: sequelize.STRING,
      password: sequelize.VIRTUAL,
      password_hash: sequelize.STRING,
      provider: sequelize.BOOLEAN
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