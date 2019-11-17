//dependencies
import { Sequelize, Model } from 'sequelize';

class Appoitment extends Model{
  static init(sequelize){
    super.init({
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE,
    },
    {
      sequelize
    });
    return this
  }
}

export default Appoitment;