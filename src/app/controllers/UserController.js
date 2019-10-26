// dependencies
import * as Yup from 'yup';

// model
import User from '../models/User';

class UserController {
  async store(req, res){
    const schema = Yup.object().shape({
      name: Yup.string().required().min(3),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(6),
      provider: Yup.boolean().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.json({Status: 'Error, check your information'});
    }

    const {name, email, password, provider} = await User.create(req.body);
    
    return res.json({
      name,
      email,
      password,
      provider
    })
  }
}

export default new UserController();