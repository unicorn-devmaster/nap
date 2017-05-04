const UserResolver = require('../resolvers/UserResolver')

module.exports = (models) => {
  models.UserTC.addResolver({
    name: 'user',
    kind: 'query',
    type: models.UserTC,
    resolve: UserResolver.user
  })

  models.UserTC.addResolver({
    name: 'unlinkFacebook',
    type: models.UserTC,
    resolve: UserResolver.unlinkFacebook
  })

  models.UserTC.addResolver({
    name: 'linkFacebook',
    type: models.UserTC,
    args: {
      accessToken: 'String!'
    },
    resolve: UserResolver.linkFacebook
  })

  models.UserTC.addResolver({
    name: 'changeEmail',
    type: models.UserTC,
    args: {
      email: 'String!'
    },
    resolve: UserResolver.changeEmail
  })
}
