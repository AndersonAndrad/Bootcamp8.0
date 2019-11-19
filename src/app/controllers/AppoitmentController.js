// dendencies
import * as yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

// models
import Appoitment from '../models/Appoitment';
import User from '../models/User';

class AppoitmentController {
  async store(req, res) {
    const schema = yup.object().shape({
      provider_id: yup.number().required(),
      date: yup.date().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({Status: 'Error, validation fails'});
    }

    const {provider_id, date} = req.body;

    // check if provider_id is a provider
    const isProvider = await User.findOne({ 
      where: {
        id: provider_id, provider: true,
      }
    });

    if(!isProvider){
      return res.status(401).json({ Status: 'Error, you can only create appointments with providers'});
    }

    // check for past dates
    const hourStart = startOfHour(parseISO(date));

    if(isBefore(hourStart, new Date())){
      return res.status(400).json({Status: 'Error, past dates are not permited'});
    }

    // check date availability
    const checkAvailability = await Appoitment.findOne({ 
      where: {
        provider_id, 
        canceled_at: null,
        date: hourStart
      }
     });

     if(checkAvailability){
       return res.status(400).json({Status: 'Error, appointment date is not available'});
     }



    const appointment = await Appoitment.create({
      user_id: req.userID,
      provider_id,
      date: hourStart,
    }); 

    return res.json(appointment);
  }
}

export default new AppoitmentController();