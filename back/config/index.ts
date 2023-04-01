import { join } from 'path';
require('dotenv').config({ path: join(__dirname, `../../../../.env.${process.env.NODE_ENV}`) });
import database from './database';
import redis from './redis';
import msRedis from './ms-redis';

export default () => {
  return {
    database,
    redis,
    msRedis,
  }
};
