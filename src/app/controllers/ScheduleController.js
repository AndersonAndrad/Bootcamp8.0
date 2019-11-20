// dependencies
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

// models
import Appointment from '../models/Appoitment';
import User from '../models/User';

class ScheduleController {
  async index(req, res){
    const checkUserProvider = await User.findOne({
      where:{
        id: req.userID,
        provider: true
      }
    });

    if(!checkUserProvider){
      return res.status(401).json({Status: 'Error, user is not a provider'});
    }

    const { date } = req.query;
    const parseDate = parseISO(date);

    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.userID,
        canceled_at: null,
        date: {
          [Op.between]: [
            startOfDay(parseDate),
            endOfDay(parseDate),
          ]
        },
      },
      order: ['date']
    })

    return res.json(appointment);
  }
}

export default new ScheduleController();