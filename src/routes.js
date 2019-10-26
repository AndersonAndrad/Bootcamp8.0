// dependencies
import {Router} from 'express'

// middlewares
  // your code here

// controllers
  import User from './app/controllers/UserController';

const router = new Router();

router.get('/test', (req, res) => {
  return res.json({Status: 'Your application is running...'});
});

router.post('/user', User.store);

export default router;