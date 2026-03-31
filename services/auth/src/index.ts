import app from './app.js'
import 'dotenv/config'
import { createClient } from 'redis'




export const redisClient = createClient({
  url: process.env.REDIS_URL,
})


redisClient.connect().then(() => console.log('redis connection successfull')).catch(err => console.log(err))

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Local server running'));
}







// databse query setup

export default app

