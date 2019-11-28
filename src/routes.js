// dependencies
  import {Router} from 'express'
  import multer from 'multer';

// middlewares
  import authMiddleware from './app/Middlewares/auth';

// controllers
  import User from './app/controllers/UserController';
  import Session from './app/controllers/SessionController';
  import File from './app/controllers/FileController';
  import Provider from './app/controllers/ProviderController';
  import Appoitment from './app/controllers/AppoitmentController';
  import Schedule from './app/controllers/ScheduleController';
  import Notification from './app/controllers/NotificationController';

// multer config
  import config from './config/multer';

const router = new Router();
const upload = multer(config);

router.get('/test', (req, res) => {
  return res.json({Status: 'Your application is running...'});
});

router.post('/user', User.store);

router.post('/session', Session.store);

router.use(authMiddleware);

router.put('/user', User.update);

router.post('/files', upload.single('file'), File.store);

router.get('/providers', Provider.index);

router.post('/appoitment', Appoitment.store);

router.get('/appoitment', Appoitment.index);

router.get('/schedule', Schedule.index);

router.get('/notifications', Notification.index);

router.put('/notifications/:id', Notification.update);

export default router;