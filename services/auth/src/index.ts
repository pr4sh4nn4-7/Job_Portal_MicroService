import app from './app.js'
import 'dotenv/config'
import { createClient } from 'redis'




export const redisClient = createClient({
  url: process.env.REDIS_URL,
})

redisClient.connect().then(() => console.log('redis connection successfull')).catch(err => console.log(err))








// databse query setup
app.listen(process.env.PORT, () => console.log('server started'))
// databse call


