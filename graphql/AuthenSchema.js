const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

// - - - - - - Extra fields - - - - - -

let _extraAuthenSchema = {}
try {
  const { extraAuthenSchema } = require('./custom')
  _extraAuthenSchema = extraAuthenSchema
} catch (err) { err }

// - - - - - - Default fields - - - - - -

const AuthenSchemaObject = {
  // Common
  installationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Installation'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isLoggedIn: { type: Boolean, default: false },
  loggedInAt: Date,
  loggedInWith: String,
  loggedOutAt: Date,
  sessionToken: String,
  accessToken: String,
}

const AuthenSchema = new mongoose.Schema(
  Object.assign(
    AuthenSchemaObject,
    _extraAuthenSchema
  ), {
    timestamps: true,
  }
)

// - - - - - - Plugins - - - - - -

const Authen = mongoose.model('Authen', AuthenSchema)
const AuthenTC = composeWithMongoose(Authen)

// - - - - - - Relation - - - - - -

const { InstallationTC } = require('./InstallationSchema')
const { UserTC } = require('./UserSchema')

// user
AuthenTC.addRelation(
  'user',
  () => ({
    resolver: UserTC.getResolver('findOne'),
    args: {
      filter: (source) => ({ userId: source.userId }),
      skip: null,
      sort: null,
    },
    projection: { userId: true },
  })
)

// installation
AuthenTC.addRelation(
  'installation',
  () => ({
    resolver: InstallationTC.getResolver('findOne'),
    args: {
      filter: (source) => ({ userId: source.installationId }),
      skip: null,
      sort: null,
    },
    projection: { installationId: true },
  })
)

// - - - - - - Extras - - - - - -

const { willInstall } = require('./InstallationSchema')
const { createUser } = require('./UserSchema')

// loginWithFacebook
AuthenTC.addResolver({
  name: 'loginWithFacebook',
  kind: 'mutation',
  args: {
    // Devices
    deviceInfo: 'String',
    locale: 'String',
    country: 'String',
    timezone: 'String',
    deviceName: 'String',
    deviceToken: 'String',

    // Facebook
    accessToken: 'String'
  },
  type: AuthenTC,
  resolve: ({ context, args }) => new Promise(async (resolve) => {
    // Error
    const onError = err => {
      context.nap.errors.push({ code: 403, message: err.message })
      resolve(null)
    }

    // User
    const user = await context.nap.willLoginWithFacebook(context, args.accessToken).then(createUser).catch(onError)

    // Guard
    if (!user) {
      return onError(new Error('Authen error'))
    }

    // Link
    const installation = await willInstall(args).catch(onError)
    const authen = await context.nap.willAuthen(installation.id, user, 'facebook').catch(onError)

    // Fail
    if (!authen) {
      onError(new Error('Authen error'))
      return
    }

    // Succeed
    resolve(authen)
  })
})

// signup
AuthenTC.addResolver({
  name: 'signup',
  kind: 'mutation',
  args: {
    email: 'String',
    password: 'String'
  },
  type: AuthenTC,
  resolve: ({ context, args }) => new Promise(async (resolve) => {
    // Error
    const onError = err => {
      context.nap.errors.push({ code: 403, message: err.message })
      resolve(null)
    }

    // Installation
    const user = await context.nap.willSignUp(context, args.email, args.password).then(createUser).catch(onError)

    // Succeed
    resolve(user)
  })
})

// forget
AuthenTC.addResolver({
  name: 'forget',
  kind: 'mutation',
  args: {
    email: 'String'
  },
  type: AuthenTC,
  resolve: ({ context, args }) => new Promise(async (resolve) => {
    // Error
    const onError = err => {
      context.nap.errors.push({ code: 403, message: err.message })
      return resolve(null)
    }

    // Installation
    const user = await context.nap.willResetPassword(context, args.email).catch(onError)

    // Succeed
    return resolve({
      user: {
        status: user.status
      }
    })
  })
})

// login
AuthenTC.addResolver({
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
  type: AuthenTC,
  resolve: ({ context, args }) => new Promise(async (resolve) => {
    // Error
    const onError = err => {
      context.nap.errors.push({ code: 403, message: err.message })
      return resolve(null)
    }

    // User
    const user = await context.nap.willLogin(context, args.email, args.password).catch(onError)

    // Guard
    if (!user) {
      return onError(new Error('Authen error'))
    }

    // Link
    const installation = await willInstall(args).catch(onError)
    const authen = await context.nap.willAuthen(installation.id, user, 'local').catch(onError)

    // Fail
    if (!authen) {
      return onError(new Error('Authen error'))
    }

    // Succeed
    return resolve(authen)
  })
})

const willLogout = (installationId, userId, sessionToken) => new Promise((resolve, reject) => {
  Authen.findOneAndUpdate({ installationId, userId, sessionToken, isLoggedIn: true }, {
    loggedOutAt: new Date().toISOString(),
    isLoggedIn: false
  }, { new: true, upsert: false }, (err, result) => err ? reject(err) : resolve(result))
})

// logout
AuthenTC.addResolver({
  name: 'logout',
  kind: 'mutation',
  type: AuthenTC,
  resolve: ({ context }) => new Promise(async (resolve, reject) => {
    // Logout from cookie
    context.logout()

    // Guard
    if (!context.nap.currentUser) {
      context.nap.errors.push({ code: 403, message: 'No session found' })
      return resolve(null)
    }

    // Logout
    const authen = await willLogout(context.nap.currentUser.installationId, context.nap.currentUser.userId, context.token)

    // Fail
    if (!authen) {
      return reject(new Error('No session found'))
    }

    // Succeed
    return resolve(authen)
  })
})

// login
AuthenTC.addResolver({
  name: 'authen',
  kind: 'query',
  type: AuthenTC,
  resolve: ({ context }) => new Promise(async (resolve) => {
    // Guard
    if (!context.nap.currentUser) {
      return resolve(null)
    }

    const authen = await new Promise((resolve) => Authen.findOne(
      {
        userId: context.nap.currentUser.userId
      },
      (err, result) => err ? resolve(null) : resolve(result)
    ))

    return authen ? resolve(authen) : resolve(null)
  })
})

// - - - - - - Exports - - - - - -

module.exports = { Authen, AuthenTC }
