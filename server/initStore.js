const init = async () => {
  // Global
  try {
    const mongoose = require('mongoose')
    NAP.Installation = mongoose.model('Installation')
    NAP.User = mongoose.model('User')
    NAP.Authen = mongoose.model('Authen')
    NAP.Provider = mongoose.model('Provider')
  } catch (err) {
    debug.warn('Mongoose error :', err)
  }
}

module.exports = init