module.exports = async (config, nextjs) => {
  // Express
  const express = require('express')

  // Create a new Express application.
  const app = express()

  // NAP as First class
  app.use(require('./initNAP'))

  // Static
  app.use(express.static('public'))

  // Mongoose
  const mongoose = await require('./initMongoose')(config.mongo_url)

  // Passport
  config.passportEnabled && require('./initPassport')(config, app, nextjs)

  // GraphQL
  config.graphqlEnabled && require('./initGraphQL')(config, app)

  // Store
  require('./initStore')(mongoose)

  // Express
  await require('./initExpress')(config, app, nextjs)

  // Ready
  debug.info('NAP is ready to use, enjoy! [^._.^]ﾉ彡')
}