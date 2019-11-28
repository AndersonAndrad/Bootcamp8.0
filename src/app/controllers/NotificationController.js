// dependencies
import Notification from '../schemas/Notification';

// models
import User from '../models/User';

class NotificationController {
  async index(req, res){
    // checking if and service provider
    const checkProvider = await User.findOne({
      where: {
        id: req.userID,
        provider: true,
      }
    });

    if(!checkProvider){
      return res
      .status(401)
      .json({Status: 'Error, only providers can load notifications'});
    }

    const notifications = await Notification
    .find({
      user: req.userID,
    })
    .sort({
      createdAt: 'desc',
    })
    .limit(
      20,
    );
    return res.json(notifications);
  }

  async update(req, res){
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
      );

      return res.json(notification);
  }
}

export default new NotificationController();  