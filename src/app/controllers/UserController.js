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

  async update(req, res){
      const schema = Yup.object().shape({
        name: Yup.string().min(3),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6),
        password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => oldPassword ? field.required() : field),
        confirmPassword: Yup.string().when('password', (password, field) => password ? field.required().oneOf([Yup.ref('password')]) : field)
      });

      if(!(await schema.isValid(req.body))){
        return res.status(401).json({Status: 'Error, validation fail'});
      }

      const {email, oldPassword} = req.body;

      const user = await User.findByPk(req.userID);

      if(email != user.email){
        const userExists = await User.findOne({where: {email}});

        if(userExists){
          return res.status(400).json({Status: 'Error, user already exits'});
        }
      }

      if(oldPassword && !(await user.checkPassword(oldPassword))){
        return res.status(400).json({Status: 'Error, password does not match'});
      }

      const {id, name, provider} = await user.update(req.body);

      return res.json({id, name, email, provider});
  }
}

export default new UserController();