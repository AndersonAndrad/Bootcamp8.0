// dendencies
import * as yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';

// models
import Appoitment from '../models/Appoitment';
import User from '../models/User';
import File from '../models/File';

// schemas
import Notification from '../schemas/Notification';

// mail configuartion
import Mail from '../../lib/Mail';

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

    if(provider_id == req.userID){
      return res.status(400).json({Status: 'Error, you cannot book a service with yourself'});
    }

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

    // Notify appointment provider
    const user = await User.findByPk(req.userID);
    
    const formattedDate = format(
      hourStart,
      "'for' MMMM dd', at' H:mm'h'"
    );

    await Notification.create({
      content: `${user.name} new appointment ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async index(req, res){
    const { page = 1 } = req.query;

    const appointments = await Appoitment.findAll({
      where:{
        user_id: req.userID,
        canceled_at: null
      },
      order:[ 'date' ],
      attributes:['id','date'],
      limit: 20,
      offset:(page -1)  * 20,
      include:[
        {
          model: User,
          as: 'provider',
          attributes:['id','name'],
          include: [{
            model: File,
            as: 'avatar',
            attributes:['id','path', 'url'],
          }]
        }
      ]
    }); 

    return res.json(appointments);
  }

  async delete(req, res){
    const appointment = await Appoitment.findByPk(req.params.id,
      {
        include: [
          {
            model: User,
            as: 'provider',
            attributes: ['name', 'email']
          },
          {
            model: User,
            as: 'user',
            attributes: ['name']
          }
        ]
      });

    if(appointment.user_id !=  req.userID){
      return res.status(401).json({
        Status: 'Error, you do not have permission to cancel this appointment',
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if(isBefore(dateWithSub, new Date())){
      return res.status(401).json({Status: 'Error: you can only cancel appointments 2 hours in advance'});
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Mail.sendMail({
      to : `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Schedule canceled',
      template: 'cancellation',
      context:{
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          appointment.date,
          "'for' MMMM dd', at' H:mm'h'"
        )
      }
    });

    return res.json(appointment);
  }
}

export default new AppoitmentController();