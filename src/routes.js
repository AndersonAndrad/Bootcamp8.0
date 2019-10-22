// dependencies
import {Router} from 'express'

// middlewares
  // your code here

// controllers
  // your code here

const router = new Router();

router.get('/test', (req, res) => {
  return res.json({Status: 'Your application is running...'});
});

export default router;