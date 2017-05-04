const AuthenResolver = require('../resolvers/AuthenResolver')

module.exports = (models) => {
  models.AuthenTC.addRelation(
    'user',
    () => ({
      resolver: models.UserTC.getResolver('findOne'),
      args: {
        filter: (source) => ({ userId: source.userId }),
        skip: null,
        sort: null
      },
      projection: { userId: true }
    })
  )

  models.AuthenTC.addRelation(
    'installation',
    () => ({
      resolver: models.InstallationTC.getResolver('findOne'),
      args: {
        filter: (source) => ({ userId: source.installationId }),
        skip: null,
        sort: null
      },
      projection: { installationId: true }
    })
  )

  models.AuthenTC.addResolver({
    name: 'loginWithFacebook',
    kind: 'mutation',
    args: {
      deviceInfo: 'String',
      locale: 'String',
      country: 'String',
      timezone: 'String',
      deviceName: 'String',
      deviceToken: 'String',

      accessToken: 'String'
    },
    type: models.AuthenTC,
    resolve: AuthenResolver.loginWithFacebook
  })

  models.AuthenTC.addResolver({
    name: 'signup',
    kind: 'mutation',
    args: {
      email: 'String',
      password: 'String'
    },
    type: models.AuthenTC,
    resolve: AuthenResolver.signup
  })

  models.AuthenTC.addResolver({
    name: 'forget',
    kind: 'mutation',
    args: {
      email: 'String'
    },
    type: models.AuthenTC,
    resolve: AuthenResolver.forget
  })

  models.AuthenTC.addResolver({
    name: 'login',
    kind: 'mutation',
    args: {
      // Devices
      deviceInfo: 'String',
      locale: 'String',
      country: 'String',
      timezone: 'String',
      deviceName: 'String',
      deviceToken: 'String',

      // Email, Password
      email: 'String',
      password: 'String'
    },
    type: models.AuthenTC,
    resolve: AuthenResolver.login
  })

  models.AuthenTC.addResolver({
    name: 'logout',
    kind: 'mutation',
    type: models.AuthenTC,
    resolve: AuthenResolver.logout
  })

  models.AuthenTC.addResolver({
    name: 'authen',
    kind: 'query',
    type: models.AuthenTC,
    resolve: AuthenResolver.authen
  })
}
