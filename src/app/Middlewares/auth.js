// dependencies
import jwt from 'jsonwebtoken';
import config from '../../config/auth';
import {promisify} from 'util'

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({Status: 'Error, token not provider'});
  }

  const [, token] = authHeader.split(' ');

  try{
    const decoded = await promisify(jwt.verify)(token, config.hash);

    req.userID = decoded.id

    return next();
  } catch (err){
    return res.status(401).json({Status: 'Error, token invalid'});
  }
}