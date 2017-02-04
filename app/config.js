const config = {}

config.redisStore = {
  url: process.env.REDIS_STORE_URI,
  secret: process.env.EXPRESS_SESSION_SECRET
}

module.exports = config