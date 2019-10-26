// dependencies

// model
import User from '../models/User';

class UserController {
  async store(req, res){
    return res.json({status: 'User controller store is running '})
  }
}

export default new UserController();