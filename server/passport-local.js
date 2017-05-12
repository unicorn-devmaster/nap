const { guard } = require('./errors')

const createVerificationURL = (base_url, token) => `${base_url}/auth/local/${token}`
const createPasswordResetURL = (base_url, token) => `${base_url}/auth/reset/${token}`
const createNewPasswordResetURL = (base_url) => `${base_url}/auth/reset`

const willValidateEmail = async (email) => {
  const is = require('is_js')

  guard({ email })

  if (is.not.email(email)) {
    throw new Error('Invalid email')
  }

  return true
}

const willValidatePassword = async (password) => {
  const is = require('is_js')

  guard({ password })

  if (is.not.within(password.length, 5, 256)) {
    throw new Error('Password must be in between 6-256 length')
  }

  return true
}

const willValidateEmailAndPassword = async (email, password) => {
  let isValid = await willValidateEmail(email)
  isValid = isValid && await willValidatePassword(password)
  return isValid
}

const _withHashedPassword = (user, password) => {
  const bcrypt = require('bcryptjs')
  const salt = bcrypt.genSaltSync(10)
  user.hashed_password = bcrypt.hashSync(password, salt)

  return user
}

const _withVerifiedByEmail = (user) => {
  user.token = null
  user.verified = true
  user.verifiedAt = new Date().toISOString()
  user.status = 'VERIFIED_BY_EMAIL'

  return user
}

const _createNewUserData = (email, password, token) => _withHashedPassword(
  {
    email,
    name: email.split('@')[0],
    token,
    role: 'user',
    verified: false,
    status: 'WAIT_FOR_EMAIL_VERIFICATION',
  },
  password
)

const willSignUpNewUser = async (email, password, token) => {
  // Guard existing user
  const user = await NAP.User.findOne({ email })
  if (user) { throw new Error('Email already use') }

  // Create user with email and token, password if any
  const userData = _createNewUserData(email, password, token)
  return await NAP.User.create(userData)
}

const willResetPasswordExistingUser = async (email, token) => {
  // Guard
  guard({ email })
  guard({ token })

  // Use existing user
  const user = await NAP.User.findOne({ email })
  if (!user) { throw new Error('Email not exist') }

  // Wait for reset by token
  user.token = token
  user.status = 'WAIT_FOR_EMAIL_RESET'
  return await user.save()
}

const _willMarkUserAsVerifiedByToken = async (token) => {
  // Guard
  guard(token)

  // Look up user by token
  const user = await NAP.User.findOne({ token })
  if (!user) { throw new Error('Token has been use') }

  return await _withVerifiedByEmail(user).save()
}

const _willVerifyPassword = async (password, hashed_password) => {
  // Guard
  if (!password) {
    throw new Error('Required : password')
  }

  // Guard
  if (!hashed_password) {
    throw new Error('Required : hashed password')
  }

  // Password matched?
  const bcrypt = require('bcryptjs')
  const isEqual = bcrypt.compareSync(password, hashed_password)
  return isEqual
}

const init = (app, passport) => {
  // Before verify
  app.get('/auth/local/:token', (req, res) => {
    // Guard
    const token = req.params.token
    if (!token || token.trim() === '') {
      return res.redirect('/auth/error/token-not-provided')
    }

    // Verify
    _willMarkUserAsVerifiedByToken(token).then(
      () => res.redirect('/auth/verified')
    ).catch(
      err => {
        debug.error(err)
        res.redirect('/auth/error/token-not-exist')
      }
    )
  })

  // After verify
  const LocalStrategy = require('passport-local')
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  }, (email, password, done) => {
    // Find by email
    (async () => {
      const user = await NAP.User.findOne({ email, verified: true }).catch(done)
      const isPasswordMatch = user && await _willVerifyPassword(password, user.hashed_password).catch(done)
      return done(null, isPasswordMatch ? user : false)
    })()
  }))

  // reset-password-by-token
  app.post('/reset-password-by-token', (req, res) => {
    (async () => {
      const token = req.body.token
      const password = req.body.password

      const isValid = await willValidatePassword(password).catch(err => res.json({ errors: [err.message] }))
      if (!isValid) { return res.json({ errors: ['token-invalid'] }) }

      let user = await NAP.User.findOne({ token }).catch(err => res.json({ errors: [err.message] }))
      if (!user) { return res.json({ errors: ['user-not-exist'] }) }

      user = _withHashedPassword(user, password)
      user = _withVerifiedByEmail(user)

      const result = await user.save().catch(err => res.json({ errors: [err.message] }))
      return result ? res.json({ data: { isReset: true } }) : res.json({ data: { isReset: false } })
    })()
  })

  // Route
  app.post('/auth/local', passport.authenticate('local', { failureRedirect: '/auth/error' }), (req, res) => res.redirect('/auth/welcome'))
}

module.exports = init
module.exports.createVerificationURL = createVerificationURL
module.exports.createPasswordResetURL = createPasswordResetURL
module.exports.createNewPasswordResetURL = createNewPasswordResetURL
module.exports.willSignUpNewUser = willSignUpNewUser
module.exports.willValidateEmail = willValidateEmail
module.exports.willValidatePassword = willValidatePassword
module.exports.willValidateEmailAndPassword = willValidateEmailAndPassword
module.exports.willResetPasswordExistingUser = willResetPasswordExistingUser
