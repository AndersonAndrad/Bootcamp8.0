// dependencies
import * as yup from 'yup';
import jwt from 'jsonwebtoken';

// model
import User from '../models/User';

// files
import config from '../../config/auth';

class SessionController {
  async store(req, res){
    // validation information
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      password: yup.string().required().min(6),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({Status: 'Error, does not match'});
    }

    // verify user exists
    const {email, password} = req.body;
    
    const user = await User.findOne({where: {email}});

    if(!user){
      return res.status(401).json({Status: 'Error, user not found'});
    }
    
    // verify user password
    if(!(await user.checkPassword(password))){
      return res.status(401).json({error: 'Password does not math'});
    }

    const {id, name} = user;

    return res.json({
      user:{
        name,
        email
      }, token: jwt.sign({id}, config.hash,{expiresIn: config.expiresIn})
    });
  }
}

export default new SessionController();