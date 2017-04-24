const { loadSeed, writeSeed, genArray } = require('../helpers');

module.exports = async function generate() {
  const users = loadSeed('user');
  const clogs = loadSeed('clog');
  const episodes = loadSeed('episode');
  users.forEach((user) => {
    user.bookmarks = [];
  });
  users.forEach((user) => {
    genArray(episodes, 30).forEach((ep) => {
      user.bookmarks.push({
        url: `player/${ep._id}`,
        clogId: ep.clogId,
        episodeId: ep._id,
      });
    });
  });
  users.forEach((user) => {
    genArray(clogs, 5).forEach((clog) => {
      user.bookmarks.push({
        url: `book/${clog._id}`,
        clogId: clog._id,
      });
    });
  });
  writeSeed('user', users);
}
