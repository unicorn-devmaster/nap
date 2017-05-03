require('./debug')
const config = require('./config');

const start = () => {
  // Next
  global.NAP = {};
  const nextjs = require('next')({ dev: config.dev })

  // Will apply middleware
  const initializer = require('./initializer')
  return nextjs.prepare().then(() => initializer(config, nextjs))
}

module.exports = {
  start,
};
